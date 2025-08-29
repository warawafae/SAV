// src/pages/AdminPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminPage.modules.css"; // import du CSS

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
    <div className="admin-container">
      {/* Sidebar gauche */}
      <nav className="sidebar">
        <h2>Menu</h2>
        <ul>
          <li><a href="#marjane">Réclamations Marjane</a></li>
          <li><a href="#electro">Réclamations Electroplanet</a></li>
          <li><a href="#stats">Statistiques</a></li>
          <li><a href="#logout">Déconnexion</a></li>
        </ul>
      </nav>

      {/* Contenu principal */}
      <div className="content">
        <h1>Bienvenue </h1>

        {loading ? (
          <p>Chargement des réclamations...</p>
        ) : (
          <>
            <h2 id="marjane">Réclamations Marjane</h2>
            <table>
              <thead>
                <tr>
                  <th>Contrat</th>
                  <th>Client</th>
                  <th>Libellé</th>
                  <th>Magasin</th>
                  <th>Date</th>
                  <th>Technicien</th>
                  <th>Statut</th>
                  <th>Motif</th>
                </tr>
              </thead>
              <tbody>
                {marjaneReclamations.map((rec) => (
                  <tr key={rec.id}>
                    <td>{rec.contrat}</td>
                    <td>{rec.nom_client}</td>
                    <td>{rec.libelle}</td>
                    <td>{rec.nom_magasin}</td>
                    <td>{new Date(rec.date_reclamation).toLocaleDateString()}</td>
                    <td>{rec.nom_technicien}</td>
                    <td>{rec.statut_reclamation}</td>
                    <td>{rec.motif}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h2 id="electro">Réclamations Electroplanet</h2>
            <table>
              <thead>
                <tr>
                  <th>Contrat</th>
                  <th>Client</th>
                  <th>Libellé</th>
                  <th>Magasin</th>
                  <th>Date</th>
                  <th>Technicien</th>
                  <th>Statut</th>
                  <th>Motif</th>
                </tr>
              </thead>
              <tbody>
                {electroReclamations.map((rec) => (
                  <tr key={rec.id}>
                    <td>{rec.contrat}</td>
                    <td>{rec.nom_client}</td>
                    <td>{rec.libelle}</td>
                    <td>{rec.nom_magasin}</td>
                    <td>{new Date(rec.date_reclamation).toLocaleDateString()}</td>
                    <td>{rec.nom_technicien}</td>
                    <td>{rec.statut_reclamation}</td>
                    <td>{rec.motif}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
