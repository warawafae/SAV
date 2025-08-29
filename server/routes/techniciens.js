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
// 🔹 Ajouter un technicien
router.post("/add", async (req, res) => {
  const { enseigne, nom_technicien, email, specialite } = req.body;

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
    await db.query(
      `INSERT INTO ${table} (nom_complet_technicien, email_technicien, spécialité, statut)
       VALUES (@nom_technicien, @email, @specialite, 'disponible')`,
      {
        nom_technicien,
        email,
        specialite
      }
    );
    res.json({ message: "Technicien ajouté !" });
  } catch (err) {
    console.error("Erreur ajout technicien :", err);
    res.status(500).json({ error: err.message });
  }
});
// 🔹 Modifier un technicien (selon nom_technicien)
router.post("/edit", async (req, res) => {
  const { enseigne, nom_technicien, email, specialite, statut } = req.body;

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
    await db.query(
      `UPDATE ${table}
       SET email_technicien = @email,
           spécialité = @specialite,
           statut = ISNULL(@statut, 'disponible')
       WHERE nom_complet_technicien = @nom_technicien`,
      {
        nom_technicien,
        email,
        specialite,
        statut
      }
    );
    res.json({ message: "Technicien modifié !" });
  } catch (err) {
    console.error("Erreur modification technicien :", err);
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Supprimer un technicien (selon nom_technicien)
router.post("/delete", async (req, res) => {
  const { enseigne, nom_technicien } = req.body;

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
    await db.query(
      `DELETE FROM ${table} WHERE nom_complet_technicien = @nom_technicien`,
      { nom_technicien }
    );
    res.json({ message: "Technicien supprimé !" });
  } catch (err) {
    console.error("Erreur suppression technicien :", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;