import React, { useState } from "react";

export default function Filter({ onFilterChange, totalMovies }) {
  const [show, setShow] = useState(false);

  const [filters, setFilters] = useState({
    genre: "",
    vote_average: "",
    date_min: "",
    date_max: "",
    classement: "",
    by_date: false,
    by_voteaverage: false,
    nb: "", // Correspond à la limite
  });

  const [error, setError] = useState("");

  // Applique les filtres vers le parent
  const applyFilters = () => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
    setShow(false);
  };

  // Déduit la valeur du Select à partir de l'état
  const getSortValue = () => {
    if (filters.by_date && filters.classement === "desc") return "date_desc";
    if (filters.by_date && filters.classement === "asc") return "date_asc";
    if (filters.by_voteaverage && filters.classement === "desc") return "note_desc";
    if (filters.by_voteaverage && filters.classement === "asc") return "note_asc";
    return "";
  };

  // Gestion du nombre de films avec validation
  const handleLimitChange = (e) => {
    const value = e.target.value;
    
    // On met à jour "nb" et non "limit" pour rester cohérent avec ton état initial
    setFilters({ ...filters, nb: value });

    if (totalMovies && Number(value) > totalMovies) {
      setError(`Attention : seulement ${totalMovies} films disponibles.`);
    } else {
      setError("");
    }
  };

  return (
    <>
      {/* Bouton principal */}
      <button
        className="filter-trigger-btn"
        aria-label="open-filters"
        onClick={() => setShow(true)}
      >
        <span>🎬</span> Filtres
      </button>

      {/* Overlay sombre */}
      <div
        className={`overlay ${show ? "open" : ""}`}
        onClick={() => setShow(false)}
      ></div>

      {/* Le panneau latéral */}
      <div className={`filter-panel ${show ? "open" : ""}`}>
        <div className="filter-header">
          <h2>Filtres</h2>
          <button className="close-btn" onClick={() => setShow(false)}>
            ✖
          </button>
        </div>

        <div className="filter-body">
          {/* Genre */}
          <div className="filter-group">
            <label>Genre</label>
            <select
              className="filter-input"
              value={filters.genre}
              onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
            >
              <option value="">Tous les genres</option>
              <option value="Animation">Animation</option>
              <option value="Western">Western</option>
              <option value="Comedy">Comédie</option>
              <option value="War">Guerre</option>
              <option value="Action">Action</option>
              <option value="Crime">Crime</option>
              <option value="TV Movie">Téléfilm</option>
              <option value="History">Histoire</option>
              <option value="Mystery">Mystère</option>
              <option value="Science Fiction">Science-Fiction</option>
              <option value="Romance">Romance</option>
              <option value="Fantasy">Fantastique</option>
              <option value="Music">Musique</option>
              <option value="Horror">Horreur</option>
              <option value="Drama">Drame</option>
              <option value="Documentary">Documentaire</option>
              <option value="Family">Famille</option>
              <option value="Adventure">Aventure</option>
              <option value="Thriller">Thriller</option>
            </select>
          </div>

          {/* Note */}
          <div className="filter-group">
            <label>Note minimum</label>
            <input
              className="filter-input"
              type="number"
              min="0"
              max="10"
              step="0.1"
              placeholder="Ex: 7.5"
              value={filters.vote_average}
              onChange={(e) =>
                setFilters({ ...filters, vote_average: e.target.value })
              }
            />
          </div>

          {/* Période de sortie */}
          <div className="filter-group">
            <label>Période de sortie</label>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input
                className="filter-input"
                type="date"
                value={filters.date_min}
                onChange={(e) =>
                  setFilters({ ...filters, date_min: e.target.value })
                }
                style={{ flex: 1, fontSize: "0.85rem", padding: "10px" }}
              />
              <span style={{ color: "#574d68", fontWeight: "bold" }}>à</span>
              <input
                className="filter-input"
                type="date"
                value={filters.date_max}
                onChange={(e) =>
                  setFilters({ ...filters, date_max: e.target.value })
                }
                style={{ flex: 1, fontSize: "0.85rem", padding: "10px" }}
              />
            </div>
          </div>

          {/* Tri (Combiné) */}
          <div className="filter-group">
            <label>Trier par</label>
            <select
              className="filter-input"
              value={getSortValue()}
              onChange={(e) => {
                const val = e.target.value;
                setFilters({
                  ...filters,
                  by_date: val.startsWith("date"),
                  by_voteaverage: val.startsWith("note"),
                  classement: val.endsWith("asc") ? "asc" : val.endsWith("desc") ? "desc" : "",
                });
              }}
            >
              <option value="">Pertinence</option>
              <option value="date_desc">Date (Plus récents) 🆕</option>
              <option value="date_asc">Date (Plus anciens) ⏳</option>
              <option value="note_desc">Notes (Mieux notés) ⭐</option>
              <option value="note_asc">Notes (Moins bien notés) 📉</option>
            </select>
          </div>

          {/* Limite de résultats */}
          <div className="filter-group">
            <label>Nombre de films à afficher</label>
            <input
              type="number"
              className={`filter-input ${error ? "input-error" : ""}`}
              value={filters.nb}
              onChange={handleLimitChange}
              placeholder="Ex: 10"
            />
            {error && <span className="error-message" style={{ color: "red", fontSize: "0.8rem" }}>{error}</span>}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="filter-footer" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button className="filter-apply-btn" onClick={applyFilters}>
            Appliquer les filtres
          </button>

          <button
            className="filter-apply-btn"
            style={{ backgroundColor: "#f2f7ff", color: "#574d68", boxShadow: "none" }}
            onClick={() => setShow(false)}
          >
            Fermer
          </button>
        </div>
      </div>
    </>
  );
}