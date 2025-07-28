// backend/routes/reclamation.js
const express = require("express");
const router = express.Router();
const sql = require("mssql");
const dbElectroplanet = require("../db/dbElectroplanet");
const dbMarjane = require("../db/dbMarjane");

router.post("/add", async (req, res) => {
  const {
    nom_client,
    numero_telephone,
    libelle,
    contrat,
    nom_responsable,
    nom_magasin,
    enseigne,
    specialite
  } = req.body;

  let db = enseigne === "electroplanet" ? dbElectroplanet : dbMarjane;

  try {
    // Trouver le technicien disponible avec la spécialité
    const techResult = await db.query(
      `SELECT TOP 1 nom_complet_technicien, email_technicien 
       FROM ${enseigne}_technicien 
       WHERE spécialité = @specialite AND statut = 'Disponible'`,
      { specialite }
    );

    if (techResult.recordset.length === 0) {
      return res.status(404).json({ error: "Aucun technicien disponible." });
    }

    const tech = techResult.recordset[0];

    await db.query(`
      INSERT INTO reclamations_enseign 
        (nom_client, numero_telephone, libelle, contrat, nom_responsable, nom_magasin, enseigne, nom_technicien, email_technicien, specialite, statut_reclamation, motif)
      VALUES 
        (@nom_client, @numero_telephone, @libelle, @contrat, @nom_responsable, @nom_magasin, @enseigne, @nom_technicien, @email_technicien, @specialite, 'En attente', @motif)
    `, {
      nom_client,
      numero_telephone,
      libelle,
      contrat,
      nom_responsable,
      nom_magasin,
      enseigne,
      nom_technicien: tech.nom_complet_technicien,
      email_technicien: tech.email_technicien,
      specialite,
      motif: libelle
    });

    res.json({ message: "Réclamation créée avec succès." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

module.exports = router;
