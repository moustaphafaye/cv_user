
require('dotenv').config();
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');


const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
    },
});

exports.sendPaymentLinkEmail = async (to, client, amount, paymentLink) => {
    // Chemin vers le template
    const templatePath = path.join(__dirname, '../templates/paymentLinkEmail.ejs');
  
    // Rendu du contenu HTML avec les données
    const htmlContent = await ejs.renderFile(templatePath, {
      client,
      amount,
      paymentLink
    });
  
    const mailOptions = {
      from: `"Service Paiement" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Votre lien de paiement',
      html: htmlContent
    };
  
    await transporter.sendMail(mailOptions);
  };