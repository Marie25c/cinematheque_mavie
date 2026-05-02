import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InfoButton from "../components/InfoButton";

export default function Login() {
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pseudo, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.detail || "Identifiants incorrects");
        return;
      }

      const user = await res.json();

      localStorage.setItem("user", JSON.stringify(user));
      navigate("/"); 
      window.location.reload(); 
    } catch (err) {
      console.error(err);
      setError("Erreur serveur, impossible de joindre l'API");
    }
  };

  return (
    <div className="auth-container">
      <h2>Connexion</h2>
      <form onSubmit={handleLogin} className="auth-form">
        <input
          placeholder="Pseudo"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Se connecter</button>
      </form>
      <p>
        <Link to="/register">
          Pas de compte ? S'inscrire
        </Link>
      </p>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      <InfoButton/>
    </div>
  );
}