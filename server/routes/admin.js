const { envoyerMailReclamation } = require("../utils/mailer");
const express = require("express");
const router = express.Router();
const sql = require("mssql");
const dbMarjane = require("../db/dbMarjane");
const dbElectroplanet = require("../db/dbElectroplanet");

// Route recherche par contrat
router.get("/search", async (req, res) => {
    console.log("Query reçue :", req.query);
  const { enseigne, contrat } = req.query;

  if (!enseigne) {
    return res.status(400).json({ message: "Veuillez sélectionner une enseigne avant la recherche" });
  }

  if (!contrat) {
    return res.status(400).json({ message: "Veuillez saisir un numéro de contrat" });
  }

  let db, table;

  // Sélection de la base et de la table selon l’enseigne
  if (enseigne.toLowerCase() === "marjane") {
    db = dbMarjane;
    table = "marjane_reclamations";
  } else if (enseigne.toLowerCase() === "electroplanet") {
    db = dbElectroplanet;
    table = "electroplanet_reclamations";
  } else {
    return res.status(400).json({ message: "Enseigne invalide" });
  }

  try {
    await db.poolConnect; // Assure que la connexion est prête
    const request = db.pool.request();

    // Supprime les espaces invisibles
    const contratTrimmed = contrat.trim();

    // Ajout de l’input avec % pour LIKE
    request.input("contrat", sql.NVarChar, `%${contratTrimmed}%`);

    // Query avec LIKE
    const query = `SELECT * FROM ${table} WHERE contrat LIKE @contrat`;

    console.log("Table :", table);
    console.log("Contrat recherché :", contratTrimmed);
    console.log("Requête SQL :", query);

    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Aucune réclamation trouvée pour ce contrat" });
    }

    res.json(result.recordset);
  } catch (err) {
    console.error("Erreur recherche admin :", err);
    res.status(500).json({ message: "Erreur serveur lors de la recherche" });
  }
});

module.exports = router;
