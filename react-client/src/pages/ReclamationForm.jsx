import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

function ReclamationForm({ onSuccess }) {
  const [searchParams] = useSearchParams();
  const enseigneParam = searchParams.get("enseigne") || "";
  const nomMagasinParam = searchParams.get("nomMagasin") || "";

  const [specialites, setSpecialites] = useState([]);
  const [techniciens, setTechniciens] = useState([]);
  const [specialite, setSpecialite] = useState("");
  const [technicien, setTechnicien] = useState("");

  const [form, setForm] = useState({
    telephoneClient: "",
    nomClient: "",
    enseigne: enseigneParam,
    nomMagasin: nomMagasinParam,
    libelle: "",
    contrat: "",
    emailTechnicien: "",
    motif: "",
  });

  // Remplit enseigne et magasin depuis localStorage si dispo
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setForm((prev) => ({
        ...prev,
        enseigne: user.enseigne || enseigneParam,
        nomMagasin: user.nomMagasin || nomMagasinParam,
      }));
    }
  }, [enseigneParam, nomMagasinParam]);

  // Charge les spécialités selon l'enseigne
  useEffect(() => {
    if (form.enseigne) {
      axios
        .get(`/api/techniciens/specialites?enseigne=${form.enseigne}`)
        .then((res) => {
  // res.data est un tableau simple de chaînes, pas d'objets
  // const specs = res.data.map((s) => s.spécialité); <-- à corriger
  const specs = res.data;  // directement res.data, c'est déjà un tableau de strings
  setSpecialites(specs);
  setSpecialite("");
  setTechniciens([]);
  setTechnicien("");
})

        .catch((err) => console.error("Erreur chargement spécialités:", err));
    }
  }, [form.enseigne]);

  // Charge les techniciens disponibles selon spécialité et enseigne
  useEffect(() => {
    if (specialite && form.enseigne) {
      axios
        .get(
          `/api/techniciens/techniciens?enseigne=${form.enseigne}&specialite=${encodeURIComponent(
            specialite
          )}`
        )
        .then((res) => {
          setTechniciens(res.data); // ex: [{nom_complet_technicien, email_technicien}, ...]
          setTechnicien("");
        })
        .catch((err) => console.error("Erreur chargement techniciens:", err));
    } else {
      setTechniciens([]);
      setTechnicien("");
    }
  }, [specialite, form.enseigne]);

  // Met à jour email technicien quand sélection change
  useEffect(() => {
    const selectedTech = techniciens.find(
      (tech) => tech.nom_complet_technicien === technicien
    );
    if (selectedTech) {
      setForm((prev) => ({
        ...prev,
        emailTechnicien: selectedTech.email_technicien || "",
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        emailTechnicien: "",
      }));
    }
  }, [technicien, techniciens]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bodyToSend = {
        ...form,
        spécialité_technicien: specialite,
        nom_technicien: technicien,
      };
      const res = await fetch(`/api/reclamations/${form.enseigne}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyToSend),
      });
      const data = await res.json();
      onSuccess(data);
    } catch (error) {
      console.error("Erreur lors de l'envoi de la réclamation:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: 500, display: "grid", gap: 15 }}
    >
      <label htmlFor="libelle">Libellé</label>
      <input
        id="libelle"
        name="libelle"
        placeholder="Libellé"
        value={form.libelle}
        onChange={handleChange}
        required
      />

      <label htmlFor="nomClient">Nom client</label>
      <input
        id="nomClient"
        name="nomClient"
        placeholder="Nom client"
        value={form.nomClient}
        onChange={handleChange}
        required
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

      <label htmlFor="specialite">Spécialité</label>
      <select
        id="specialite"
        value={specialite}
        onChange={(e) => setSpecialite(e.target.value)}
        required
      >
        <option value="">-- Choisir une spécialité --</option>
        {specialites.map((sp) => (
          <option key={sp} value={sp}>
            {sp}
          </option>
        ))}
      </select>

      <label htmlFor="technicien">Technicien</label>
      <select
        id="technicien"
        value={technicien}
        onChange={(e) => setTechnicien(e.target.value)}
        required
      >
        <option value="">-- Choisir un technicien disponible --</option>
        {techniciens.map((tech) => (
          <option key={tech.nom_complet_technicien} value={tech.nom_complet_technicien}>
            {tech.nom_complet_technicien}
          </option>
        ))}
      </select>

      <label htmlFor="emailTechnicien">Email technicien</label>
      <input
        id="emailTechnicien"
        name="emailTechnicien"
        placeholder="Email technicien"
        value={form.emailTechnicien}
        disabled
        style={{ backgroundColor: "#f0f0f0" }}
      />

      <label htmlFor="telephoneClient">Téléphone client</label>
      <input
        id="telephoneClient"
        name="telephoneClient"
        placeholder="Téléphone client"
        value={form.telephoneClient}
        onChange={handleChange}
        required
      />

      <label htmlFor="motif">Motif</label>
      <textarea
        id="motif"
        name="motif"
        placeholder="Motif de la réclamation"
        value={form.motif}
        onChange={handleChange}
        required
      ></textarea>

      <button type="submit">Envoyer</button>
    </form>
  );
}

export default ReclamationForm;
