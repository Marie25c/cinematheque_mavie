import React from "react";
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import '../App.css';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import Filter from '../components/Filter' ;
import Clouds from "../components/Clouds";
import InfoButton from "../components/InfoButton";

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [limit, setLimit] = useState("");
  const [filters, setFilters] = useState({
    genre: "",
    vote_average: null,
    classement: null,
    by_date: false,
    by_voteaverage: false,
    nb: null,
  });

  const [favorites, setFavorites] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const fetchFavorites = () => {
  if (!user) return;

  fetch(`http://localhost:8000/users/${user.id}/favorites`)
    .then((res) => res.json())
    .then((data) => setFavorites(data))
    .catch((err) => console.error(err));
};

  // Fonction pour charger les films (au démarrage ou recherche vide)
  const fetchMovies = (url) => {
    setLoading(true);
    setError(null);
    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error("Erreur lors de la récupération des données");
        return response.json();
      })
      .then(data => {
        setMovies(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur, le back-end n'est pas lancé :", err);
        setError("Impossible de charger les films. Le serveur est-il allumé ?  :C");
        setLoading(false);
      });
  };

  // Chargement initial
  useEffect(() => {
    fetchMovies("http://localhost:8000/movies");
    fetchFavorites();
  }, []);

  const toggleFavorite = async (movieId) => {
  const isFavorite = favorites.some(
    (fav) => fav.movie_id === movieId
  );

  if (isFavorite) {
    await fetch(
      `http://localhost:8000/users/${user.id}/favorites/${movieId}`,
      { method: "DELETE" }
    );
  } else {
    await fetch(
      `http://localhost:8000/users/${user.id}/favorites/${movieId}`,
      { method: "POST" }
    );
  }

  fetchFavorites(); // refresh
};

  // Gestion de la recherche
  const handleSearch = (query) => {
    if (query.trim() === "") {
      fetchMovies("http://localhost:8000/movies");
    } else {
      fetchMovies(`http://localhost:8000/movies/search?rech=${query}`);
    }
  };

  // Remplacez votre ancienne fonction handleFilterChange par celle-ci
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

  return (
    <>
    <Clouds />
    <div className="page">
      <div className="search-and-filter-wrapper">
        <SearchBar />
        <Filter onFilterChange={handleFilterChange}  
            totalMovies={movies.length} 
           setLimit={setLimit} />
      </div>
      {/* Gestion des états : Chargement et Erreur */}
      {loading && <p style={{ textAlign: 'center', marginTop: '20px' }}>Chargement des films...</p>}
      {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>{error}</p>}

      {/* Affichage de la grille de films */}
      {!loading && !error && (
        <div className="movie-grid" style={{ marginTop: '40px' }}>
          {movies.length > 0 ? (
            movies.map((movie, index) => (
              <MovieCard
                key={movie.id || index}
                movie={movie}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                userId={user?.id}
              />
            ))
          ) : (
            <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>Aucun film trouvé.</p>
          )}
        </div>
      )}
      <InfoButton/>
    </div>
    </>
  );
}

export default Home;
