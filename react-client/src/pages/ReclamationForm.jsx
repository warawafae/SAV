import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

function ReclamationForm({ onSuccess }) {
  const [searchParams] = useSearchParams();
  const enseigneParam = searchParams.get("enseigne") || "";
  const nomMagasinParam = searchParams.get("nomMagasin") || "";

  const [form, setForm] = useState({
    telephoneClient: "",
    nomClient: "",
    enseigne: enseigneParam,
    nomMagasin: nomMagasinParam,
    libelle: "",
    contrat: "",
    technicien: "",
    emailTechnicien: "",
    specialite: "",
    produit: "",
    type: "",
    description: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setForm((prev) => ({
        ...prev,
        enseigne: user.enseigne || "",
        nomMagasin: user.nomMagasin || ""
      }));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`/api/reclamation/${form.enseigne}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    onSuccess(data);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500, display: "grid", gap: 15 }}>
      
      <label htmlFor="libelle">Libellé</label>
      <input
        id="libelle"
        name="libelle"
        placeholder="Libellé"
        value={form.libelle}
        onChange={handleChange}
      />

      <label htmlFor="nomClient">Nom client</label>
      <input
        id="nomClient"
        name="nomClient"
        placeholder="Nom client"
        value={form.nomClient}
        onChange={handleChange}
      />

      <label htmlFor="nomMagasin">Nom du magasin</label>
      <input
        id="nomMagasin"
        name="nomMagasin"
        value={form.nomMagasin}
        disabled
        style={{ backgroundColor: "#f0f0f0" }}
      />

      <label htmlFor="enseigne">Enseigne</label>
      <input
        id="enseigne"
        name="enseigne"
        value={form.enseigne}
        disabled
        style={{ backgroundColor: "#f0f0f0" }}
      />

      <label htmlFor="contrat">Contrat</label>
      <input
        id="contrat"
        name="contrat"
        placeholder="Contrat"
        value={form.contrat}
        onChange={handleChange}
      />

      <label htmlFor="technicien">Technicien</label>
      <input
        id="technicien"
        name="technicien"
        placeholder="Technicien"
        value={form.technicien}
        onChange={handleChange}
      />

      <label htmlFor="emailTechnicien">Email technicien</label>
      <input
        id="emailTechnicien"
        name="emailTechnicien"
        placeholder="Email technicien"
        value={form.emailTechnicien}
        onChange={handleChange}
      />

      <label htmlFor="specialite">Spécialité</label>
      <input
        id="specialite"
        name="specialite"
        placeholder="Spécialité"
        value={form.specialite}
        onChange={handleChange}
      />

      <label htmlFor="telephoneClient">Téléphone client</label>
      <input
        id="telephoneClient"
        name="telephoneClient"
        placeholder="Téléphone client"
        value={form.telephoneClient}
        onChange={handleChange}
      />

      <label htmlFor="produit">Produit</label>
      <input
        id="produit"
        name="produit"
        placeholder="Produit"
        value={form.produit}
        onChange={handleChange}
      />

      <label htmlFor="type">Type</label>
      <input
        id="type"
        name="type"
        placeholder="Type"
        value={form.type}
        onChange={handleChange}
      />

      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      ></textarea>

      <button type="submit">Envoyer</button>
    </form>
  );
}

export default ReclamationForm;
