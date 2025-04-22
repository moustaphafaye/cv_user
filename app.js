const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
app.use(express.json());
// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connexion à la base de données
connectDB();

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes);

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