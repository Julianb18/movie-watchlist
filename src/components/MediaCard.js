import React from "react";
import "../styles/MediaCard.css";

const getMediaKey = (item) => `${item.media_type || "movie"}-${item.id}`;

export const MediaCard = ({
  item,
  mode,
  watchlist = [],
  watched = [],
  onAddWatchlist,
  onAddWatched,
  onMoveToWatchlist,
  onMoveToWatched,
  onRemove,
  compact = false,
  showMeta = true,
}) => {
  const mediaKey = getMediaKey(item);
  const inWatchlist = watchlist.some((entry) => entry.media_key === mediaKey);
  const inWatched = watched.some((entry) => entry.media_key === mediaKey);
  const isTracked = inWatchlist || inWatched;
  const year = item.release_date ? item.release_date.substring(0, 4) : "-";

  return (
    <article className={`media-card ${compact ? "compact" : ""} ${isTracked ? "tracked" : ""}`}>
      {item.poster_path ? (
        <img src={`http://image.tmdb.org/t/p/w300${item.poster_path}`} alt={`${item.title} poster`} />
      ) : (
        <div className="media-card-fallback">No image</div>
      )}

      <div className="media-card-content">
        <h3>{item.title}</h3>
        {showMeta ? (
          <p>
            {year} · {item.media_type === "tv" ? "Series" : "Movie"}
          </p>
        ) : null}

        <div className="media-card-actions">
          {mode === "discover" ? (
            <>
              {isTracked ? (
                <p className="media-card-state">{inWatched ? "In Seen" : "In Watch Next"}</p>
              ) : null}
              <button className="btn" disabled={inWatchlist || inWatched} onClick={() => onAddWatchlist(item)}>
                Watchlist
              </button>
              <button className="btn" disabled={inWatched} onClick={() => onAddWatched(item)}>
                Watched
              </button>
            </>
          ) : null}

          {mode === "watchlist" ? (
            <>
              <button className="btn" onClick={() => onMoveToWatched(item)}>
                Move to Watched
              </button>
              <button className="btn btn-danger" onClick={() => onRemove(item.media_key)}>
                Remove
              </button>
            </>
          ) : null}

          {mode === "watched" ? (
            <>
              <button className="btn" onClick={() => onMoveToWatchlist(item)}>
                Move to Watchlist
              </button>
              <button className="btn btn-danger" onClick={() => onRemove(item.media_key)}>
                Remove
              </button>
            </>
          ) : null}
        </div>
      </div>
    </article>
  );
};
