import React from "react";
import { useSearchSdk } from "./seach-movie-sdk/logic";

function App() {
  const { movies, loading } = useSearchSdk();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Movies</h1>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {movies.map((movie) => (
          <li key={movie.imdbID} style={{ marginBottom: "20px" }}>
            <img
              src={movie.Poster}
              alt={movie.Title}
              style={{ maxWidth: "100px" }}
            />
            <h2>{movie.Title}</h2>
            <p>{movie.Type}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
