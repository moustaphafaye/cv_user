const User = require('../models/user');

const Demande = require('../models/demande');
const bcrypt = require('bcryptjs');



exports.createUser = async (req, res) => {
  try {
    const { userType, password, ...userData } = req.body;

    if (!['client', 'prestataire'].includes(userType)) {
      return res.status(400).json({ message: 'Type d\'utilisateur invalide' });
    }

    // Cas particulier: prestataire avec inscription assistée
    if (userType === 'prestataire' && userData.type_inscription === 'assister') {
      if (!userData.telephone) {
        return res.status(400).json({ message: 'Le téléphone est requis pour une inscription assistée' });
      }

      // Création de la demande
      const nouvelleDemande = new Demande({
        telephone: userData.telephone
      });

      await nouvelleDemande.save();

      return res.status(201).json({
        message: 'Demande d\'inscription assistée créée avec succès',
        demande: nouvelleDemande
      });
    }

    // Reste de la logique pour les clients et prestataires avec inscription complète
    if (userType === 'client') {
      if (!userData.tel) {
        return res.status(400).json({ message: 'L\'tel est requis pour un client' });
      }
    } else { // Prestataire avec inscription complète
      const requiredFields = ['info_person', 'experience'];
      for (const field of requiredFields) {
        if (!userData[field]) {
          return res.status(400).json({ message: `Le champ ${field} est requis pour une inscription complète` });
        }
      }
    }

    // Vérification tel existant
    const telToCheck = userType === 'client' ? userData.tel : userData.info_person.tel;
    const existingUser = await User.findOne({
      $or: [
        { tel: telToCheck },
        { 'info_person.tel': telToCheck }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Cet tel est déjà utilisé' });
    }

    // Hashage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
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




// exports.createUser = async (req, res) => {
//   try {
//     const { userType, password, ...userData } = req.body;

//     if (!['client', 'prestataire'].includes(userType)) {
//       return res.status(400).json({ message: 'Type d\'utilisateur invalide' });
//     }

//     // Gestion spécifique pour prestataire assisté
//     if (userType === 'prestataire' && userData.type_inscription === 'assister') {
//       if (!userData.telephone) {
//         return res.status(400).json({ message: 'Le téléphone est requis pour une inscription assistée' });
//       }

//       const nouvelleDemande = new Demande({
//         telephone: userData.telephone
//       });

//       await nouvelleDemande.save();

//       return res.status(201).json({
//         message: 'Demande d\'inscription assistée créée avec succès',
//         demande: nouvelleDemande
//       });
//     }

//     // Pour client ou prestataire complet
//     if (userType === 'client') {
//       if (!userData.tel) {
//         return res.status(400).json({ message: 'Le téléphone est requis pour un client' });
//       }
//     } else { // Prestataire complet
//       const requiredFields = ['info_person', 'experience'];
//       for (const field of requiredFields) {
//         if (!userData[field]) {
//           return res.status(400).json({ message: `Le champ ${field} est requis pour une inscription complète` });
//         }
//       }
//     }

//     // Vérification de tel existant
//     const telToCheck = userType === 'client' ? userData.tel : userData.info_person.tel;
//     const existingUser = await User.findOne({
//       $or: [
//         { tel: telToCheck },
//         { 'info_person.tel': telToCheck }
//       ]
//     });

//     if (existingUser) {
//       return res.status(400).json({ message: 'Ce téléphone est déjà utilisé' });
//     }

//     // Hash du mot de passe
//     const hashedPassword = await bcrypt.hash(password, 10);

   
//     const newUser = new User({
//       ...userData,
//       userType,
//       password: hashedPassword,
//       photo_profi,
//       cv,
//       certification
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


// exports.listPrestataires = async (req, res) => {
//   try {
//     const prestataires = await User.find({ userType: 'prestataire' })
//       .select('-password -__v') // Exclure les champs sensibles
//       .lean();

//     const formattedPrestataires = prestataires.map(presta => ({
//       _id: presta._id,
//       info_person: {
//         prenom: presta.info_person.prenom,
//         nom: presta.info_person.nom,
//         email: presta.info_person.email,
//         tel: presta.info_person.tel,
//         addresse: presta.info_person.addresse
//       },
//       experience: {
//         annee: presta.experience.annee,
//         specialite: presta.experience.specialite,
//         disponibilite: presta.experience.disponibilite,
//         tarif: presta.experience.tarif
//       },
//       document: {
//         photo_profi: presta.document.photo_profi,
//         cv: presta.document.cv,
//         certification: presta.document.certification
//       },
//       createdAt: presta.createdAt,
//       updatedAt: presta.updatedAt
//     }));

//     res.json({
//       success: true,
//       count: formattedPrestataires.length,
//       data: formattedPrestataires
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Erreur lors de la récupération des prestataires',
//       error: error.message
//     });
//   }
// };
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


