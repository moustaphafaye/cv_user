const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const Demande = require('../models/demande');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
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
    const files = req.files;
    if (files?.photo_profi?.[0]) {
      userData.photo_profi = files.photo_profi[0].filename;
    }
    if (files?.cv?.[0]) {
      userData.cv = files.cv[0].filename;
    }
    if (files?.certification?.[0]) {
      userData.certification = files.certification[0].filename;
    }
    // 1. Vérification type d'utilisateur
    if (!['client', 'prestataire'].includes(userType)) {
      return res.status(400).json({ message: 'Type d\'utilisateur invalide' });
    }

    // 2. Cas particulier : prestataire avec inscription assistée


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
    const clients = await User.find({ userType: 'client' }).select('-password');
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

    if (prestataires.length === 0) {
      return res.status(404).json({ 
        success: true,
        count: prestataires.length,
        data: prestataires,
        message: 'Aucun prestataire trouvé pour cette localisation et ce service.' });
    }

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


exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.params.id;

    // Vérifie que l'ID est bien un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'ID utilisateur invalide'
      });
    }

    const user = await User.findById(userId)
      .populate('experience.specialite').select('-password'); // si tu veux aussi les infos des services

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
   
    // stream.pipe(res);
    return res.status(200).json({
      success: true,
      data: user,
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du détail utilisateur :', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};


exports.getUserPhoto = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user || !user.photo_profi) {
      return res.status(404).json({ message: 'Photo non trouvée' });
    }
    // const photoPath = path.resolve(__dirname, '..', 'uploads/photos/1746546711257_image.jpg');
    const relativePath = 'uploads/photos/' + user.photo_profi;
    const photoPath = path.resolve(__dirname, '..', relativePath);

    if (!fs.existsSync(photoPath)) {
      return res.status(404).json({ message: 'Fichier image introuvable' });
    }

    const ext = path.extname(photoPath).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
    };

    res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');

    const stream = fs.createReadStream(photoPath);
    stream.pipe(res);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};



// exports.getUserDetails = async (req, res) => {
//   try {
//     const userId = req.params.id;

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({
//         success: false,
//         message: 'ID utilisateur invalide'
//       });
//     }

//     const user = await User.findById(userId)
//       .populate('experience.specialite')
//       .select('-password');

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'Utilisateur non trouvé'
//       });
//     }

//     const userData = user.toObject();

//     // Lire et encoder la photo si elle existe
//     if (userData.photo_profi) {
//       const imagePath = path.join(__dirname, '../public/uploads/', userData.photo_profi);
//       if (fs.existsSync(imagePath)) {
//         const imageBuffer = fs.readFileSync(imagePath);
//         userData.photo_profi_base64 = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
//       } else {
//         userData.photo_profi_base64 = null;
//       }
//     }

//     return res.status(200).json({
//       success: true,
//       data: userData
//     });

//   } catch (error) {
//     console.error('Erreur lors de la récupération du détail utilisateur :', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Erreur serveur',
//       error: error.message
//     });
//   }
// };


