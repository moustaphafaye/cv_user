const { body } = require('express-validator');

// Validation pour créer un utilisateur
exports.validateCreateUser = [
  body('name').notEmpty().withMessage('Le nom est requis'),
  body('prenom').notEmpty().withMessage('Le prénom est requis'),
  body('email').isEmail().withMessage('Email invalide'),
  body('telephone').notEmpty().withMessage('Téléphone requis'),
  body('adresse').notEmpty().withMessage('Adresse requise'),
  body('poste').notEmpty().withMessage('Poste requis'),
  body('description').notEmpty().withMessage('Description requise'),
];

// Validation pour ajouter une formation
exports.validateFormation = [
  body('formation.ecole').notEmpty().withMessage("L'école est requise"),
  body('formation.diplome').notEmpty().withMessage('Le diplôme est requis'),
  body('formation.date_debut').notEmpty().withMessage('Date de début requise'),
  body('formation.date_fin').notEmpty().withMessage('Date de fin requise'),
  body('formation.description').notEmpty().withMessage('Description requise'),
];

// Validation pour ajouter une expérience
exports.validateExperience = [
  body('experience.poste').notEmpty().withMessage('Poste requis'),
  body('experience.entreprise').notEmpty().withMessage('Entreprise requise'),
  body('experience.description').notEmpty().withMessage('Description requise'),
];

// Validation pour langue
exports.validateLangue = [
  body('langue.libelle').notEmpty().withMessage('Nom de langue requis'),
  body('langue.niveau').notEmpty().withMessage('Niveau requis'),
];

// Validation pour compétence
exports.validateCompetence = [
  body('competence.libelle').notEmpty().withMessage('Libellé requis'),
];

// Validation pour loisir
exports.validateLoisir = [
  body('loisir.libelle').notEmpty().withMessage('Libellé requis'),
];
