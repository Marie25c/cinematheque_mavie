import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./MovieDetail.css";
import SimilarMovies from "../components/SimilarMovies";
import InfoButton from "../components/InfoButton";

export default function MovieDetail() {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?.id;
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);

  // Chargement film
  useEffect(() => {
    fetch(`http://localhost:8000/movies/data?id=${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Film non trouvé");
        return res.json();
      })
      .then((data) => setMovie(data))
      .catch((err) => setError(err.message));
  }, [id]);

  // Vérifier si déjà en favoris
  useEffect(() => {
  if (!userId) return;

  fetch(`http://localhost:8000/users/${userId}/favorites/${id}`)
    .then((res) => {
      if (!res.ok) return { is_favorite: false };
      return res.json();
    })
    .then((data) => setIsFavorite(data.is_favorite))
    .catch(() => setIsFavorite(false));
}, [id, userId]);

  const handleFavorite = async () => {
  if (!userId) {
    const goLogin = window.confirm(
      "Tu dois être connecté pour ajouter aux favoris ❤️\n\nVoulez-vous vous connecter ?"
    );

    if (goLogin) {
      window.location.href = "/login";
    }
    return;
  }

  const newState = !isFavorite;
  setIsFavorite(newState);
  setLoadingFav(true);

  const method = newState ? "POST" : "DELETE";

  try {
    await fetch(
      `http://localhost:8000/users/${userId}/favorites/${id}`,
      {
        method,
      }
    );
  } catch (err) {
    console.error("Erreur favoris :", err);
    setIsFavorite(!newState);
  } finally {
    setLoadingFav(false);
  }
};

  if (error)
    return <p style={{ color: "#37474f", textAlign: "center" }}>{error}</p>;

  if (!movie)
    return <p style={{ color: "#37474f", textAlign: "center" }}>Chargement...</p>;

  const formattedDate = movie.release_date
    ? movie.release_date.split("-").reverse().join(".")
    : "N/A";

  return (
    <div className="page-movied">
      <div
        className="movied-blurred-bg"
        style={{ backgroundImage: `url(${movie.poster_url})` }}
      />

      <div className="movied-card">
        <img
          className="movied-image"
          src={movie.poster_url}
          alt={movie.title}
        />

        <div className="movied-info">
          <h1 className="marcellus-regular">{movie.title}</h1>

          <div className="movied-meta comfortaa-police">
            <span>⭐ {movie.vote_average?.toFixed(1) || "N/A"}</span>
            {movie.genre && <span>🎭 {movie.genre}</span>}
            <span>🌍 {movie.original_language?.toUpperCase() || "N/A"}</span>
            <span>📅 {formattedDate}</span>
          </div>

          <p className="overviewd comfortaa-police">{movie.overview}</p>

          <button
            className={`favorite-btnd ${
              isFavorite ? "is-fav" : "not-fav"
            }`}
            onClick={handleFavorite}
            disabled={loadingFav}
          >
            {loadingFav
              ? "..."
              : isFavorite
              ? "❤️ Favori"
              : "🤍 Ajouter"}
          </button>
        </div>
      </div>

      <div className="recommendations-section">
        <SimilarMovies movieId={id} />
      </div>
      <InfoButton/>
    </div>
  );
}