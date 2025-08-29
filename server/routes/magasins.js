const express = require("express");
const router = express.Router();
const dbSwitcher = require("../db/dbSwitcher");

router.get("/:enseigne", async (req, res) => {
  const { enseigne } = req.params;
  try {
    const pool = await dbSwitcher(enseigne.toLowerCase());
    const result = await pool.request().query("SELECT nom_magasin FROM magasin");
    const magasins = result.recordset.map(row => row.nom_magasin);
    res.json({ magasins });
  } catch (err) {
    console.error("Erreur récupération magasins :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;