import { useNavigate } from "react-router-dom";
import React from "react";

export default function MovieCard({
  movie,
  favorites,
  onToggleFavorite,
}) {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // Vérifier si le film est en favoris
  const isFavorite = favorites?.some(
    (fav) => fav.movie_id === movie.id
  );

  const year = movie.release_date
  ? new Date(movie.release_date).getFullYear()
  : "";

  const handleClick = () => {
    if (!user) {
      const goLogin = window.confirm(
        "Tu dois être connecté pour ajouter aux favoris ❤️\n\nVoulez-vous vous connecter ?"
      );

      if (goLogin) {
        window.location.href = "/login";
      }
      return;
    }

    onToggleFavorite(movie.id);
  };

  return (
  <div onClick={() => navigate(`/movie/${movie.id}`)} className="movie-card">
    <div className="image-container" style={{ position: "relative" }}>
      {movie.poster_url ? (
        <img src={movie.poster_url} alt={movie.title} />
      ) : (
        <div className="placeholder-image">Aucune image</div>
      )}
      <div className="rating-badge">{movie.vote_average} 🌟</div>
      
      <button className="heart-btn" onClick={(e) => {
          e.stopPropagation();
          handleClick();
      }}>
        {isFavorite ? "❤️" : "🤍"}
      </button>
    </div>

    <div className="card-content" style={{ padding: '10px 5px' }}>
      <h3 className="marcellus-regular" style={{ fontSize: '1.1rem', margin: '8px 0 4px' }}>
        {movie.title}
      </h3>
      <div className="card-info" style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.8 }}>
        <p className="comfortaa-police" style={{ fontSize: '0.85rem' }}>{movie.genre}</p>
        <p className="comfortaa-police" style={{ fontSize: '0.85rem' }}>{year}</p>
      </div>
    </div>
  </div>
);
}