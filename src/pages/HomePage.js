import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { GlobalContext } from "../context/GlobalState";
import "../styles/HomePage.css";

const normalizeMedia = (item) => ({
  ...item,
  media_type: item.media_type || "movie",
  title: item.title || item.name || "Untitled",
  release_date: item.release_date || item.first_air_date || "",
  media_key: `${item.media_type || "movie"}-${item.id}`,
});

const RailCard = ({ item, onAddWatchlist, onAddWatched, watchlist, watched }) => {
  const mediaKey = `${item.media_type || "movie"}-${item.id}`;
  const inWatchlist = watchlist.some((entry) => entry.media_key === mediaKey);
  const inWatched = watched.some((entry) => entry.media_key === mediaKey);
  const year = item.release_date ? item.release_date.substring(0, 4) : "-";

  return (
    <article className="rail-card">
      {item.poster_path ? (
        <img
          src={`http://image.tmdb.org/t/p/w300${item.poster_path}`}
          alt={`${item.title} poster`}
        />
      ) : (
        <div className="rail-card-fallback">No image</div>
      )}
      <div className="rail-card-content">
        <h3>{item.title}</h3>
        <p>
          {year} · {item.media_type === "tv" ? "Series" : "Movie"}
        </p>
        <div className="rail-card-actions">
          <button className="btn" disabled={inWatchlist || inWatched} onClick={() => onAddWatchlist(item)}>
            Watchlist
          </button>
          <button className="btn" disabled={inWatched} onClick={() => onAddWatched(item)}>
            Watched
          </button>
        </div>
      </div>
    </article>
  );
};

const HomeRail = ({ title, items, onAddWatchlist, onAddWatched, watchlist, watched }) => {
  const railRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const syncRailButtons = () => {
    const rail = railRef.current;
    if (!rail) return;

    const maxScrollLeft = rail.scrollWidth - rail.clientWidth;
    setCanScrollLeft(rail.scrollLeft > 4);
    setCanScrollRight(rail.scrollLeft < maxScrollLeft - 4);
  };

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    syncRailButtons();

    rail.addEventListener("scroll", syncRailButtons);
    window.addEventListener("resize", syncRailButtons);
    return () => {
      rail.removeEventListener("scroll", syncRailButtons);
      window.removeEventListener("resize", syncRailButtons);
    };
  }, [items]);

  const scrollRail = (direction) => {
    const rail = railRef.current;
    if (!rail) return;

    const firstCard = rail.querySelector(".rail-card");
    if (!firstCard) return;

    const cardWidth = firstCard.getBoundingClientRect().width;
    const gap = 16;
    const stepWidth = cardWidth + gap;
    const cardsPerView = Math.max(1, Math.floor(rail.clientWidth / stepWidth));
    const scrollAmount = cardsPerView * stepWidth;

    rail.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="home-rail-section">
      <div className="home-rail-header">
        <h2>{title}</h2>
      </div>

      <div className="home-rail-shell">
        <button
          className="rail-nav rail-nav-left"
          type="button"
          onClick={() => scrollRail("left")}
          disabled={!canScrollLeft}
          aria-label={`Scroll ${title} left`}
        >
          <span>&lsaquo;</span>
        </button>

        <div className="home-rail" ref={railRef}>
          {items.map((item) => (
            <RailCard
              key={`${item.media_type}-${item.id}`}
              item={item}
              onAddWatchlist={onAddWatchlist}
              onAddWatched={onAddWatched}
              watchlist={watchlist}
              watched={watched}
            />
          ))}
        </div>

        <button
          className="rail-nav rail-nav-right"
          type="button"
          onClick={() => scrollRail("right")}
          disabled={!canScrollRight}
          aria-label={`Scroll ${title} right`}
        >
          <span>&rsaquo;</span>
        </button>
      </div>
    </section>
  );
};

export const HomePage = () => {
  const { addMovieToWatchlist, addMovieToWatched, watchlist, watched } = useContext(GlobalContext);
  const [trending, setTrending] = useState([]);
  const [newReleases, setNewReleases] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const apiKey = import.meta.env.VITE_TMDB_KEY;
    if (!apiKey) return;

    const load = async () => {
      try {
        const [trendingResponse, movieReleaseResponse, tvReleaseResponse] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}`),
          fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`),
          fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${apiKey}&language=en-US&page=1`),
        ]);

        const [trendingData, movieReleaseData, tvReleaseData] = await Promise.all([
          trendingResponse.json(),
          movieReleaseResponse.json(),
          tvReleaseResponse.json(),
        ]);

        if (!isMounted) return;

        const trendingItems = (trendingData.results || [])
          .filter((item) => item.media_type === "movie" || item.media_type === "tv")
          .map(normalizeMedia)
          .slice(0, 20);

        const releaseItems = [...(movieReleaseData.results || []), ...(tvReleaseData.results || [])]
          .map((item) => normalizeMedia(item))
          .sort(
            (a, b) =>
              new Date(b.release_date || "1970-01-01") - new Date(a.release_date || "1970-01-01")
          )
          .slice(0, 20);

        setTrending(trendingItems);
        setNewReleases(releaseItems);
      } catch (_error) {
        if (isMounted) {
          setTrending([]);
          setNewReleases([]);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const hasRows = useMemo(() => trending.length > 0 || newReleases.length > 0, [trending, newReleases]);

  return (
    <div className="movie-page home-page">
      <div className="container">
        <div className="header">
          <h1 className="heading">Dashboard</h1>
        </div>

        {!hasRows ? <p className="home-empty">Add your TMDB key to load dashboard rails.</p> : null}

        <HomeRail
          title="Trending Now"
          items={trending}
          onAddWatchlist={addMovieToWatchlist}
          onAddWatched={addMovieToWatched}
          watchlist={watchlist}
          watched={watched}
        />

        <HomeRail
          title="New Releases"
          items={newReleases}
          onAddWatchlist={addMovieToWatchlist}
          onAddWatched={addMovieToWatched}
          watchlist={watchlist}
          watched={watched}
        />
      </div>
    </div>
  );
};
