//UI service +react UI components :couche de Service pour gestion de la communication avec backend 
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import HistoriqueTable from "./HistoriqueReclamation";
import "./ResponsablePage.css";
import axios from "axios";

function ResponsablePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const enseigne = searchParams.get("enseigne");
  const nomMagasin = searchParams.get("nomMagasin");
  const nomResponsable = searchParams.get("nomResponsable");

  // état recherche
  const [searchTerm, setSearchTerm] = useState("");
  const [reclamations, setReclamations] = useState(null);

  useEffect(() => {
    if (enseigne && nomMagasin && nomResponsable) {
      localStorage.setItem(
        "user",
        JSON.stringify({ enseigne, nomMagasin, nomResponsable })
      );
    }
  }, [enseigne, nomMagasin, nomResponsable]);

  //  Recherche contrat selon enseign 
  const handleSearch = async () => {
    if (!enseigne || searchTerm.trim() === "") {
      alert("Veuillez saisir un numéro de contrat");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/api/reclamations", {
        params: { enseigne, contrat: searchTerm.trim() },
      });

      setReclamations(response.data); // mettre résultats
    } catch (err) {
      if (err.response && err.response.status === 404) {
        alert("Aucune réclamation trouvée pour ce contrat");
        setReclamations([]);
      } else {
        console.error("❌ Erreur Axios:", err);
        alert("Erreur lors de la recherche");
      }
    }
  };

  const handleGoToForm = () => {
    navigate("/creer-reclamation", { state: { enseigne } });
  };

  return (
    <div className="responsable-container">
      <div className="fullscreen-page">
        <h2 className="responsable-title">Bienvenue {nomResponsable}</h2>

        {/* Formulaire de recherche */}
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Numéro de contrat"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button onClick={handleSearch}>Rechercher</button>
        </div>

        <button className="btn-creer" onClick={handleGoToForm}>
          Créer une réclamation
        </button>

        {/* Affichage Historique ou Résultats recherche */}
        {reclamations ? (
          <HistoriqueTable enseigne={enseigne} data={reclamations} />
        ) : (
          <HistoriqueTable enseigne={enseigne} />
        )}
      </div>
    </div>
  );
}

export default ResponsablePage;
