const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

app.set("view engine", "ejs");
app.set("views", __dirname + "/../client");

// Servir les fichiers statiques dans dossier 'public'
app.use(express.static(__dirname + "/../client"));

app.get("/", (req, res) => {
    res.render("home"); // rend client/home.ejs
});
const magasinsRoute = require("./routes/magasins");
app.use("/api/magasins", magasinsRoute);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
