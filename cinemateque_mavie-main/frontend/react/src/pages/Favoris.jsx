import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import InfoButton from "../components/InfoButton";

export default function Favoris() {
  const [movies, setMovies] = useState([]); // Les films complets à afficher
  const [favorites, setFavorites] = useState([]); // Les IDs des favoris
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // Sécurité : si on n'est pas connecté, on retourne au login
    if (!user) {
      navigate("/login");
      return;
    }

    // On va chercher les favoris de l'utilisateur ET la liste des films en même temps
    Promise.all([
      fetch(`http://localhost:8000/users/${user.id}/favorites`).then((res) => res.json()),
      fetch(`http://localhost:8000/movies`).then((res) => res.json())
    ])
      .then(([favData, allMoviesData]) => {
        setFavorites(favData);
        
        // On isole juste les IDs des films favoris
        const favMovieIds = favData.map((f) => f.movie_id);
        
        // On filtre le catalogue pour ne garder QUE les films qui sont dans nos favoris
        const filteredMovies = allMoviesData.filter((m) => favMovieIds.includes(m.id));
        
        setMovies(filteredMovies);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur de chargement:", err);
        setLoading(false);
      });
  }, [user, navigate]);

  // Fonction pour retirer un favori directement depuis cette page
  const toggleFavorite = async (movieId) => {
    try {
      // On le supprime de la base de données
      await fetch(`http://localhost:8000/users/${user.id}/favorites/${movieId}`, {
        method: "DELETE",
      });

      // On met à jour l'écran immédiatement pour faire disparaître la carte
      setFavorites((prev) => prev.filter((fav) => fav.movie_id !== movieId));
      setMovies((prev) => prev.filter((m) => m.id !== movieId));
    } catch (error) {
      console.error("Erreur lors de la suppression du favori", error);
    }
  };

  return (
    // On utilise la classe "page" pour avoir les mêmes marges que sur l'Accueil
    <div className="page">
      <h2 style={{ textAlign: "center", marginBottom: "50px", color: "#574d68", fontSize: "2.2rem" }}>
        Mes Films Favoris ❤️
      </h2>

      {loading ? (
        <p style={{ textAlign: "center", fontSize: "1.1rem" }}>Chargement de vos coups de cœur...</p>
      ) : movies.length > 0 ? (
        
        // Si on a des favoris, on affiche la belle grille !
        <div className="movie-grid">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              userId={user.id}
            />
          ))}
        </div>

      ) : (

        // S'il n'y a pas de favoris, on affiche un joli message et un bouton pour retourner à l'accueil
        <div style={{ textAlign: "center", marginTop: "60px", backgroundColor: "white", padding: "40px", borderRadius: "25px", boxShadow: "0 10px 30px rgba(200, 182, 255, 0.3)" }}>
          <span style={{ fontSize: "3rem" }}>🍿</span>
          <h3 style={{ color: "#574d68", marginTop: "15px" }}>Votre liste est vide</h3>
          <p style={{ color: "#636e72", marginBottom: "25px" }}>
            Vous n'avez pas encore ajouté de films à vos favoris.
          </p>
          <Link 
            to="/" 
            style={{ 
              display: "inline-block", 
              padding: "12px 30px", 
              backgroundColor: "#c8b6ff", 
              color: "white", 
              borderRadius: "30px", 
              textDecoration: "none", 
              fontWeight: "bold",
              transition: "0.3s"
            }}
          >
            Découvrir des films
          </Link>
        </div>
      )}
      <InfoButton/>
    </div>
  );
}