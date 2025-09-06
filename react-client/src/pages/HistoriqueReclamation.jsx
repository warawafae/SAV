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

  // … tout le code précédent reste identique jusqu’au return

return (
  <>
    <h2 style={{ textAlign: 'center', marginBottom: '50px' }}>Historique des Réclamations</h2>
    <table style={styles.table}>
      <thead style={styles.thead}>
        <tr>
          <th>Date</th>
          <th>Client</th>
          <th>Libellé</th>
          <th>Technicien</th>
          <th>Durée vie</th>
          <th>Statut</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((rec, i) => (
          <tr key={i} style={styles.row}>
            <td>{new Date(rec.date_reclamation).toLocaleDateString()}</td>
            <td>{rec.nom_client}</td>
            <td>{rec.libelle}</td>
            <td>{rec.nom_technicien}</td>
            <td>{rec.duree_vie}</td>
            <td>
              <span style={{
                ...styles.badge,
                backgroundColor:
                  rec.statut_reclamation === 'ouverte' ? '#e71809ff' :
                  rec.statut_reclamation === 'en cours' ? '#0ea1d2ff' :
                  '#1daf3fff'
              }}>
                {rec.statut_reclamation}
              </span>
            </td>
            <td>
              <button style={styles.button} onClick={() => {
                setSelectedRec(rec);
                setUpdatedFields({
                  duree_vie: rec.duree_vie,
                  statut_reclamation: rec.statut_reclamation
                });
              }}>
                Consulter
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {selectedRec && (
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <h3 style={styles.modalTitle}>Détails de la réclamation</h3>
          <div style={styles.modalContent}>
            <p><strong>Date:</strong> {new Date(selectedRec.date_reclamation).toLocaleDateString()}</p>
            <p><strong>Client:</strong> {selectedRec.nom_client}</p>
            <p><strong>Téléphone:</strong> {selectedRec.numero_telephone}</p>
            <p><strong>Libellé:</strong> {selectedRec.libelle}</p>
            <p><strong>Contrat:</strong> {selectedRec.contrat}</p>
            <p><strong>Motif:</strong> {selectedRec.motif}</p>
            <p><strong>Technicien:</strong> {selectedRec.nom_technicien}</p>
            <p><strong>Email:</strong> {selectedRec.email_technicien}</p>

            <label><strong>Durée de vie:</strong></label>
            <input
              type="text"
              value={updatedFields.duree_vie}
              onChange={(e) => handleEdit('duree_vie', e.target.value)}
              style={styles.input}
            />

            <label><strong>Statut:</strong></label>
            <select
              value={updatedFields.statut_reclamation}
              onChange={(e) => handleEdit('statut_reclamation', e.target.value)}
              style={styles.select}
            >
              <option value="ouverte">ouverte</option>
              <option value="en cours">en cours</option>
              <option value="terminée">terminée</option>
            </select>

            <div style={styles.modalActions}>
              <button onClick={handleSave} style={styles.saveButton}>Enregistrer</button>
              <button onClick={() => setSelectedRec(null)} style={styles.closeButton}>✖ Fermer</button>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
);}
export default HistoriqueTable;
const styles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    boxShadow: '0 5px 5px rgba(58, 20, 20, 1)',
    marginBottom: '6px',
    backgroundColor: '#ffffffe3'
  },
  thead: {
    backgroundColor: 'rgb(102, 52, 3); ', //head of reclamtion table 
    color:'#ffffffe3'
  },
  row: {
    textAlign: 'center',
    borderBottom: '1px solid #3f3232e3'
  },
  button: {
    padding: '10px 10px',
    backgroundColor: '#137065  ',
    color: '#fff',
    border: 'none',
    borderRadius: '7px',
    cursor: 'pointer'
  },
  badge: {
    color: '#fff',
    padding: '1px 4px',
    borderRadius: '6px',
    fontSize: '1.6em'
  },
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
    justifyContent: 'center', alignItems: 'center', zIndex: 999
  },
  modal: {
    background: '#fff', padding: '25px', borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)', width: '450px'
  },
  modalTitle: {
    marginBottom: 'px',
    textAlign: 'center',
    fontSize: '20px',
    borderBottom: '1px solid #ccc',
    paddingBottom: '10px'
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  input: {
    padding: '6px',
    border: '1px solid #ccc',
    borderRadius: '5px'
  },
  select: {
    padding:'2px',
    borderRadius: '5px'
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px'
  },
  saveButton: {
    backgroundColor: '#044d15ff',
    color: '#fff',
    padding: '8px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  closeButton: {
    backgroundColor: '#137189ff ',
    color: '#fff',
    padding: '8px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};
