const Reservation = require('../models/reservation');
const Service = require('../models/service');
const User = require('../models/user');
const { validateReservationData } = require('../validators/reservationValidator');
// Créer une nouvelle réservation


exports.createReservation = async (req, res) => {
  try {
    const { service, prestataire, ...reservationData } = req.body;

    // ✅ Validation centralisée
    const errors = await validateReservationData(req.body);

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors
      });
    }

    const newReservation = new Reservation({
      service,
      prestataire: prestataire || null,
      ...reservationData,
      status: 'pending',
      client: req.userId || null,
      isAnonymous: !req.userId
    });

    await newReservation.save();

    const result = await Reservation.findById(newReservation._id)
      .populate('service', 'nom description')
      .populate({
        path: 'prestataire',
        select: 'info_person.nom info_person.prenom',
        match: { _id: { $exists: true } }
      });

    res.status(201).json({
      success: true,
      message: 'Réservation créée avec succès',
      data: result
    });

  } catch (error) {
    console.error('Erreur création réservation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la réservation',
      error: error.message
    });
  }
};


// exports.createReservation = async (req, res) => {
//   try {
//     // 1. Validation des données
//     const { error, value } = validateCreateReservation(req.body);
//     if (error) {
//       const errors = error.details.map(detail => ({
//         field: detail.path[0],
//         message: detail.message
//       }));
//       return res.status(400).json({
//         success: false,
//         message: 'Validation error',
//         errors
//       });
//     }

//     // 2. Vérification supplémentaire du prestataire (si fourni)
//     if (value.prestataire) {
//       const prestataire = await User.findOne({
//         _id: value.prestataire,
//         userType: 'prestataire',
//         'experience.specialite': value.service
//       });
//       if (!prestataire) {
//         return res.status(400).json({
//           success: false,
//           message: 'Prestataire non valide ou ne proposant pas ce service'
//         });
//       }
//       value.prixTotal = prestataire.experience.tarif * value.duree;
//     }

//     // 3. Création de la réservation
//     const newReservation = new Reservation({
//       ...value,
//       client: req.userId || null,
//       status: 'pending'
//     });

//     await newReservation.save();

//     const result = await Reservation.findById(newReservation._id)
//       .populate('service', 'nom description')
//       .populate({
//         path: 'prestataire',
//         select: 'info_person.nom info_person.prenom',
//         match: { _id: { $exists: true } } // Ne peuplera que si prestataire existe
//       });


//     res.status(201).json({
//       success: true,
//       message: 'Réservation créée avec succès',
//       data: result
//     });

//   } catch (error) {
//     console.error('Erreur création réservation:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Erreur lors de la création de la réservation',
//       error: error.message
//     });
//   }
// };

// Lister les réservations d'un utilisateur
exports.getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ client: req.userId })
      .populate('service')
      .sort({ date: -1 });

    res.json({
      success: true,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des réservations',
      error: error.message
    });
  }
};


// 1. Lister toutes les réservations (avec filtres)
exports.listReservations = async (req, res) => {
  try {
    const { status, client, service, date } = req.query;
    const filters = {};

    if (status) filters.status = status;
    if (client) filters.client = client;
    if (service) filters.service = service;
    if (date) filters.date = { $gte: new Date(date) };

    const reservations = await Reservation.find(filters)
      .populate('service')
      .populate('client', 'nom prenom email telephone')
      .sort({ date: -1, heure: 1 });

    res.json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des réservations',
      error: error.message
    });
  }
};

// 2. Afficher une réservation spécifique (SHOW)
exports.showReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id)
      .populate('service')
      .populate('client', 'nom prenom email telephone');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }


    //   if (req.user.role !== 'admin' && reservation.client._id.toString() !== req.user.id) {
    //     return res.status(403).json({
    //       success: false,
    //       message: 'Non autorisé à accéder à cette réservation'
    //     });
    //   }

    res.json({
      success: true,
      data: reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la réservation',
      error: error.message
    });
  }
};

// 3. Mettre à jour une réservation
exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Empêcher la modification du client
    if (updates.client) {
      delete updates.client;
    }

    const reservation = await Reservation.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('service client');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Réservation mise à jour avec succès',
      data: reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la réservation',
      error: error.message
    });
  }
};

// 4. Supprimer une réservation
exports.deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findByIdAndDelete(id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Réservation supprimée avec succès',
      data: reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la réservation',
      error: error.message
    });
  }
};