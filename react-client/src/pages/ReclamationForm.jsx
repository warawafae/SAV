import './ReclamationForm.css';
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
    statut_reclamation:"ouverte",
  });

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

  useEffect(() => {
    if (form.enseigne) {
      axios
        .get(`/api/techniciens/specialites?enseigne=${form.enseigne}`)
        .then((res) => {
          setSpecialites(res.data);
          setSpecialite("");
          setTechniciens([]);
          setTechnicien("");
        })
        .catch((err) => console.error("Erreur chargement spécialités:", err));
    }
  }, [form.enseigne]);

  useEffect(() => {
    if (specialite && form.enseigne) {
      axios
        .get(`/api/techniciens/techniciens?enseigne=${form.enseigne}&specialite=${encodeURIComponent(specialite)}`)
        .then((res) => {
          setTechniciens(res.data);
          setTechnicien("");
        })
        .catch((err) => console.error("Erreur chargement techniciens:", err));
    } else {
      setTechniciens([]);
      setTechnicien("");
    }
  }, [specialite, form.enseigne]);

  useEffect(() => {
    const selectedTech = techniciens.find(
      (tech) => tech.nom_complet_technicien === technicien
    );
    setForm((prev) => ({
      ...prev,
      emailTechnicien: selectedTech ? selectedTech.email_technicien : "",
    }));
  }, [technicien, techniciens]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const bodyToSend = {
  nom_client: form.nomClient,
  numero_telephone: form.telephoneClient,
  libelle: form.libelle,
  contrat: form.contrat,
  nom_responsable: JSON.parse(localStorage.getItem("user"))?.nomResponsable || "", 
  nom_magasin: form.nomMagasin,
  enseigne: form.enseigne,
  specialite_technicien: specialite,
  nom_technicien: technicien,
  email_technicien: form.emailTechnicien,
  motif: form.motif,
  statut_reclamation:form.statut_reclamation
};


    try {
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
    <div className="form-container">
      <div className="logo-container">
        {form.enseigne === 'marjane' && (
          <img src="/images/Marjane-logo.png" alt="Marjane" className="logo" />
        )}
        {form.enseigne === 'electroplanet' && (
          <img src="/images/Nouveau_logo_electroplanet.png" alt="Electroplanet" className="logo zoom-electro" />
        )}
      </div>

      <form onSubmit={handleSubmit} className="reclamation-form">
        <div className="form-row">
          <div className="form-col">
            <label htmlFor="nomClient">Nom client</label>
            <input id="nomClient" name="nomClient" value={form.nomClient} onChange={handleChange} required />
            <label htmlFor="staturec">statut de reclamation</label>
            <input id="staturec" name="statutrec" value={form.statut_reclamation} onChange={handleChange} required />

            <label htmlFor="telephoneClient">Téléphone client</label>
            <input id="telephoneClient" name="telephoneClient" value={form.telephoneClient} onChange={handleChange} required />

            <label htmlFor="nomMagasin">Nom du magasin</label>
            <input id="nomMagasin" name="nomMagasin" value={form.nomMagasin} disabled />

            <label htmlFor="enseigne">Enseigne</label>
            <input id="enseigne" name="enseigne" value={form.enseigne} disabled />
          </div>

          <div className="form-col">
            <label htmlFor="contrat">Contrat</label>
            <input id="contrat" name="contrat" value={form.contrat} onChange={handleChange} />

            <label htmlFor="specialite">Spécialité</label>
            <select id="specialite" value={specialite} onChange={(e) => setSpecialite(e.target.value)} required>
              <option value="">-- Choisir une spécialité --</option>
              {specialites.map((sp) => (
                <option key={sp} value={sp}>{sp}</option>
              ))}
            </select>

            <label htmlFor="technicien">Technicien</label>
            <select id="technicien" value={technicien} onChange={(e) => setTechnicien(e.target.value)} required>
              <option value="">-- Choisir un technicien --</option>
              {techniciens.map((tech) => (
                <option key={tech.nom_complet_technicien} value={tech.nom_complet_technicien}>
                  {tech.nom_complet_technicien}
                </option>
              ))}
            </select>

            <label htmlFor="emailTechnicien">Email technicien</label>
            <input id="emailTechnicien" name="emailTechnicien" value={form.emailTechnicien} disabled />
          </div>
        </div>

        <div className="form-full">
          <label htmlFor="libelle">Libellé</label>
          <input id="libelle" name="libelle" value={form.libelle} onChange={handleChange} required />

          <label htmlFor="motif">Motif</label>
          <textarea id="motif" name="motif" value={form.motif} onChange={handleChange} required />

          <button type="submit">Envoyer</button>
        </div>
      </form>
    </div>
  );
}

export default ReclamationForm;
