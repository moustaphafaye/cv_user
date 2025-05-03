const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const Demande = require('../models/demande');
const bcrypt = require('bcryptjs');
// const { validateCreateUser } = require('../validators/validateUserData');
const { validateUserData } = require('../validators/userValidation');
const { handleValidationError } = require('../utils/fileCleanup');

// exports.createUser = async (req, res) => {
//   try {
//     const { userType, password, ...userData } = req.body;

//     if (typeof userData.info_person === 'string') {
//       userData.info_person = JSON.parse(userData.info_person);
//     }
//     if (typeof userData.experience === 'string') {
//       userData.experience = JSON.parse(userData.experience);
//     }

//     const errors = validateUserData({ userType, password, ...userData });


//     if (Object.keys(errors).length > 0) {
//       return handleValidationError(res, errors, req);
//     }


//     if (!['client', 'prestataire'].includes(userType)) {
//       return res.status(400).json({ message: 'Type d\'utilisateur invalide' });
//     }

//     // Cas particulier: prestataire avec inscription assistée
//     if (userType === 'prestataire' && userData.type_inscription === 'assister') {

//       if (!userData.telephone) {
//         return res.status(400).json({ message: 'Le téléphone est requis pour une inscription assistée' });
//       }

//       // Création de la demande
//       const nouvelleDemande = new Demande({
//         telephone: userData.telephone
//       });

//       await nouvelleDemande.save();

//       return res.status(201).json({
//         message: 'Demande d\'inscription assistée créée avec succès',
//         demande: nouvelleDemande
//       });
//     }

//     // Reste de la logique pour les clients et prestataires avec inscription complète
//     if (userType === 'client') {
//       if (!userData.tel) {
//         return res.status(400).json({ message: 'L\'tel est requis pour un client' });
//       }
//     } else { // Prestataire avec inscription complète
//       const requiredFields = ['info_person', 'experience'];
//       for (const field of requiredFields) {
//         if (!userData[field]) {
//           return res.status(400).json({ message: `Le champ ${field} est requis pour une inscription complète` });
//         }
//       }
//     }

//     // Vérification tel existant
//     const telToCheck = userType === 'client' ? userData.tel : userData.info_person.tel;
//     const existingUser = await User.findOne({
//       $or: [
//         { tel: telToCheck },
//         { 'info_person.tel': telToCheck }
//       ]
//     });

//     // if (existingUser) {
//     //   return res.status(400).json({ message: 'Cet tel est déjà utilisé' });
//     // }
//     if (existingUser) {
//       errors.tel = 'Ce numéro de téléphone est déjà utilisé';
//     }
    
//     if (Object.keys(errors).length > 0) {
//       return handleValidationError(res, errors, req);
//     }



//     // Hashage du mot de passe
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Création de l'utilisateur
//     const newUser = new User({
//       ...userData,
//       userType,
//       password: hashedPassword
//     });

//     await newUser.save();

//     const userToReturn = newUser.toObject();
//     delete userToReturn.password;

//     res.status(201).json({
//       message: 'Utilisateur créé avec succès',
//       user: userToReturn
//     });

//   } catch (error) {
//     console.error('Erreur:', error);
//     res.status(500).json({
//       message: 'Erreur lors de la création',
//       error: error.message
//     });
//   }
// };

exports.createUser = async (req, res) => {
  try {
    const { userType, password, ...userData } = req.body;

    // 1. Vérification type d'utilisateur
    if (!['client', 'prestataire'].includes(userType)) {
      return res.status(400).json({ message: 'Type d\'utilisateur invalide' });
    }

    // 2. Cas particulier : prestataire avec inscription assistée

    // if (userType === 'prestataire' && userData.type_inscription === 'assister') {
    //   if (!userData.telephone) {
    //     return res.status(400).json({ message: 'Le téléphone est requis pour une inscription assistée' });
    //   }

    //   const nouvelleDemande = new Demande({ telephone: userData.telephone });
    //   await nouvelleDemande.save();

    //   return res.status(201).json({
    //     message: 'Demande d\'inscription assistée créée avec succès',
    //     demande: nouvelleDemande
    //   });
    // }

    if (userType === 'prestataire' && userData.type_inscription === 'assister') {
      if (!userData.telephone) {
        return res.status(400).json({ message: 'Le téléphone est requis pour une inscription assistée' });
      }
    
      // Vérifier si le téléphone existe déjà dans une demande
      const existingDemande = await Demande.findOne({ telephone: userData.telephone });
      if (existingDemande) {
        return res.status(400).json({ message: 'Une demande avec ce téléphone existe déjà' });
      }
    
      // Vérifier aussi si ce téléphone est déjà utilisé dans un compte utilisateur
      const existingUser = await User.findOne({
        $or: [
          { tel: userData.telephone },
        ]
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Ce numéro de téléphone est déjà utilisé par un utilisateur existant' });
      }
    
      const nouvelleDemande = new Demande({ telephone: userData.telephone });
      await nouvelleDemande.save();
    
      return res.status(201).json({
        message: 'Demande d\'inscription assistée créée avec succès',
        demande: nouvelleDemande
      });
    }
    

    // 3. Parsing des champs JSON si ce n’est pas une inscription assistée
    if (typeof userData.info_person === 'string') {
      userData.info_person = JSON.parse(userData.info_person);
    }
    if (typeof userData.experience === 'string') {
      userData.experience = JSON.parse(userData.experience);
    }

    // 4. Validation générale
    const errors = validateUserData({ userType, password, ...userData }) || {};

    // 5. Vérification numéro déjà existant
    const telToCheck = userType === 'client' ? userData.tel : userData.info_person?.tel;
    const existingUser = await User.findOne({
      $or: [
        { tel: telToCheck },
        { 'info_person.tel': telToCheck }
      ]
    });

    if (existingUser) {
      errors.tel = 'Ce numéro de téléphone est déjà utilisé';
    }

    // 6. Gestion des erreurs
    if (Object.keys(errors).length > 0) {
      return handleValidationError(res, errors, req);
    }

    // 7. Vérification des champs requis
    if (userType === 'client') {
      if (!userData.tel) {
        return res.status(400).json({ message: 'Le champ tel est requis pour un client' });
      }
    } else {
      const requiredFields = ['info_person', 'experience'];
      for (const field of requiredFields) {
        if (!userData[field]) {
          return res.status(400).json({ message: `Le champ ${field} est requis pour une inscription complète` });
        }
      }
    }

    // 8. Création de l'utilisateur
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      ...userData,
      userType,
      password: hashedPassword
    });

    await newUser.save();
    const userToReturn = newUser.toObject();
    delete userToReturn.password;

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: userToReturn
    });

  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({
      message: 'Erreur lors de la création',
      error: error.message
    });
  }
};


exports.listClients = async (req, res) => {
  try {
    const clients = await User.find({ userType: 'client' }).select('-password');;
    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des clients', error: err });
  }
};


exports.listPrestataires = async (req, res) => {
  try {


    const prestataires = await User.find({ userType: 'prestataire' })
      .select('-password')
      .populate('experience.specialite'); // <<–– remplissage des services

    res.status(200).json({
      success: true,
      count: prestataires.length,
      data: prestataires
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des prestataires',
      error: err.message
    });
  }
};

exports.recherchePrestataires = async (req, res) => {
  try {
    const { id: serviceId, localocation: localisation } = req.params;

    if (!localisation || !serviceId) {
      return res.status(400).json({ message: 'Localisation et service requis.' });
    }

    const prestataires = await User.find({
      userType: 'prestataire',
      'info_person.addresse': localisation,
      'experience.specialite': serviceId  // serviceId est un ObjectId
    })
      .select('-password')
      .populate('experience.specialite', 'nom tarif_horaire'); // Pour afficher les infos du service

    res.status(200).json({
      success: true,
      count: prestataires.length,
      data: prestataires
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la recherche des prestataires',
      error: err.message
    });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const utilisateur = await User.findByIdAndDelete(req.params.id);

    if (!utilisateur) {
      return res.status(404).json({ success: false, message: 'utilisateur non trouvé' });
    }

    res.status(200).json({ success: true, message: 'utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression utilisateur :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};


// Exemple avec un middleware d'authentification qui met l'ID du user dans req.userId

exports.getUserPhoto = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('photo_profi');

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({ photo_profi: user.photo_profi });
  } catch (error) {
    console.error("Erreur récupération photo:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};




