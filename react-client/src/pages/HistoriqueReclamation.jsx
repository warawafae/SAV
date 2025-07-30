import React, { useEffect, useState } from 'react';
import axios from 'axios';

function HistoriqueTable({ enseigne }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enseigne) return;
    setLoading(true);
    axios.get(`/api/reclamations/${enseigne}`)
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
              <button onClick={() => alert(`Consulter réclamation de ${rec.nom_client}`)}>
                Consulter
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default HistoriqueTable;
