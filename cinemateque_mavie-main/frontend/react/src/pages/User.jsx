import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InfoButton from "../components/InfoButton";

export default function User() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));

    if (stored) {
      if (stored.birthdate) {
        stored.birthdate = stored.birthdate.split("T")[0];
      }

      setUser(stored);
      setForm(stored);
    }

    setIsLoaded(true);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const updateUser = async () => {
    try {
      const updatedFields = {};

      Object.keys(form).forEach((key) => {
        if (form[key] !== user[key]) {
          updatedFields[key] = form[key];
        }
      });

      if (Object.keys(updatedFields).length === 0) {
        alert("Aucune modification");
        setEditingField(null);
        return;
      }

      const res = await fetch(`http://localhost:8000/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });

      if (!res.ok) throw new Error("Erreur mise à jour");

      const updated = await res.json();

      const fullUser = { ...user, ...updated };

      setUser(fullUser);
      setForm(fullUser);
      localStorage.setItem("user", JSON.stringify(fullUser));
      setEditingField(null);

      alert("Profil mis à jour ! ✨");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la mise à jour! \n Votre pseudo est peut-être déjà pris!");
    }
  };

  if (!isLoaded) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Chargement...</p>;
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  const ProfileField = ({ label, name, type = "text" }) => {
    const isEditing = editingField === name;
    const currentValue = form[name];

    return (
      <div style={{ width: "100%", textAlign: "left", marginBottom: "25px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <label style={{ fontWeight: "bold", color: "#574d68", marginLeft: "10px" }}>
            {label}
          </label>

          {!isEditing && (
            <button
              onClick={() => setEditingField(name)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#c8b6ff",
                fontWeight: "bold",
                padding: 0,
              }}
            >
              Modifier ✏️
            </button>
          )}
        </div>

        {isEditing ? (
          <div style={{ display: "flex", gap: "10px" }}>
            {type === "textarea" ? (
              <textarea
                name={name}
                value={currentValue || ""}
                onChange={handleChange}
                autoFocus
                className="filter-input"
              />
            ) : (
              <input
                type={type} 
                name={name}
                value={currentValue || ""}
                onChange={handleChange}
                autoFocus
                className="filter-input"
              />
            )}

            <button
              onClick={updateUser}
              className="filter-apply-btn"
              style={{ width: "auto", padding: "10px 20px" }}
            >
              OK
            </button>
          </div>
        ) : (
          <p
            style={{
              margin: "0 0 0 10px",
              padding: "12px 0",
              borderBottom: "2px solid #f2f7ff",
              color: "#333",
            }}
          >
            {currentValue || (
              <span style={{ color: "#bbb", fontStyle: "italic" }}>
                Non renseigné
              </span>
            )}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="auth-container">
      <h2 style={{ marginBottom: "40px" }}>Mon Profil 👤</h2>

      <div className="auth-form" style={{ alignItems: "stretch" }}>
        <ProfileField label="Pseudo" name="pseudo" />
        <ProfileField label="Nom" name="nom" />
        <ProfileField label="Prénom" name="prenom" />
        <ProfileField label="Email" name="mail" />
        <ProfileField label="Date de naissance" name="birthdate" type="date" />
        <ProfileField label="Biographie" name="biographie" type="textarea" />

        <button
          onClick={() => {
            localStorage.removeItem("user");
            window.location.reload();
          }}
          style={{
            backgroundColor: "#ff7675",
            marginTop: "20px",
            borderRadius: "30px",
            border: "none",
            color: "white",
            padding: "14px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Se déconnecter
        </button>
      </div>

      <InfoButton />
    </div>
  );
}