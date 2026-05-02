import React from "react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import Filter from "../components/Filter";
import SearchBar from "../components/SearchBar";
import "./Search.css";
import InfoButton from "../components/InfoButton";

export default function Search() {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [limit, setLimit] = useState("");
  const [filters, setFilters] = useState({});

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("q") || "";

  const fetchMovies = (url) => {
    fetch(url).then((res) => res.json()).then(setMovies);
  };

  const fetchFavorites = () => {
    if (!user) return;
    fetch(`http://localhost:8000/users/${user.id}/favorites`)
      .then((res) => res.json())
      .then(setFavorites);
  };

  useEffect(() => {
    if (query) {
      fetchMovies(`http://localhost:8000/movies/search?rech=${query}`);
    } else {
      fetchMovies("http://localhost:8000/movies");
    }
    fetchFavorites();
  }, [query]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);

    const params = new URLSearchParams();

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== null && value !== "" && value !== false) {
        params.append(key, value);
      }
    });
    
    if (limit) {
      params.append("nb", limit);
    }

    const url = `http://localhost:8000/movies/search?${params.toString()}`;
    fetchMovies(url);
  };

  const toggleFavorite = async (movieId) => {
    if (!user) return;
    const isFavorite = favorites.some((fav) => fav.movie_id === movieId);
    const method = isFavorite ? "DELETE" : "POST";
    await fetch(`http://localhost:8000/users/${user.id}/favorites/${movieId}`, { method });
    fetchFavorites();
  };

  return (
    <div className="page">
      <header className="search-header">
        {/* Groupe de nuages à gauche */}
        <div className="clouds-left-group">
          <div className="cloud-base cloud-r"><p>Recherche :</p></div>
          <div className="cloud-base cloud-q"><p>"{query || "..."}"</p></div>
          <div className="cloud-base cloud-s"><p>{movies.length} films</p></div>
        </div>

        {/* Barre de recherche à droite */}
        <div className="search-and-filter-wrapper">
          <SearchBar />
          <Filter onFilterChange={handleFilterChange}
                  totalMovies={movies.length} // 
                 setLimit={setLimit} />
        </div>
      </header>

      <div className="container">
        <div className="movie-grid">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            ))
          ) : (
            <p className="no-results">Aucun film trouvé 🎬</p>
          )}
        </div>
      </div>
      <InfoButton/>
    </div>
  );
}