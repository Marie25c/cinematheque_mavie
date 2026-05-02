import React from "react";

export default function About() {
  return (
    <div className="page" style={{ textAlign: "center", marginTop: "20px" }}>
      
      {/* On utilise une "carte" comme pour Login/Register pour garder la cohérence */}
      <div style={{
          backgroundColor: "white",
          padding: "50px 40px",
          borderRadius: "30px",
          boxShadow: "0 10px 30px rgba(200, 182, 255, 0.3)",
          maxWidth: "800px",
          margin: "0 auto"
      }}>
        
        {/* Section Présentation */}
        <h2 style={{ fontSize: "2.8rem", color: "#2b1976", marginBottom: "20px" }} className="playfair-police">
          Présentation
        </h2>
        <p style={{ fontSize: "1.1rem", color: "#574d68", lineHeight: "1.6", marginBottom: "60px" }}>
          Cinémathèque_mavie est une plateforme pour rechercher, explorer, découvrir des films. 
          Recherchez facilement des œuvres par genre, triez-les selon vos envies.
          Inscrivez-vous et sauvegarder vos films préférés !
        </p>

        {/* Section À propos */}
        <h2 style={{ fontSize: "2.8rem", color: "#2b1976", marginBottom: "20px" }} className="playfair-police">
          A propos de nous
        </h2>
        <p style={{ fontSize: "1.1rem", color: "#574d68", lineHeight: "1.6" }}>
          Site développé avec passion par <strong>mc</strong> et <strong>syl</strong>.
          <br /><br />
          Si vous rencontrez un problème, veuillez nous contacter à :<br />
          <a href="mailto:sylrie@ouimail.com" style={{ color: "#8E54E9", fontWeight: "bold", textDecoration: "none", fontSize: "1.2rem" }}>
            sylrie@ouimail.com
          </a>
        </p>

      </div>
    </div>
  );
}