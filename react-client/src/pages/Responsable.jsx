import React, { useState, useEffect } from 'react';
import ReclamationForm from './ReclamationForm';
import HistoriqueTable from './HistoriqueTable';

function ResponsablePage({ nomResponsable, enseigne }) {
  const [reclamations, setReclamations] = useState([]);
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);

  useEffect(() => {
    fetch(`/api/reclamations/${enseigne}`)
      .then(res => res.json())
      .then(data => setReclamations(data))
      .catch(err => console.error(err));
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

      <HistoriqueTable data={reclamations} />
    </div>
  );
}

export default ResponsablePage;
