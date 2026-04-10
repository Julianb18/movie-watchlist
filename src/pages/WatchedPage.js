import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import { MediaCard } from "../components/MediaCard";
import "../styles/ListPage.css";

export const WatchedPage = () => {
  const { watched, moveToWatchlist, removeFromWatched } = useContext(GlobalContext);
  const movieItems = watched.filter((item) => item.media_type === "movie");
  const seriesItems = watched.filter((item) => item.media_type === "tv");

  return (
    <div className="movie-page">
      <div className="container">
        <div className="list-page-header">
          <div className="list-page-header-meta">
            <span className="count-pill">
              {watched.length} {watched.length === 1 ? "Title" : "Titles"}
            </span>
          </div>
          <h1 className="heading">Watched</h1>
        </div>

        {watched.length > 0 ? (
          <div className="media-section-stack">
            <section className="media-section">
              <h2 className="media-section-title">Movies</h2>
              {movieItems.length > 0 ? (
                <div className="media-compact-grid">
                  {movieItems.map((item) => (
                    <MediaCard
                      key={item.media_key}
                      item={item}
                      mode="watched"
                      onMoveToWatchlist={moveToWatchlist}
                      onRemove={removeFromWatched}
                      compact
                      showMeta={false}
                    />
                  ))}
                </div>
              ) : (
                <p className="media-section-empty">No watched movies yet.</p>
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
                      mode="watched"
                      onMoveToWatchlist={moveToWatchlist}
                      onRemove={removeFromWatched}
                      compact
                      showMeta={false}
                    />
                  ))}
                </div>
              ) : (
                <p className="media-section-empty">No watched series yet.</p>
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
