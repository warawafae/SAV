const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const dbElecto = require("./db/dbElectroplanet");
const dbMarjane = require("./db/dbMarjane");
const sql = require("mssql"); // Assure-toi que c’est bien installé
const dbElectroplanet = require("./db/dbElectroplanet");

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../client")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../client")); // Correct chemin vers Authentification.ejs

// Page d'accueil
app.get("/", (req, res) => {
  res.render("Authentification");
});

// API pour récupérer la liste des magasins selon l'enseigne
app.get("/api/magasins/:enseigne", async (req, res) => {
  const enseigne = req.params.enseigne;
  let db;
  let table;

  if (enseigne === "electroplanet") {
    db = dbElecto;
    table = "electroplanet_magasin"; // <-- ton vrai nom ici
  } else if (enseigne === "marjane") {
    db = dbMarjane;
    table = "marjane_magasin"; // <-- ton vrai nom ici
  } else {
    return res.status(400).json({ magasins: [] });
  }

  try {
    const result = await db.query(`SELECT nom_magasin FROM ${table}`);
    const magasins = result.recordset.map(r => r.nom_magasin);
    res.json({ magasins });
  } catch (error) {
    console.error(error);
    res.status(500).json({ magasins: [] });
  }
});

app.post("/login", async (req, res) => {
  const { enseigne, magasin, nom_responsable, password, email } = req.body;

  // Cas spécial ADMIN
  if (nom_responsable ==="SAVADMNISTRATEUR" && password === "wb@#r") {
    return res.render("admin", { nom: "Administrateur" });
  }

  let db;
  let table;

  if (enseigne === "electroplanet") {
    db = dbElectroplanet;
    table = "electroplanet_magasin";
  } else if (enseigne === "marjane") {
    db = dbMarjane;
    table = "marjane_magasin";
  } else {
    return res.send("Enseigne invalide.");
  }

  try {
    const request = db.request();
    request.input("magasin", sql.VarChar, magasin);
    request.input("password", sql.VarChar, password);
    request.input("nom_responsable", sql.VarChar, nom_responsable);
    request.input("email", sql.VarChar, email);

    const result = await request.query(`
      SELECT * FROM ${table} 
      WHERE nom_magasin = @magasin 
        AND mot_de_passe = @password
        AND nom_complet_responsable = @nom_responsable
        AND email_responsable = @email
    `);

    if (result.recordset.length > 0) {
      const user = result.recordset[0];
      return res.render("responsable", { nom: user.nom_complet_responsable });
    } else {
      res.send("Informations de connexion incorrectes.");
    }
  } catch (err) {
    console.error("Erreur de login :", err);
    res.send("Erreur serveur.");
  }
});

/* Traitement du formulaire de connexion
app.post("/login", async (req, res) => {
  const { enseigne, magasin, nom_responsable, password } = req.body;
  let db;
  let table;

  if (enseigne === "electroplanet") {
    db = dbElectroplanet;
    table = "electroplanet_magasin";
  } else if (enseigne === "marjane") {
    db = dbMarjane;
    table = "marjane_magasin";
  } else {
    return res.send("Enseigne invalide.");
  }

  try {
    const request = db.request();
    request.input("magasin", sql.VarChar, magasin);
    request.input("password", sql.VarChar, password);
    request.input("nom_responsable", sql.VarChar, nom_responsable);

    const result = await request.query(`
      SELECT * FROM ${table} 
      WHERE nom_magasin = @magasin 
        AND mot_de_passe = @password
        AND nom_complet_responsable = @nom_responsable
    `);

    if (result.recordset.length > 0) {
      const user = result.recordset[0];
      req.session.user = {
        nom: user.nom_complet_responsable,
        magasin: user.nom_magasin,
        enseigne: enseigne,
      };
      res.redirect("/reclamation");
    } else {
      res.send("Informations de connexion incorrectes.");
    }
  } catch (err) {
    console.error("Erreur de login :", err);
    res.send("Erreur serveur.");
  }
});*/


app.listen(port, () => {
  console.log(`Serveur en cours sur http://localhost:${port}`);
});
