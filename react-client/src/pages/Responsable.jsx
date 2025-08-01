import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import HistoriqueTable from "./HistoriqueReclamation";

function ResponsablePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const enseigne = searchParams.get("enseigne");
  const nomMagasin = searchParams.get("nomMagasin");
  const nomResponsable = searchParams.get("nomResponsable");

  // Stocker dans localStorage pour usage global si besoin
  useEffect(() => {
    if (enseigne && nomMagasin && nomResponsable) {
      localStorage.setItem("user", JSON.stringify({ enseigne, nomMagasin, nomResponsable }));
    }
  }, [enseigne, nomMagasin, nomResponsable]);

  const handleGoToForm = () => {
    navigate("/creer-reclamation", {
      state: { enseigne }
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Bienvenue {nomResponsable}</h2>
      <button onClick={handleGoToForm} style={{ marginBottom: "20px" }}>
        Créer une réclamation
      </button>
      <HistoriqueTable enseigne={enseigne} />
    </div>
  );
}

export default ResponsablePage;
