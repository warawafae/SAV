const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/send', async (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail', // ou 'outlook', 'hotmail', ou config SMTP
    auth: {
      user: 'votreemail@gmail.com',
      pass: 'motdepasseoumdpapp',
    },
  });

  const mailOptions = {
    from: email,
    to: 'destinataire@example.com',
    subject: `Message de ${name}`,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email envoyé !' });
  } catch (error) {
    console.error('Erreur envoi mail:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de l’envoi.' });
  }
});

module.exports = router;
