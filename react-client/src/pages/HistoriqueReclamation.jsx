import React, { useEffect, useState } from 'react';
import axios from 'axios';

function HistoriqueTable({ enseigne }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRec, setSelectedRec] = useState(null);
  const [updatedFields, setUpdatedFields] = useState({ duree_vie: '', statut_reclamation: '' });

  useEffect(() => {
    if (!enseigne) return;

    const user = JSON.parse(localStorage.getItem('user'));
    const nomMagasin = user?.nomMagasin;

    if (!nomMagasin) {
      console.error("Nom du magasin absent dans localStorage");
      setLoading(false);
      return;
    }

    setLoading(true);

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

  const handleEdit = (field, value) => {
    setUpdatedFields(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    axios.put(`/api/reclamations/${enseigne}/${selectedRec.id}`, updatedFields)
      .then(() => {
        // Mise à jour locale sans tout recharger
        setData(data.map(rec => rec.id === selectedRec.id ? { ...rec, ...updatedFields } : rec));
        setSelectedRec(null);
      })
      .catch(err => {
        console.error('Erreur lors de la mise à jour', err);
        alert("Erreur lors de la mise à jour.");
      });
  };

  if (loading) return <p>Chargement...</p>;
  if (data.length === 0) return <p>Aucune réclamation trouvée.</p>;

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Date réclamation</th>
            <th>Nom client</th>
            <th>Libellé</th>
            <th>Nom technicien</th>
            <th>Durée vie</th>
            <th>Statut</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((rec, i) => (
            <tr key={i}>
              <td>{new Date(rec.date_reclamation).toLocaleDateString()}</td>
              <td>{rec.nom_client}</td>
              <td>{rec.libelle}</td>
              <td>{rec.nom_technicien}</td>
              <td>{rec.duree_vie}</td>
              <td>{rec.statut_reclamation}</td>
              <td><button onClick={() => {
                setSelectedRec(rec);
                setUpdatedFields({
                  duree_vie: rec.duree_vie,
                  statut_reclamation: rec.statut_reclamation
                });
              }}>Consulter</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedRec && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Détails de la réclamation</h3>
            <p><strong>Date de réclamation:</strong> {new Date(selectedRec.date_reclamation).toLocaleDateString()}</p>
            <p><strong>Client :</strong> {selectedRec.nom_client}</p>
            <p><strong>Téléphone :</strong> {selectedRec.numero_telephone}</p>
            <p><strong>Libellé :</strong> {selectedRec.libelle}</p>
            <p><strong>Contrat :</strong> {selectedRec.contrat}</p>
            <p><strong>Motif :</strong> {selectedRec.motif}</p>
            <p><strong>Technicien :</strong> {selectedRec.nom_technicien}</p>
            <p><strong>Email technicien :</strong> {selectedRec.email_technicien}</p>

            <label><strong>Durée de vie :</strong></label>
            <input
              type="text"
              value={updatedFields.duree_vie}
              onChange={(e) => handleEdit('duree_vie', e.target.value)}
            />

            <label><strong>Statut :</strong></label>
            <select
              value={updatedFields.statut_reclamation}
              onChange={(e) => handleEdit('statut_reclamation', e.target.value)}
            >
              <option value="ouverte">ouverte</option>
              <option value="en cours">en cours</option>
              <option value="terminée">terminée</option>
            </select>

            <div style={{ marginTop: '15px' }}>
              <button onClick={handleSave}>Enregistrer</button>
              <button onClick={() => setSelectedRec(null)} style={{ marginLeft: '10px' }}>Fermer</button>
            </div>
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
