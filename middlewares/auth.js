// const jwt = require('jsonwebtoken');

// exports.authenticate = async (req, res, next) => {
//   try {
//     const token = req.header('Authorization')?.replace('Bearer ', '');
    
//     if (!token) {
//       return res.status(401).json({ 
//         success: false,
//         message: 'Veillez vous authentifier !!!' 
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET,{ expiresIn: '1h' });
    
//     // Ajout des informations utilisateur à la requête
//     req.user = {
//       id: decoded.id,
//       userType: decoded.userType,
//       tel: decoded.tel
//     };

//     next();
//   } catch (error) {
//     res.status(401).json({
//       success: false,
//       message: 'Token invalide ou expiré'
//     });
//   }
// };

const jwt = require('jsonwebtoken');
const { isBlacklisted } = require('./blacklist'); // Assurez-vous d'importer la fonction isBlacklisted

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Veuillez vous authentifier !!!' 
      });
    }

    if (isBlacklisted(token)) {
      return res.status(401).json({
        success: false,
        message: 'Token invalide (blacklisté)'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      userType: decoded.userType,
      tel: decoded.tel
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token invalide ou expiré'
    });
  }
};
