const fs = require('fs');
const path = require('path');

function handleValidationError(res, errors, req) {
  if (req.files) {
    Object.values(req.files).flat().forEach((file) => {
      fs.unlink(path.join(file.path), (err) => {
        if (err) {
          console.error('Erreur suppression fichier:', err);
        }
      });
    });
  }

  return res.status(400).json({
    message: 'Données invalides',
    errors
  });
}

module.exports = { handleValidationError };
