import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ReclamationForm from "./ReclamationForm";
import HistoriqueTable from "./HistoriqueTable";

function ResponsablePage() {
  const [searchParams] = useSearchParams();
  const enseigne = searchParams.get("enseigne");
  const nomResponsable = searchParams.get("nom");

  const [reclamations, setReclamations] = useState([]);
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);

  useEffect(() => {
    if (enseigne) {
      fetch(`/api/reclamations/${enseigne}`)
        .then(res => {
          if (!res.ok) throw new Error("Erreur réseau");
          return res.json();
        })
        .then(data => setReclamations(data))
        .catch(console.error);
    }
  }, [enseigne]);

  const handleNewReclamation = (newRec) => {
    setReclamations(prev => [...prev, newRec]);
  };

  return (
  <div>
    <h2>Bienvenue {nomResponsable}</h2>
    <button onClick={() => setAfficherFormulaire(!afficherFormulaire)}>
      Créer une réclamation
    </button>

    {afficherFormulaire && (
      <ReclamationForm enseigne={enseigne} onSuccess={handleNewReclamation} />
    )}

    {/* Titre affiché avant le tableau */}
    <h3>Historique de réclamation</h3>
    <HistoriqueTable data={reclamations} />
  </div>
);

}

export default ResponsablePage;
