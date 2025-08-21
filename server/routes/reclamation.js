const { envoyerMailReclamation } = require("../utils/mailer");
const express = require("express");
const router = express.Router();
const sql = require("mssql");
const dbMarjane = require("../db/dbMarjane");
const dbElectroplanet = require("../db/dbElectroplanet");

// POST : Ajouter une réclamation
router.post("/:enseigne", async (req, res) => {
  console.log("Requête reçue :", req.body);
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
      nom_client,
      numero_telephone,
      libelle,
      contrat,
      nom_responsable,
      nom_magasin,
      enseigne,
      specialite_technicien,
      nom_technicien,
      email_technicien,
      motif,
      statut_reclamation,
    } = req.body;

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
    request.input("statut_reclamation", sql.NVarChar(255), statut_reclamation);

    const query = `
      INSERT INTO ${table} 
      (nom_client, numero_telephone, libelle, contrat, nom_responsable, nom_magasin, enseigne, specialite_technicien, nom_technicien, email_technicien, motif, statut_reclamation)
      VALUES 
      (@nom_client, @numero_telephone, @libelle, @contrat, @nom_responsable, @nom_magasin, @enseigne, @specialite_technicien, @nom_technicien, @email_technicien, @motif, @statut_reclamation)
    `;

    await request.query(query);
    try {
  await envoyerMailReclamation({
    to: email_technicien,
    nomTechnicien: nom_technicien,
    nomClient: nom_client,
    motif,
    libelle,
    nommagasin:nom_magasin,
    nomresponsablee:nom_responsable

  });
  console.log("✅ Email envoyé au technicien");
} catch (mailErr) {
  console.error("❌ Échec de l'envoi de l'email :", mailErr);
}

    res.status(201).json({ message: "Réclamation enregistrée avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'insertion :", error);
    res.status(500).json({ message: "Erreur serveur lors de l'insertion" });
  }
});

// GET : Historique filtré par nom_magasin
router.get("/:enseigne", async (req, res) => {
  const enseigneParam = req.params.enseigne.toLowerCase();
  const nomMagasin = req.headers['x-nom-magasin'];

  if (!nomMagasin) {
    return res.status(400).json({ message: "Nom du magasin manquant dans les headers" });
  }

  let db, table;

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
    request.input("nom_magasin", sql.NVarChar(100), nomMagasin);

    const query = `
      SELECT id, nom_client, date_reclamation, nom_technicien, duree_vie, libelle, motif, email_technicien, contrat, numero_telephone, statut_reclamation
      FROM ${table}
      WHERE nom_magasin = @nom_magasin
      ORDER BY date_reclamation DESC
    `;

    const result = await request.query(query);

    res.json(result.recordset);
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération" });
  }
});

// PUT : Mettre à jour la durée de vie et le statut d'une réclamation
// PUT : Mettre à jour la durée de vie et le statut d'une réclamation 
router.put("/:enseigne/:id", async (req, res) => {
  const { enseigne, id } = req.params;
  const { duree_vie, statut_reclamation } = req.body;

  let db, table, techtable;

  if (enseigne === "marjane") {
    db = dbMarjane;
    table = "marjane_reclamations";
    techtable = "marjane_technicien";
  } else if (enseigne === "electroplanet") {
    db = dbElectroplanet;
    table = "electroplanet_reclamations";
    techtable = "electroplanet_technicien";
  } else {
    return res.status(400).json({ message: "Enseigne invalide" });
  }

  try {
    await db.poolConnect;

    // Mise à jour de la réclamation
    const updateRequest = db.pool.request();
    updateRequest.input("id", sql.Int, id);
    updateRequest.input("duree_vie", sql.NVarChar(100), duree_vie);
    updateRequest.input("statut_reclamation", sql.NVarChar(100), statut_reclamation);

    const updateQuery = `
      UPDATE ${table}
      SET duree_vie = @duree_vie, statut_reclamation = @statut_reclamation
      WHERE id = @id
    `;
    await updateRequest.query(updateQuery);

    // Récupération du nom du technicien concerné
    const getTechNameResult = await db.pool.request()
      .input("id", sql.Int, id)
      .query(`SELECT nom_technicien FROM ${table} WHERE id = @id`);

    const nom_technicien = getTechNameResult.recordset[0]?.nom_technicien;

    if (!nom_technicien) {
      return res.status(404).json({ message: "Technicien non trouvé pour cette réclamation" });
    }

    // Mise à jour du statut du technicien
    const nouveauStatutTech = (statut_reclamation === "terminée") ? "disponible" : "non disponible";

    const updateTechRequest = db.pool.request();
    updateTechRequest.input("nom_technicien", sql.NVarChar(100), nom_technicien);
    updateTechRequest.input("statut", sql.NVarChar(50), nouveauStatutTech);

    const updateTechQuery = `
      UPDATE ${techtable}
      SET statut = @statut
      WHERE nom_complet_technicien = @nom_technicien
    `;
    await updateTechRequest.query(updateTechQuery);

    res.status(200).json({ message: "Réclamation et technicien mis à jour avec succès" });

  } catch (err) {
    console.error("Erreur lors de la mise à jour :", err);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour" });
  }
});
router.get("/admin/all-reclamations", async (req, res) => {
  try {
    const marjaneData = await dbMarjane.query("SELECT * FROM marjane_reclamation");
    const electroData = await dbElectroplanet.query("SELECT * FROM electroplanet_reclamation");

    res.json({
      marjane: marjaneData.recordset,
      electroplanet: electroData.recordset
    });
  } catch (err) {
    console.error("Erreur admin:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});



module.exports = router;
