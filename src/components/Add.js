import React, { useState } from "react";
import { ResultCard } from "./ResultCard";
import "../styles/Add.css";

export const Add = () => {
  // storing what is typed in the input field
  const [query, setQuery] = useState("");
  // storing all the found results from the api
  const [searchResults, setSearchResults] = useState([]);

  const onChange = (e) => {
    e.preventDefault();
    const value = e.target.value;

    setQuery(value);
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${import.meta.env.VITE_TMDB_KEY}&language=en-US&page=1&include_adult=false&query=${value}`
    )
      .then((response) => response.json())
      .then((data) => {
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
      });
  };

  return (
    <div className="add-page">
      <div className="container">
        <div className="add-content">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder=" Search for movies or series"
              value={query}
              onChange={onChange}
            />
          </div>

          {searchResults.length > 0 && (
            <ul className="results">
              {searchResults.map((movie) => (
                <li key={movie.id}>
                  <ResultCard movie={movie} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
