const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const dbMarjane = require("./db/dbMarjane");
const dbElectroplanet = require("./db/dbElectroplanet");
const sql = require("mssql");

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
// Fichiers statiques côté backend
app.use(express.static(path.join(__dirname, "public")));
// Routes API
app.use("/api/reclamations", require("./routes/reclamation"));
const technicienRoutes = require("./routes/techniciens");
app.use("/api/techniciens", technicienRoutes);
// Setup EJS pour la page d'authentification côté serveur
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Page d'accueil avec formulaire EJS
app.get("/", (req, res) => {
  res.render("Authentification");
});

// API : récupérer la liste des magasins selon l’enseigne
app.get("/api/magasins/:enseigne", async (req, res) => {
  const enseigne = req.params.enseigne.toLowerCase();
  let db, table;

  if (enseigne === "electroplanet") {
    db = dbElectroplanet;
    table = "electroplanet_magasin";
  } else if (enseigne === "marjane") {
    db = dbMarjane;
    table = "marjane_magasin";
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

// Login : redirection vers frontend React (port 3000)
app.post("/login", async (req, res) => {
  const { enseigne, magasin, nom_responsable, password, email } = req.body;

  // Cas admin
  if (!nom_responsable && !password) {
    return res.render("admin", { nom: "Administrateur" });
  }

  let db, table;

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
    const result = await db.query(
      `SELECT * FROM ${table} 
       WHERE nom_magasin = @magasin 
         AND mot_de_passe = @password 
         AND nom_complet_responsable = @nom_responsable`,
      {
        magasin,
        password,
        nom_responsable,
      }
    );

    if (result.recordset.length > 0) {
      const user = result.recordset[0];
      // Redirige vers React frontend (port 3000) avec query params enseigne et nomMagasin
      return res.redirect(
        `http://localhost:3000/responsable?enseigne=${encodeURIComponent(enseigne)}&nomMagasin=${encodeURIComponent(magasin)}&nomResponsable=${encodeURIComponent(user.nom_complet_responsable)}`
      );
    } else {
      res.send("Informations de connexion incorrectes.");
    }
  } catch (err) {
    console.error("Erreur de login :", err);
    res.status(500).send("Erreur serveur : " + err.message);
  }
});

app.listen(port, () => {
  console.log(`Serveur backend en cours sur http://localhost:${port}`);
});
