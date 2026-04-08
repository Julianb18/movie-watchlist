import React, { useEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash/debounce";
import { ResultCard } from "./ResultCard";
import "../styles/Search.css";

export const Search = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const latestRequestIdRef = useRef(0);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (value, requestId) => {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/search/multi?api_key=${import.meta.env.VITE_TMDB_KEY}&language=en-US&page=1&include_adult=false&query=${value}`
          );
          const data = await response.json();

          if (requestId !== latestRequestIdRef.current) return;

          if (!data.errors) {
            const results = (data.results || [])
              .filter((item) => item.media_type === "movie" || item.media_type === "tv")
              .map((item) => ({
                ...item,
                title: item.title || item.name || "Untitled",
                release_date: item.release_date || item.first_air_date || "",
              }));
            setSearchResults(results);
          } else {
            setSearchResults([]);
          }
        } catch (_error) {
          if (requestId === latestRequestIdRef.current) {
            setSearchResults([]);
          }
        }
      }, 500),
    []
  );

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const onChange = (e) => {
    e.preventDefault();
    const value = e.target.value;

    setQuery(value);
    setShowResults(Boolean(value.trim()));
    if (!value.trim()) {
      debouncedSearch.cancel();
      setSearchResults([]);
      return;
    }

    latestRequestIdRef.current += 1;
    debouncedSearch(value, latestRequestIdRef.current);
  };

  return (
    <div className="global-search">
      <div className="container">
        <div className="add-content" ref={searchRef}>
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Search for movies or series"
              value={query}
              onChange={onChange}
              onFocus={() => setShowResults(Boolean(query.trim()))}
            />
          </div>

          {query.trim() && showResults && (
            <div className="results-modal">
              {searchResults.length > 0 ? (
                <ul className="results">
                  {searchResults.map((movie) => (
                    <li key={movie.id}>
                      <ResultCard movie={movie} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="search-empty">No results found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
