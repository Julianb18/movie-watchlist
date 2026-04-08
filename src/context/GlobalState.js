import React, { createContext, useReducer, useEffect, useMemo, useRef } from "react";
import AppReducer from "./AppReducer";
import { useAuth } from "./AuthContext";
import { supabase } from "../lib/supabaseClient";

// Global state is used to access the context from every component

// initial state
const getMediaType = (item) => item.media_type || "movie";
const getTitle = (item) => item.title || item.name || "Untitled";
const getReleaseDate = (item) => item.release_date || item.first_air_date || "";
const getMediaKey = (item) => `${getMediaType(item)}-${item.id}`;

const normalizeMedia = (item) => ({
  ...item,
  media_type: getMediaType(item),
  title: getTitle(item),
  release_date: getReleaseDate(item),
  media_key: getMediaKey(item),
});

const getInitialState = () => {
  const watchlist = localStorage.getItem("watchlist")
    ? JSON.parse(localStorage.getItem("watchlist")).map(normalizeMedia)
    : [];
  const watched = localStorage.getItem("watched")
    ? JSON.parse(localStorage.getItem("watched")).map(normalizeMedia)
    : [];

  return { watchlist, watched };
};

const getLocalCollections = () => ({
  watchlist: localStorage.getItem("watchlist")
    ? JSON.parse(localStorage.getItem("watchlist")).map(normalizeMedia)
    : [],
  watched: localStorage.getItem("watched")
    ? JSON.parse(localStorage.getItem("watched")).map(normalizeMedia)
    : [],
});

const mergeCollections = (remoteCollections, localCollections) => {
  const watchlistMap = new Map();
  const watchedMap = new Map();

  [...remoteCollections.watchlist, ...localCollections.watchlist].forEach((item) => {
    watchlistMap.set(item.media_key, normalizeMedia(item));
  });

  [...remoteCollections.watched, ...localCollections.watched].forEach((item) => {
    watchedMap.set(item.media_key, normalizeMedia(item));
  });

  // If an item exists in watched, remove it from watchlist.
  watchedMap.forEach((_value, mediaKey) => {
    watchlistMap.delete(mediaKey);
  });

  return {
    watchlist: Array.from(watchlistMap.values()),
    watched: Array.from(watchedMap.values()),
  };
};

// create context
export const GlobalContext = createContext(getInitialState());

// provider components
export const GlobalProvider = (props) => {
  const { user, isConfigured } = useAuth();
  const [state, dispatch] = useReducer(AppReducer, undefined, getInitialState);
  const hasHydratedRef = useRef(false);

  const hydrateFromRemote = async (userId) => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("user_watchlist")
      .select("*")
      .eq("user_id", userId);

    if (error) return;

    const remoteCollections = {
      watchlist: [],
      watched: [],
    };

    (data || []).forEach((row) => {
      const item = normalizeMedia({
        id: row.movie_id,
        media_type: row.media_type,
        title: row.title,
        release_date: row.release_date,
        poster_path: row.poster_path,
      });

      if (row.list_type === "watched") {
        remoteCollections.watched.push(item);
      } else {
        remoteCollections.watchlist.push(item);
      }
    });

    const localCollections = getLocalCollections();
    const mergedCollections = mergeCollections(remoteCollections, localCollections);

    const remoteUpserts = [
      ...mergedCollections.watchlist.map((item) => ({
        user_id: userId,
        movie_id: item.id,
        media_type: item.media_type,
        list_type: "watchlist",
        title: item.title,
        release_date: item.release_date || null,
        poster_path: item.poster_path || null,
      })),
      ...mergedCollections.watched.map((item) => ({
        user_id: userId,
        movie_id: item.id,
        media_type: item.media_type,
        list_type: "watched",
        title: item.title,
        release_date: item.release_date || null,
        poster_path: item.poster_path || null,
      })),
    ];

    if (remoteUpserts.length > 0) {
      await supabase
        .from("user_watchlist")
        .upsert(remoteUpserts, { onConflict: "user_id,movie_id,media_type" });
    }

    dispatch({ type: "HYDRATE_COLLECTIONS", payload: mergedCollections });
  };

  useEffect(() => {
    if (!user || !isConfigured) {
      hasHydratedRef.current = false;
      return;
    }

    if (!hasHydratedRef.current) {
      hasHydratedRef.current = true;
      hydrateFromRemote(user.id);
    }
  }, [user, isConfigured]);

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(state.watchlist));
    localStorage.setItem("watched", JSON.stringify(state.watched));
  }, [state]);

  const upsertRemote = async (movie, listType) => {
    if (!user || !supabase) return;

    const normalizedMovie = normalizeMedia(movie);
    await supabase.from("user_watchlist").upsert(
      {
        user_id: user.id,
        movie_id: normalizedMovie.id,
        media_type: normalizedMovie.media_type,
        list_type: listType,
        title: normalizedMovie.title,
        release_date: normalizedMovie.release_date || null,
        poster_path: normalizedMovie.poster_path || null,
      },
      { onConflict: "user_id,movie_id,media_type" }
    );
  };

  const deleteRemote = async (mediaKey) => {
    if (!user || !supabase) return;
    const [media_type, rawId] = mediaKey.split("-");
    const movieId = Number(rawId);
    if (!movieId) return;

    await supabase
      .from("user_watchlist")
      .delete()
      .eq("user_id", user.id)
      .eq("movie_id", movieId)
      .eq("media_type", media_type);
  };

  // actions
  const addMovieToWatchlist = (movie) => {
    const normalizedMovie = normalizeMedia(movie);
    dispatch({ type: "ADD_MOVIE_TO_WATCHLIST", payload: normalizedMovie });
    upsertRemote(normalizedMovie, "watchlist");
  };

  const removeMovieFromWatchlist = (mediaKey) => {
    dispatch({ type: "REMOVE_MOVIE_FROM_WATCHLIST", payload: mediaKey });
    deleteRemote(mediaKey);
  };

  const addMovieToWatched = (movie) => {
    const normalizedMovie = normalizeMedia(movie);
    dispatch({ type: "ADD_MOVIE_TO_WATCHED", payload: normalizedMovie });
    upsertRemote(normalizedMovie, "watched");
  };

  // move back to watchlist

  const moveToWatchlist = (movie) => {
    const normalizedMovie = normalizeMedia(movie);
    dispatch({ type: "MOVE_TO_WATCHLIST", payload: normalizedMovie });
    upsertRemote(normalizedMovie, "watchlist");
  };

  // remove from watched

  const removeFromWatched = (mediaKey) => {
    dispatch({ type: "REMOVE_FROM_WATCHED", payload: mediaKey });
    deleteRemote(mediaKey);
  };

  const value = useMemo(
    () => ({
      watchlist: state.watchlist,
      watched: state.watched,
      addMovieToWatchlist,
      removeMovieFromWatchlist,
      addMovieToWatched,
      moveToWatchlist,
      removeFromWatched,
    }),
    [state.watchlist, state.watched]
  );

  return (
    <GlobalContext.Provider value={value}>
      {props.children}
    </GlobalContext.Provider>
  );
};
