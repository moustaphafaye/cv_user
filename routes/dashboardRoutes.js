const express = require('express');
const router = express.Router();
const { statistiques_de_la_semaine , statistiques_du_mois } = require('../controllers/dashboardController');
const { authenticate } = require('../middlewares/auth');

// CRUD Routes
router.get('/data',authenticate , statistiques_de_la_semaine);
// router.get('/data/mois', statistiques_du_mois);


module.exports = router;
