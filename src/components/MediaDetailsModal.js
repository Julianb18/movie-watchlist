import React, { useEffect, useMemo, useState } from "react";
import "../styles/MediaDetailsModal.css";

const formatRuntime = (details, mediaType) => {
  if (mediaType === "movie") {
    const runtime = details.runtime;
    if (!runtime) return "Unknown";
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return `${hours}h ${minutes}m`;
  }

  const tvRuntime = Array.isArray(details.episode_run_time) ? details.episode_run_time[0] : null;
  if (!tvRuntime) return "Unknown";
  return `${tvRuntime} min/episode`;
};

export const MediaDetailsModal = ({ item, isOpen, onClose }) => {
  const [details, setDetails] = useState(null);
  const [trailerKey, setTrailerKey] = useState("");
  const [showTrailer, setShowTrailer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !item) return;

    const mediaType = item.media_type || "movie";
    const apiKey = import.meta.env.VITE_TMDB_KEY;
    if (!apiKey) {
      setError("TMDB API key is missing.");
      return;
    }

    let isMounted = true;

    const loadDetails = async () => {
      setLoading(true);
      setError("");
      setShowTrailer(false);
      setTrailerKey("");

      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/${mediaType}/${item.id}?api_key=${apiKey}&language=en-US&append_to_response=videos`
        );
        const data = await response.json();

        if (!isMounted) return;
        if (data?.success === false) {
          setError("Could not load details for this title.");
          setDetails(null);
        } else {
          const videos = Array.isArray(data?.videos?.results) ? data.videos.results : [];
          const trailer = videos.find(
            (video) => video.site === "YouTube" && video.type === "Trailer"
          );
          const teaser = videos.find(
            (video) => video.site === "YouTube" && video.type === "Teaser"
          );
          setTrailerKey(trailer?.key || teaser?.key || "");
          setDetails(data);
        }
      } catch (_err) {
        if (!isMounted) return;
        setError("Something went wrong loading details.");
        setDetails(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDetails();

    return () => {
      isMounted = false;
    };
  }, [isOpen, item]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onEscape);
    };
  }, [isOpen, onClose]);

  const info = useMemo(() => {
    if (!details || !item) return null;
    const mediaType = item.media_type || "movie";
    return {
      title: details.title || details.name || item.title,
      poster: details.poster_path || item.poster_path,
      overview: details.overview || "No description available.",
      rating: details.vote_average ? details.vote_average.toFixed(1) : "N/A",
      genres: (details.genres || []).map((genre) => genre.name).join(", ") || "N/A",
      runtime: formatRuntime(details, mediaType),
      releaseDate: details.release_date || details.first_air_date || "Unknown",
      language: (details.original_language || "N/A").toUpperCase(),
      mediaType: mediaType === "tv" ? "Series" : "Movie",
    };
  }, [details, item]);

  if (!isOpen || !item) return null;

  return (
    <div className="media-details-backdrop" onClick={onClose}>
      <div className="media-details-modal" onClick={(event) => event.stopPropagation()}>
        <button className="media-details-close" type="button" onClick={onClose} aria-label="Close details">
          ×
        </button>

        {loading ? <p className="media-details-status">Loading details...</p> : null}
        {error ? <p className="media-details-status error">{error}</p> : null}

        {!loading && !error && info ? (
          <div className="media-details-layout">
            {info.poster ? (
              <img src={`http://image.tmdb.org/t/p/w500${info.poster}`} alt={`${info.title} poster`} />
            ) : (
              <div className="media-details-fallback">No image</div>
            )}

            <div className="media-details-content">
              <h2>{info.title}</h2>
              <p className="media-details-subtitle">{info.mediaType}</p>

              {trailerKey ? (
                <div className="media-details-trailer-actions">
                  <button className="btn" type="button" onClick={() => setShowTrailer((prev) => !prev)}>
                    {showTrailer ? "Hide Trailer" : "Watch Trailer"}
                  </button>
                </div>
              ) : (
                <p className="media-details-subtitle">Trailer unavailable</p>
              )}

              {showTrailer && trailerKey ? (
                <div className="media-details-trailer-frame">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailerKey}`}
                    title={`${info.title} trailer`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              ) : null}

              <p className="media-details-overview">{info.overview}</p>

              <div className="media-details-grid">
                <div>
                  <strong>Runtime</strong>
                  <span>{info.runtime}</span>
                </div>
                <div>
                  <strong>Release</strong>
                  <span>{info.releaseDate}</span>
                </div>
                <div>
                  <strong>Rating</strong>
                  <span>{info.rating} / 10</span>
                </div>
                <div>
                  <strong>Language</strong>
                  <span>{info.language}</span>
                </div>
                <div className="full">
                  <strong>Genres</strong>
                  <span>{info.genres}</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
