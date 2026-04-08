import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import { MediaCard } from "../components/MediaCard";
import "../styles/ListPage.css";

export const WatchlistPage = () => {
  const { watchlist, addMovieToWatched, removeMovieFromWatchlist } = useContext(GlobalContext);
  const movieItems = watchlist.filter((item) => item.media_type === "movie");
  const seriesItems = watchlist.filter((item) => item.media_type === "tv");

  return (
    <div className="movie-page">
      <div className="container">
        <div className="header">
          <h1 className="heading">Watch Next</h1>
          <span className="count-pill">
            {watchlist.length} {watchlist.length === 1 ? "Title" : "Titles"}
          </span>
        </div>

        {watchlist.length > 0 ? (
          <div className="media-section-stack">
            <section className="media-section">
              <h2 className="media-section-title">Movies</h2>
              {movieItems.length > 0 ? (
                <div className="media-compact-grid">
                  {movieItems.map((item) => (
                    <MediaCard
                      key={item.media_key}
                      item={item}
                      mode="watchlist"
                      onMoveToWatched={addMovieToWatched}
                      onRemove={removeMovieFromWatchlist}
                      compact
                      showMeta={false}
                    />
                  ))}
                </div>
              ) : (
                <p className="media-section-empty">No movies in Watch Next.</p>
              )}
            </section>

            <section className="media-section">
              <h2 className="media-section-title">Series</h2>
              {seriesItems.length > 0 ? (
                <div className="media-compact-grid">
                  {seriesItems.map((item) => (
                    <MediaCard
                      key={item.media_key}
                      item={item}
                      mode="watchlist"
                      onMoveToWatched={addMovieToWatched}
                      onRemove={removeMovieFromWatchlist}
                      compact
                      showMeta={false}
                    />
                  ))}
                </div>
              ) : (
                <p className="media-section-empty">No series in Watch Next.</p>
              )}
            </section>
          </div>
        ) : (
          <h2 className="no-movies">No titles in your list</h2>
        )}
      </div>
    </div>
  );
};
