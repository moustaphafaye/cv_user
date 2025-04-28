const Service = require('../models/service');

exports.validateAvisData = async (data) => {
  const errors = [];

  // Champs obligatoires
  if (!data.service) errors.push('Le champ "service" est requis.');
  if (!data.note && data.note !== 0) errors.push('Le champ "note" est requis.');
  if (!data.auteur) errors.push('L\'auteur est requis.');

  // Note entre 1 et 5
  if (data.note && (data.note < 1 || data.note > 5)) {
    errors.push('La note doit être comprise entre 1 et 5.');
  }

  // Vérifier si le service existe
  if (data.service) {
    const serviceExists = await Service.findById(data.service);
    if (!serviceExists) {
      errors.push('Le service spécifié n\'existe pas.');
    }
  }

  // Texte avis (optionnel mais limité)
  if (data.avis && data.avis.length > 1000) {
    errors.push('Le texte de l\'avis ne doit pas dépasser 1000 caractères.');
  }

  // Photo (optionnel mais peut être vérifiée si nécessaire)
  if (data.photo && typeof data.photo !== 'string') {
    errors.push('Le champ photo doit être une chaîne de caractères.');
  }

  return errors;
};
