// src/pages/AdminPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPage = () => {
  const [marjaneReclamations, setMarjaneReclamations] = useState([]);
  const [electroReclamations, setElectroReclamations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReclamations = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/reclamations/admin/all-reclamations");
        setMarjaneReclamations(response.data.marjane);
        setElectroReclamations(response.data.electroplanet);
      } catch (err) {
        console.error("Erreur récupération réclamations :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReclamations();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>Interface Administrateur</h1>

      {loading ? (
        <p>Chargement des réclamations...</p>
      ) : (
        <>
          <h2>Réclamations Marjane</h2>
          <table border="1" cellPadding="5" style={{ width: "100%", marginBottom: "40px" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Libellé</th>
                <th>Magasin</th>
                <th>Date</th>
                <th>Technicien</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {marjaneReclamations.map((rec) => (
                <tr key={rec.id}>
                  <td>{rec.id}</td>
                  <td>{rec.libelle}</td>
                  <td>{rec.nom_magasin}</td>
                  <td>{new Date(rec.date_reclamation).toLocaleDateString()}</td>
                  <td>{rec.nom_technicien}</td>
                  <td>{rec.statut}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Réclamations Electroplanet</h2>
          <table border="1" cellPadding="5" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Libellé</th>
                <th>Magasin</th>
                <th>Date</th>
                <th>Technicien</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {electroReclamations.map((rec) => (
                <tr key={rec.id}>
                  <td>{rec.id}</td>
                  <td>{rec.libelle}</td>
                  <td>{rec.nom_magasin}</td>
                  <td>{new Date(rec.date_reclamation).toLocaleDateString()}</td>
                  <td>{rec.nom_technicien}</td>
                  <td>{rec.statut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default AdminPage;
