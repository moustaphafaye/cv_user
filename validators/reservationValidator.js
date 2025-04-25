const mongoose = require('mongoose');
const Service = require('../models/service');
const User = require('../models/user');

exports.validateReservationData = async (data) => {
  const errors = {};

  const requiredFields = ['service', 'date', 'heure', 'duree', 'adresse', 'nom_complet', 'telephone', 'email'];
  requiredFields.forEach(field => {
    if (!data[field]) {
      errors[field] = `Le champ ${field} est obligatoire`;
    }
  });

  // Vérifier format d'heure HH:mm
  const heureRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (data.heure && !heureRegex.test(data.heure)) {
    errors.heure = "L'heure doit être au format HH:mm";
  }

  // Vérifier email
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (data.email && !emailRegex.test(data.email)) {
    errors.email = "Adresse e-mail invalide";
  }

  // Vérifier date future
  if (data.date) {
    const reservationDate = new Date(data.date);
    if (reservationDate < new Date()) {
      errors.date = 'La date de réservation doit être dans le futur';
    }
  }

  // Vérifier service
  if (data.service) {
    const serviceExists = await Service.findById(data.service);
    if (!serviceExists) {
      errors.service = 'Service non trouvé';
    }
  }

  // Vérifier prestataire si fourni
  if (data.prestataire) {
    const prestataireExists = await User.findOne({
      _id: data.prestataire,
      userType: 'prestataire',
      'experience.specialite': data.service
    });

    if (!prestataireExists) {
      errors.prestataire = 'Prestataire non valide ou ne proposant pas ce service';
    }
  }

  return errors;
};
