const express = require('express');
const bodyParser = require('body-parser');
const formData = require("express-form-data");
const cors = require('cors');
const os = require("os");
const connectDB = require('./config/db');
require('dotenv').config();


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware
app.use(bodyParser.json());
app.use(cors());


// const options = {
//   uploadDir: os.tmpdir(),
//   autoClean: true
// };

// app.use(formData.parse(options));
// app.use(formData.format()); 
// app.use(formData.stream());
// app.use(formData.union());


// Connexion à la base de données
connectDB();

// Routes
const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const loginRoute = require('./routes/loginRoutes');
const avisRoutes = require('./routes/avisRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/authentification', loginRoute);
app.use('/api/reservations', reservationRoutes);
app.use('/api/avis', avisRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/transactions', transactionRoutes);

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Le server est démarré sur : ${PORT}`);
});