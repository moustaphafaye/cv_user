const Avis = require('../models/avis');
const Service = require('../models/service');
const { validateAvisData } = require('../validators/avisValidation');

exports.createAvis = async (req, res) => {
    try {

        const { service, note, avis, photo } = req.body;
        const userId = req.user.id; // supposé venir de l'auth middleware

        // Valider les données
        const errors = await validateAvisData({ service, note, avis, photo, auteur: userId });
        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Erreur de validation',
                errors
            });
        }

        // Vérifie si l'utilisateur a déjà laissé un avis pour ce service
        const existingAvis = await Avis.findOne({ service, auteur: userId });
        if (existingAvis) {
            return res.status(400).json({
                success: false,
                message: 'Vous avez déjà laissé un avis pour ce service.'
            });
        }

        // Créer l’avis
        const newAvis = new Avis({
            service,
            auteur: userId,
            note,
            avis,
            photo
        });

        await newAvis.save();

        const result = await newAvis.populate('service', 'nom description');

        res.status(201).json({
            success: true,
            message: 'Avis ajouté avec succès',
            data: result
        });

    } catch (error) {
        console.error('Erreur lors de la création de l\'avis :', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error.message
        });
    }
};



exports.listAvis = async (req, res) => {
    try {
        const { service } = req.query;

        const filter = {};
        if (service) {
            filter.service = service;
        }

        const avisList = await Avis.find(filter)
            .populate('service', 'nom description')
            .populate('auteur', 'info_person.nom info_person.prenom photo') // si tu veux afficher les infos de l'auteur
            .sort({ created_at: -1 }); // du plus récent au plus ancien

        res.status(200).json({
            success: true,
            message: 'Liste des avis récupérée avec succès',
            data: avisList
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des avis :', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error.message
        });
    }
};


exports.getAvisById = async (req, res) => {
    try {
        const { id } = req.params;

        const avis = await Avis.findById(id)
            .populate('service', 'nom description')
            .populate('auteur', 'info_person.nom info_person.prenom photo');

        if (!avis) {
            return res.status(404).json({
                success: false,
                message: 'Avis non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Détails de l\'avis récupérés avec succès',
            data: avis
        });

    } catch (error) {
        console.error('Erreur récupération détail avis :', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error.message
        });
    }
};


exports.updateAvis = async (req, res) => {
  try {
    const { id } = req.params;
    const { note, avis, photo } = req.body;
    const userId = req.user.id;

    const existingAvis = await Avis.findById(id);

    if (!existingAvis) {
      return res.status(404).json({
        success: false,
        message: 'Avis non trouvé'
      });
    }

    if (existingAvis.auteur.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à modifier cet avis'
      });
    }

    // Validation (optionnelle si tu veux vérifier à nouveau le contenu)
    const errors = await validateAvisData({ service: existingAvis.service, note, avis, photo, auteur: userId });
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors
      });
    }

    existingAvis.note = note ?? existingAvis.note;
    existingAvis.avis = avis ?? existingAvis.avis;
    existingAvis.photo = photo ?? existingAvis.photo;

    await existingAvis.save();

    res.status(200).json({
      success: true,
      message: 'Avis modifié avec succès',
      data: existingAvis
    });

  } catch (error) {
    console.error('Erreur modification avis :', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};



exports.deleteAvis = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const avis = await Avis.findById(id);

    if (!avis) {
      return res.status(404).json({
        success: false,
        message: 'Avis non trouvé'
      });
    }

    if (avis.auteur.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à supprimer cet avis'
      });
    }

    await Avis.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Avis supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur suppression avis :', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};


