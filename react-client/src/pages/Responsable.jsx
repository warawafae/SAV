import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import HistoriqueTable from "./HistoriqueReclamation";
import "./ResponsablePage.css"; // importe ton fichier CSS

function ResponsablePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const enseigne = searchParams.get("enseigne");
  const nomMagasin = searchParams.get("nomMagasin");
  const nomResponsable = searchParams.get("nomResponsable");

  useEffect(() => {
    if (enseigne && nomMagasin && nomResponsable) {
      localStorage.setItem(
        "user",
        JSON.stringify({ enseigne, nomMagasin, nomResponsable })
      );
    }
  }, [enseigne, nomMagasin, nomResponsable]);

  const handleGoToForm = () => {
    navigate("/creer-reclamation", {
      state: { enseigne },
    });
  };

  return (
    <div className="responsable-container">
      <div className="fullscreen-page">
  <h2 className="responsable-title">Bienvenue {nomResponsable}</h2>
  <button className="btn-creer" onClick={handleGoToForm}>
    Créer une réclamation
  </button>
  <HistoriqueTable enseigne={enseigne} />
</div>
    </div>
  );
}

export default ResponsablePage;
