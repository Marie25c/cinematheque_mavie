import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InfoButton from "../components/InfoButton";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    pseudo: "",
    password: "",
    nom: "",
    prenom: "",
    mail: "",
    birthdate: "",
    biographie: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...form,
      birthdate: form.birthdate === "" ? null : form.birthdate
    };

    try {
      const res = await fetch("http://localhost:8000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend), 
      });

      if (!res.ok) throw new Error("Erreur création compte");

      alert("Compte créé avec succès 🎉");

      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création du compte\nAssurez-vous d'avoir bien fournis toutes les informations!\nSi c'est bien le cas votre pseudo semble déjà existé!");
    }
  };

  return (
    <div className="auth-container">
      
      <h2>Créer un compte</h2>

      <form onSubmit={handleSubmit} className="auth-form">

        <input
          name="pseudo"
          placeholder="Pseudo"
          value = {form.pseudo}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Mot de passe"
          value = {form.password}
          onChange={handleChange}
        />

        <input
          name="nom"
          placeholder="Nom"
          value = {form.nom}
          onChange={handleChange}
        />

        <input
          name="prenom"
          placeholder="Prénom"
          value = {form.prenom}
          onChange={handleChange}
        />

        <input
          name="mail"
          placeholder="Email"
          value = {form.mail}
          onChange={handleChange}
        />

        <input
          name="birthdate"
          type="date"
          value = {form.birthdate}
          onChange={handleChange}
        />

        <textarea
          name="biographie"
          placeholder="Biographie"
          value = {form.biographie}
          onChange={handleChange}
        />

        <button type="submit">
          Créer mon compte
        </button>
      </form>
      <InfoButton/>
    </div>
  );
}