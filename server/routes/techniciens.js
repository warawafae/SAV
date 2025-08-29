const express = require("express");
const router = express.Router();

const dbMarjane = require("../db/dbMarjane");
const dbElectroplanet = require("../db/dbElectroplanet");

router.get("/specialites", async (req, res) => {
  const { enseigne } = req.query;

  let db, table;
  if (enseigne === "marjane") {
    db = dbMarjane;
    table = "marjane_technicien";
  } else if (enseigne === "electroplanet") {
    db = dbElectroplanet;
    table = "electroplanet_technicien";
  } else {
    return res.status(400).json({ error: "Enseigne invalide" });
  }

  try {
    const result = await db.query(`SELECT DISTINCT spécialité FROM ${table}`);
    const specialites = result.recordset.map(r => r.spécialité);
    res.json(specialites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/techniciens", async (req, res) => {
  const { enseigne, specialite } = req.query;

  let db, table;
  if (enseigne === "marjane") {
    db = dbMarjane;
    table = "marjane_technicien";
  } else if (enseigne === "electroplanet") {
    db = dbElectroplanet;
    table = "electroplanet_technicien";
  } else {
    return res.status(400).json({ error: "Enseigne invalide" });
  }

  try {
    const result = await db.query(
      `SELECT nom_complet_technicien, email_technicien 
       FROM ${table} 
       WHERE spécialité = @specialite AND statut = 'disponible'`,
      { specialite }
    );

    res.json(result.recordset);
  } catch (err) {
    console.error("Erreur dans /techniciens:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;