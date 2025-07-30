const express = require("express");
const router = express.Router();
const sql = require("mssql");
const dbMarjane = require("../db/dbMarjane");
const dbElectroplanet = require("../db/dbElectroplanet");

router.post("/:enseigne", async (req, res) => {
   console.log("BODY RECU:", req.body); 
  const enseigneParam = req.params.enseigne.toLowerCase();

  let db;
  let table;

  if (enseigneParam === "marjane") {
    db = dbMarjane;
    table = "marjane_reclamations";
  } else if (enseigneParam === "electroplanet") {
    db = dbElectroplanet;
    table = "electroplanet_reclamations";
  } else {
    return res.status(400).json({ message: "Enseigne invalide" });
  }

  try {
    await db.poolConnect;
    const request = db.pool.request();

   const {
  nomClient,
  telephoneClient,
  libelle,
  contrat,
  nomMagasin,
  enseigne,
  specialite_technicien,
  nom_technicien,
  emailTechnicien,
  motif,
} = req.body;

const nom_client = nomClient;
const numero_telephone = telephoneClient;
const nom_magasin = nomMagasin;
const email_technicien = emailTechnicien;

// Si tu veux générer nom_responsable depuis l'utilisateur connecté :
const nom_responsable = "Responsable Nom"; // à remplacer par localStorage côté frontend si dispo


    // Ajout des paramètres
    request.input("nom_client", sql.NVarChar(100), nom_client);
request.input("numero_telephone", sql.NVarChar(20), numero_telephone);
request.input("libelle", sql.NVarChar(255), libelle);
request.input("contrat", sql.NVarChar(100), contrat);
request.input("nom_responsable", sql.NVarChar(100), nom_responsable);
request.input("nom_magasin", sql.NVarChar(100), nom_magasin);
request.input("enseigne", sql.NVarChar(50), enseigne);
request.input("specialite_technicien", sql.NVarChar(100), specialite_technicien);
request.input("nom_technicien", sql.NVarChar(100), nom_technicien);
request.input("email_technicien", sql.NVarChar(100), email_technicien);
request.input("motif", sql.NVarChar(255), motif);


    const query = `
      INSERT INTO ${table} 
(nom_client, numero_telephone, libelle, contrat, nom_responsable, nom_magasin, enseigne, specialite_technicien, nom_technicien, email_technicien, motif)
VALUES 
(@nom_client, @numero_telephone, @libelle, @contrat, @nom_responsable, @nom_magasin, @enseigne, @specialite_technicien, @nom_technicien, @email_technicien, @motif)
    `;

    await request.query(query);

    res.status(201).json({ message: "Réclamation enregistrée avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'insertion :", error);
    res.status(500).json({ message: "Erreur serveur lors de l'insertion" });
  }
});
router.get("/:enseigne", async (req, res) => {
  const enseigneParam = req.params.enseigne.toLowerCase();

  let db;
  let table;

  if (enseigneParam === "marjane") {
    db = dbMarjane;
    table = "marjane_reclamations";
  } else if (enseigneParam === "electroplanet") {
    db = dbElectroplanet;
    table = "electroplanet_reclamations";
  } else {
    return res.status(400).json({ message: "Enseigne invalide" });
  }

  try {
    await db.poolConnect;
    const request = db.pool.request();

    // Récupérer les colonnes demandées
    const query = `
      SELECT nom_client, date_reclamation, nom_technicien, duree_vie, libelle 
      FROM ${table}
      ORDER BY date_reclamation DESC
    `;

    const result = await request.query(query);

    res.json(result.recordset);
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération" });
  }
});

module.exports = router;
