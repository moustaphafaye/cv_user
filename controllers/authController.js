const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { tel, password } = req.body;

    // Validation
    if (!tel || !password) {
      return res.status(400).json({
        success: false,
        message: 'Le téléphone et le mot de passe sont requis'
      });
    }

    // Recherche de l'utilisateur selon son type
    const user = await User.findOne({
      $or: [
        // Clients (tel au niveau racine)
        { userType: 'client', tel },
        // Prestataires (tel dans info_person)
        { userType: 'prestataire', 'info_person.tel': tel }
      ]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Aucun compte trouvé avec ce numéro'
      });
    }

    // Vérification mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Mot de passe incorrect'
      });
    }

    // Préparation des données utilisateur
    const userData = {
      id: user._id,
      userType: user.userType,
      tel: user.userType === 'client' ? user.tel : user.info_person.tel
    };

    // Génération du token
    const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Réponse
    const response = {
      _id: user._id,
      userType: user.userType,
      tel: userData.tel
    };

    // Ajout des infos supplémentaires pour les prestataires
    if (user.userType === 'prestataire') {
      response.info_person = {
        prenom: user.info_person.prenom,
        nom: user.info_person.nom
      };
    }

    res.json({
      success: true,
      message: 'Connexion réussie',
      token,
      user: response
    });

  } catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: error.message
    });
  }
};