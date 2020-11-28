import React, { useState } from "react";
import { ResultCard } from "./ResultCard";

export const Add = () => {
  // storing what is typed in the input field
  const [query, setQuery] = useState("");
  // storing all the found results from the api
  const [searchResults, setSearchResults] = useState([]);

  const onChange = (e) => {
    e.preventDefault();

    setQuery(e.target.value);
    // console.log(query);
    fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=1&include_adult=false&query=${e.target.value}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (!data.errors) {
          // data.results is from the console results given back from the api request
          setSearchResults(data.results);
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
              placeholder=" Search for a movie"
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
