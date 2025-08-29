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
// 🔹 Ajouter un magasin
router.post("/add", async (req, res) => {
  const { enseigne, nom_magasin, nom_responsable, email, mot_de_passe } = req.body;

  try {
    const pool = await dbSwitcher(enseigne.toLowerCase());
    await pool.request()
      .input("nom_magasin", nom_magasin)
      .input("nom_responsable", nom_responsable)
      .input("email", email)
      .input("mot_de_passe", mot_de_passe)
      .query(
        `INSERT INTO magasin (nom_magasin, nom_responsable, email, mot_de_passe)
         VALUES (@nom_magasin, @nom_responsable, @email, @mot_de_passe)`
      );
    res.json({ message: "Magasin ajouté !" });
  } catch (err) {
    console.error("Erreur ajout magasin :", err);
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Modifier un magasin
router.post("/edit", async (req, res) => {
  const { enseigne, nom_magasin, nom_responsable, email, mot_de_passe } = req.body;

  try {
    const pool = await dbSwitcher(enseigne.toLowerCase());
    await pool.request()
      .input("nom_magasin", nom_magasin)
      .input("nom_responsable", nom_responsable)
      .input("email", email)
      .input("mot_de_passe", mot_de_passe)
      .query(
        `UPDATE magasin
         SET nom_responsable = @nom_responsable,
             email = @email,
             mot_de_passe = @mot_de_passe
         WHERE nom_magasin = @nom_magasin`
      );
    res.json({ message: "Magasin modifié !" });
  } catch (err) {
    console.error("Erreur modification magasin :", err);
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Supprimer un magasin
router.post("/delete", async (req, res) => {
  const { enseigne, nom_magasin } = req.body;

  try {
    const pool = await dbSwitcher(enseigne.toLowerCase());
    await pool.request()
      .input("nom_magasin", nom_magasin)
      .query(`DELETE FROM magasin WHERE nom_magasin = @nom_magasin`);
    res.json({ message: "Magasin supprimé !" });
  } catch (err) {
    console.error("Erreur suppression magasin :", err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;