const express = require("express");
const router = express.Router();
const sql = require("mssql");
const dbMarjane = require("../db/dbMarjane");
const dbElectroplanet = require("../db/dbElectroplanet");

// POST /api/reclamations/:enseigne
router.post("/:enseigne", async (req, res) => {
  const { enseigne } = req.params;
  const {
    libelle,
    nomClient,
    telephoneClient,
    nomMagasin,
    contrat,
    technicien,
    emailTechnicien,
    specialite,
    motif,
  } = req.body;

  const db =
    enseigne === "marjane"
      ? dbMarjane
      : enseigne === "electroplanet"
      ? dbElectroplanet
      : null;

  const table =
    enseigne === "marjane"
      ? "marjane_reclamations"
      : enseigne === "electroplanet"
      ? "electroplanet_reclamations"
      : null;

  if (!db || !table) {
    return res.status(400).json({ error: "Enseigne invalide" });
  }

  try {
    await db
      .request()
      .input("libelle", sql.NVarChar, libelle)
      .input("nom_client", sql.NVarChar, nomClient)
      .input("numero_telephone", sql.NVarChar, telephoneClient)
      .input("nom_magasin", sql.NVarChar, nomMagasin)
      .input("contrat", sql.NVarChar, contrat)
      .input("nom_technicien", sql.NVarChar, technicien)
      .input("email_technicien", sql.NVarChar, emailTechnicien)
      .input("specialite_technicien", sql.NVarChar, specialite)
      .input("motif", sql.NVarChar, motif)
      .input("statut_reclamation", sql.NVarChar, "ouverte")
      .query(
        `INSERT INTO ${table} (
          libelle, nom_client, numero_telephone, nom_magasin,
          contrat, nom_technicien, email_technicien,
          specialite_technicien, motif, statut_reclamation
        ) VALUES (
          @libelle, @nom_client, @numero_telephone, @nom_magasin,
          @contrat, @nom_technicien, @email_technicien,
          @specialite_technicien, @motif, @statut_reclamation
        )`
      );

    res.status(201).json({ message: "Réclamation ajoutée avec succès." });
  } catch (error) {
    console.error("Erreur insertion réclamation:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
