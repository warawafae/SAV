import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import HistoriqueTable from "./HistoriqueReclamation";

function ResponsablePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const enseigne = searchParams.get("enseigne");
  const nomResponsable = searchParams.get("nom");

  const [reclamations, setReclamations] = useState([]);

  useEffect(() => {
    const enseigne = searchParams.get("enseigne");
    const nomMagasin = searchParams.get("nomMagasin");
    const nomResponsable = searchParams.get("nomResponsable");

    if (enseigne && nomMagasin && nomResponsable) {
      localStorage.setItem("user", JSON.stringify({ enseigne, nomMagasin, nomResponsable }));
    }
  }, [searchParams]);

  // Si nouvelle réclamation vient de la page formulaire
  useEffect(() => {
    const newRec = location.state?.newRec;
    if (newRec) {
      setReclamations(prev => [...prev, newRec]);
    }
  }, [location.state]);

  const handleGoToForm = () => {
    navigate("/creer-reclamation", {
      state: { enseigne }
    });
  };

  return (
    <div>
      <h2>Bienvenue {nomResponsable}</h2>
      <button onClick={handleGoToForm}>Créer une réclamation</button>

      <h3>Historique de réclamation</h3>
      <HistoriqueTable data={reclamations} />
    </div>
  );
}

export default ResponsablePage;
