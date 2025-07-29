const express = require("express");
const router = express.Router();
const dbMarjane = require("../db/dbMarjane");
const dbElectroplanet = require("../db/dbElectroplanet");

router.post("/api/reclamation/:enseigne", async (req, res) => {
  const { enseigne } = req.params;
  const {
    produit,
    type,
    description,
    libelle,
    nom_client,
    nom_magasin,
    nom_responsable,
    contrat,
    nom_technicien,
    email_technicien,
    spécialité_technicien,
    numero_telephone,
    duree_vie,
    statut_reclamation = "ouverte",
    motif
  } = req.body;

  const db = enseigne === "marjane" ? dbMarjane :
             enseigne === "electroplanet" ? dbElectroplanet :
             null;

  const table = enseigne === "marjane" ? "marjane_reclamations" :
                enseigne === "electroplanet" ? "electroplanet_reclamations" :
                null;

  if (!db || !table) {
    return res.status(400).json({ error: "Enseigne invalide" });
  }

  try {
    await db.request()
      .input("nom_client", nom_client)
      .input("numero_telephone", numero_telephone)
      .input("libelle", libelle)
      .input("contrat", contrat)
      .input("nom_responsable", nom_responsable)
      .input("nom_magasin", nom_magasin)
      .input("enseigne", enseigne)
      .input("spécialité_technicien", spécialité_technicien)
      .input("nom_technicien", nom_technicien)
      .input("email_technicien", email_technicien)
      .input("duree_vie", duree_vie || null)
      .input("statut_reclamation", statut_reclamation)
      .input("motif", description|| null)
      .query(`
        INSERT INTO ${table} (
          nom_client, numero_telephone, libelle, contrat,
          nom_responsable, nom_magasin, enseigne,
          spécialité_technicien, nom_technicien, email_technicien,
          duree_vie, statut_reclamation, motif
        ) VALUES (
          @nom_client, @numero_telephone, @libelle, @contrat,
          @nom_responsable, @nom_magasin, @enseigne,
          @spécialité_technicien, @nom_technicien, @email_technicien,
          @duree_vie, @statut_reclamation, @motif
        );
      `);

    res.status(201).json({ message: "Réclamation ajoutée avec succès." });
  } catch (error) {
    console.error("Erreur insertion:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
