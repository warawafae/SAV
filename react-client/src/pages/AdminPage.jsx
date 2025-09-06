import React, { useEffect, useState } from "react";
import axios from "axios";
import { Menu, X } from "lucide-react"; // ✅ pour l’icône sidebar
import "./AdminPage.modules.css";

const AdminPage = () => {
  const [marjaneReclamations, setMarjaneReclamations] = useState([]);
  const [electroReclamations, setElectroReclamations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalType, setModalType] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true); // ✅ état sidebar

  const [magasinData, setMagasinData] = useState({
    enseigne: "marjane",
    nom_magasin: "",
    nom_responsable: "",
    email: "",
    mot_de_passe: "",
  });

  const [techData, setTechData] = useState({
    enseigne: "marjane",
    nom_technicien: "",
    email: "",
    specialite: "",
  });

  // ✅ nouveaux états pour filtres
  const [selectedEnseigne, setSelectedEnseigne] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchReclamations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/reclamations/admin/all-reclamations"
        );
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

  // ----------------- Fonctions API -----------------
  const handleAddMagasin = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/magasins/add", magasinData);
      alert("Magasin ajouté !");
      setModalType(null);
    } catch (err) {
      console.error(err);
      alert("Erreur ajout magasin");
    }
  };

  const handleEditMagasin = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/magasins/edit", magasinData);
      alert("Magasin modifié !");
      setModalType(null);
    } catch (err) {
      console.error(err);
      alert("Erreur modification magasin");
    }
  };

  const handleDeleteMagasin = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/magasins/delete", {
        enseigne: magasinData.enseigne,
        nom_magasin: magasinData.nom_magasin,
      });
      alert("Magasin supprimé !");
      setModalType(null);
    } catch (err) {
      console.error(err);
      alert("Erreur suppression magasin");
    }
  };

  const handleAddTech = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/techniciens/add", techData);
      alert("Technicien ajouté !");
      setModalType(null);
    } catch (err) {
      console.error(err);
      alert("Erreur ajout technicien");
    }
  };

  const handleEditTech = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/techniciens/edit", techData);
      alert("Technicien modifié !");
      setModalType(null);
    } catch (err) {
      console.error(err);
      alert("Erreur modification technicien");
    }
  };

  const handleDeleteTech = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/techniciens/delete", {
        enseigne: techData.enseigne,
        nom_technicien: techData.nom_technicien,
      });
      alert("Technicien supprimé !");
      setModalType(null);
    } catch (err) {
      console.error(err);
      alert("Erreur suppression technicien");
    }
  };

  // ----------------- Filtrage -----------------
  const filterReclamations = (data, enseigne) => {
    let result = data;

    // Filtre par enseigne
    if (selectedEnseigne && selectedEnseigne !== enseigne) {
      return [];
    }

    // Filtre par contrat
    if (searchTerm.trim() !== "") {
      result = result.filter((rec) =>
        rec.contrat.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return result;
  };

  // ----------------- JSX -----------------
  return (
    <div className="admin-container" style={{ display: "flex" }}>
      {/* -------- Sidebar mouvable -------- */}
      <nav
        className={`sidebar ${sidebarOpen ? "open" : "closed"}`}
        style={{
          width: sidebarOpen ? "220px" : "60px",
          transition: "width 0.3s ease",
        }}
      >
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            cursor: "pointer",
            margin: "10px",
          }}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {sidebarOpen && (
          <>
            <h2>Menu</h2>

            <h3>Magasins</h3>
            <ul>
              <li>
                <button onClick={() => setModalType("addMagasin")}>
                  ➕ Ajouter magasin
                </button>
              </li>
              <li>
                <button onClick={() => setModalType("editMagasin")}>
                  ✏️ Modifier magasin
                </button>
              </li>
              <li>
                <button onClick={() => setModalType("deleteMagasin")}>
                  🗑️ Supprimer magasin
                </button>
              </li>
            </ul>

            <h3>Techniciens</h3>
            <ul>
              <li>
                <button onClick={() => setModalType("addTech")}>
                  ➕ Ajouter technicien
                </button>
              </li>
              <li>
                <button onClick={() => setModalType("editTech")}>
                  ✏️ Modifier technicien
                </button>
              </li>
              <li>
                <button onClick={() => setModalType("deleteTech")}>
                  🗑️ Supprimer technicien
                </button>
              </li>
            </ul>

            <a href="http://localhost:5000/">Déconnexion</a>
          </>
        )}
      </nav>

      {/* -------- Contenu principal -------- */}
      <div className="content" style={{ flex: 1, padding: "20px" }}>
        <h1>Bienvenue</h1>

        {/* ✅ Formulaire de filtres */}
        <div className="filter-bar">
  <label htmlFor="enseigne">Enseigne:</label>
  <select
    id="enseigne"
    value={selectedEnseigne}
    onChange={(e) => setSelectedEnseigne(e.target.value)}
  >
    <option value="">-- Toutes --</option>
    <option value="marjane">Marjane</option>
    <option value="electroplanet">Electroplanet</option>
  </select>

  <label htmlFor="search">Contrat:</label>
  <input
    type="search"
    id="search"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="N° contrat"
  />
</div>


        {/* Affichage conditionnel des tableaux */}
{(!selectedEnseigne || selectedEnseigne === "marjane") && (
  <>
    <h2 id="marjane">Réclamations Marjane</h2>
    <TableReclamations data={filterReclamations(marjaneReclamations, "marjane")} />
  </>
)}

{(!selectedEnseigne || selectedEnseigne === "electroplanet") && (
  <>
    <h2 id="electroplanet">Réclamations Electroplanet</h2>
    <TableReclamations data={filterReclamations(electroReclamations, "electroplanet")} />
  </>
)}

      </div>

      {/* ----------------- Modals ----------------- */}
      {(modalType === "addMagasin" ||
        modalType === "editMagasin" ||
        modalType === "deleteMagasin") && (
        <Modal
          title={
            modalType === "addMagasin"
              ? "Ajouter Magasin"
              : modalType === "editMagasin"
              ? "Modifier Magasin"
              : "Supprimer Magasin"
          }
          onClose={() => setModalType(null)}
          onSubmit={
            modalType === "addMagasin"
              ? handleAddMagasin
              : modalType === "editMagasin"
              ? handleEditMagasin
              : handleDeleteMagasin
          }
        >
          <label>
            Enseigne:
            <select
              value={magasinData.enseigne}
              onChange={(e) =>
                setMagasinData({ ...magasinData, enseigne: e.target.value })
              }
            >
              <option value="marjane">Marjane</option>
              <option value="electroplanet">Electroplanet</option>
            </select>
          </label>
          <label>
            Nom magasin:
            <input
              type="text"
              value={magasinData.nom_magasin}
              onChange={(e) =>
                setMagasinData({ ...magasinData, nom_magasin: e.target.value })
              }
              required
            />
          </label>
          {modalType !== "deleteMagasin" && (
            <>
              <label>
                Nom responsable:
                <input
                  type="text"
                  value={magasinData.nom_responsable}
                  onChange={(e) =>
                    setMagasinData({
                      ...magasinData,
                      nom_responsable: e.target.value,
                    })
                  }
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  value={magasinData.email}
                  onChange={(e) =>
                    setMagasinData({ ...magasinData, email: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Mot de passe:
                <input
                  type="password"
                  value={magasinData.mot_de_passe}
                  onChange={(e) =>
                    setMagasinData({
                      ...magasinData,
                      mot_de_passe: e.target.value,
                    })
                  }
                  required
                />
              </label>
            </>
          )}
        </Modal>
      )}

      {(modalType === "addTech" ||
        modalType === "editTech" ||
        modalType === "deleteTech") && (
        <Modal
          title={
            modalType === "addTech"
              ? "Ajouter Technicien"
              : modalType === "editTech"
              ? "Modifier Technicien"
              : "Supprimer Technicien"
          }
          onClose={() => setModalType(null)}
          onSubmit={
            modalType === "addTech"
              ? handleAddTech
              : modalType === "editTech"
              ? handleEditTech
              : handleDeleteTech
          }
        >
          <label>
            Enseigne:
            <select
              value={techData.enseigne}
              onChange={(e) =>
                setTechData({ ...techData, enseigne: e.target.value })
              }
            >
              <option value="marjane">Marjane</option>
              <option value="electroplanet">Electroplanet</option>
            </select>
          </label>
          <label>
            Nom technicien:
            <input
              type="text"
              value={techData.nom_technicien}
              onChange={(e) =>
                setTechData({
                  ...techData,
                  nom_technicien: e.target.value,
                })
              }
              required
            />
          </label>
          {modalType !== "deleteTech" && (
            <>
              <label>
                Email:
                <input
                  type="email"
                  value={techData.email}
                  onChange={(e) =>
                    setTechData({ ...techData, email: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Spécialité:
                <input
                  type="text"
                  value={techData.specialite}
                  onChange={(e) =>
                    setTechData({ ...techData, specialite: e.target.value })
                  }
                  required
                />
              </label>
            </>
          )}
        </Modal>
      )}
    </div>
  );
};

// -------- TableReclamations Component --------
const TableReclamations = ({ data }) => (
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
      {data.map((rec, index) => (
        <tr key={index}>
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
);

// -------- Modal Component --------
const Modal = ({ title, children, onClose, onSubmit }) => (
  <div className="modal-overlay">
    <div className="modal">
      <h2>{title}</h2>
      <form onSubmit={onSubmit}>
        {children}
        <div className="modal-buttons">
          <button type="submit">Valider</button>
          <button type="button" onClick={onClose}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default AdminPage;
