// const express = require('express');
// const bodyParser = require('body-parser');
// const formData = require("express-form-data");
// const cors = require('cors');
// const os = require("os");
// const connectDB = require('./config/db');
// require('dotenv').config();

// const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Middleware
// app.use(bodyParser.json());
// app.use(cors());


// connectDB();

// // Routes
// const userRoutes = require('./routes/userRoutes');
// const serviceRoutes = require('./routes/serviceRoutes');
// const reservationRoutes = require('./routes/reservationRoutes');
// const loginRoute = require('./routes/loginRoutes');
// const avisRoutes = require('./routes/avisRoutes');
// const ticketRoutes = require('./routes/ticketRoutes');
// const transactionRoutes = require('./routes/transactionRoutes');
// const dashboardRoutes = require('./routes/dashboardRoutes');
// app.use('/api/users', userRoutes);
// app.use('/api/services', serviceRoutes);
// app.use('/api/authentification', loginRoute);
// app.use('/api/reservations', reservationRoutes);
// app.use('/api/avis', avisRoutes);
// app.use('/api/tickets', ticketRoutes);
// app.use('/api/transactions', transactionRoutes);
// app.use('/api/dashboard', dashboardRoutes);

// // Gestion des erreurs
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: 'Something went wrong!' });
// });

// // Port
// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`Le server est démarré sur : ${PORT}`);
// });

const express = require('express');
const bodyParser = require('body-parser');
const formData = require("express-form-data");
const cors = require('cors');
const os = require("os");
const http = require('http'); // <- nouveau
const { Server } = require('socket.io'); // <- nouveau
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
const server = http.createServer(app); // <- remplacer app.listen
const io = new Server(server, {
  cors: {
    origin: '*', // autoriser ton client Angular ou autre
    methods: ['GET', 'POST']
  }
});

// Attacher io à express pour y accéder dans les contrôleurs
app.set('io', io);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Connexion Mongo
connectDB();

// Routes
const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const loginRoute = require('./routes/loginRoutes');
const avisRoutes = require('./routes/avisRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/authentification', loginRoute);
app.use('/api/reservations', reservationRoutes);
app.use('/api/avis', avisRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Connexion socket
io.on('connection', (socket) => {
  console.log('Client connecté avec ID:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client déconnecté:', socket.id);
  });
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Le server est démarré sur : ${PORT}`);
});
