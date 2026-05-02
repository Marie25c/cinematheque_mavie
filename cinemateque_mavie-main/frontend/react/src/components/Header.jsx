import React from "react";
import { Link } from "react-router-dom";
import logo from '../img/logo-v2.png';
import "./Header.css";

export default function Header() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="header-wrapper">

      {/* LOGO */}
      <Link to="/">
        <img className="logo" src={logo} alt="Logo" />
      </Link>

      {/* ACTIONS */}
      <div className="header-actions">
        <Link to="/favoris">❤️</Link>
        <Link to="/user">👤</Link>
      </div>

      {/* HEADER AVEC MASQUE */}
      <header className="cloud-header">
        <div className="header-content">
        </div>
      </header>
      <h1 className="playfair-police titre-h1" >
            Cinématèque Mavie
      </h1>

    </div>
  );
}