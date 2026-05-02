// SimilarMovies.jsx
import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // 👈 IL MANQUAIT CETTE LIGNE
import MovieCard from "./MovieCard";

export default function SimilarMovies({ movieId }) {
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!movieId) return;
    setLoading(true);
    axios
      .get(`http://localhost:8000/movies/${movieId}/similar`)
      .then((res) => setSimilar(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [movieId]);

  if (loading) return <p style={{textAlign: 'center', color: '#2b1976'}}>Magie en cours...</p>;
  if (similar.length === 0) return null;

  return (
    <div className="recommendations-container">
      <h2 className="titre-recommandations playfair-police">Vous aimerez aussi...</h2>
      
      <div className="movie-grid-mini"> 
        {similar.map((movie) => (
          <Link to={`/movie/${movie.id}`} key={movie.id} style={{ textDecoration: 'none' }}>
            <MovieCard 
              movie={movie} 
              favorites={[]} 
            />
          </Link>
        ))}
      </div>
    </div>
  );
}