// server/utils/mailer.js
require("dotenv").config();

// Remplace avec tes vrais identifiants ou un compte test ethereal
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


async function envoyerMailReclamation({ to, nomTechnicien, nomClient, motif, libelle,nomresponsablee,nommagasin}) {
  const mailOptions = {
    from: '"Service Après-Vente" <tonemail@gmail.com>',
    to,
    subject: `Nouvelle réclamation assignée`,
    html: `
      <p>Bonjour ${nomTechnicien},</p>
      <p>Une nouvelle réclamation vous a été assignée :</p>
      <ul>
        <li><strong>Client :</strong> ${nomClient}</li>
        <li><strong>Libellé :</strong> ${libelle}</li>
        <li><strong>Motif :</strong> ${motif}</li>
         <li><strong>Nom du responsable:</strong> ${nomresponsablee}</li>
        <li><strong>Nom du magasin:</strong> ${nommagasin}</li>
      </ul>
      <p>Merci de la traiter dès que possible.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { envoyerMailReclamation };
