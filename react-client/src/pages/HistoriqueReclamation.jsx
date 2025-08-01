import React, { useEffect, useState } from 'react';
import axios from 'axios';

function HistoriqueTable({ enseigne }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRec, setSelectedRec] = useState(null);

  useEffect(() => {
    if (!enseigne) return;

    // Récupérer le nom du magasin depuis localStorage (par ex. après login)
    const user = JSON.parse(localStorage.getItem('user'));
    const nomMagasin = user?.nomMagasin;

    if (!nomMagasin) {
      console.error("Nom du magasin absent dans localStorage");
      setLoading(false);
      return;
    }

    setLoading(true);

    // On envoie nomMagasin dans les headers pour backend (comme tu fais dans ta route)
    axios.get(`/api/reclamations/${enseigne}`, {
      headers: { 'x-nom-magasin': nomMagasin }
    })
    .then(res => {
      setData(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });

  }, [enseigne]);

  if (loading) return <p>Chargement...</p>;
  if (data.length === 0) return <p>Aucune réclamation trouvée.</p>;

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Nom client</th>
            <th>Date réclamation</th>
            <th>Nom technicien</th>
            <th>Durée vie</th>
            <th>Libellé</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((rec, i) => (
            <tr key={i}>
              <td>{rec.nom_client}</td>
              <td>{new Date(rec.date_reclamation).toLocaleDateString()}</td>
              <td>{rec.nom_technicien}</td>
              <td>{rec.duree_vie}</td>
              <td>{rec.libelle}</td>
              <td>
                <button onClick={() => setSelectedRec(rec)}>Consulter</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedRec && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Détails de la réclamation</h3>
            <p><strong>Nom client :</strong> {selectedRec.nom_client}</p>
            <p><strong>Date réclamation :</strong> {new Date(selectedRec.date_reclamation).toLocaleDateString()}</p>
            <p><strong>Nom technicien :</strong> {selectedRec.nom_technicien}</p>
            <p><strong>Durée de vie :</strong> {selectedRec.duree_vie}</p>
            <p><strong>Libellé :</strong> {selectedRec.libelle}</p>
            <button onClick={() => setSelectedRec(null)}>Fermer</button>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
    justifyContent: 'center', alignItems: 'center'
  },
  modal: {
    background: '#fff', padding: '20px', borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)', width: '400px'
  }
};

export default HistoriqueTable;
