const Demande = require('../models/demande');
exports.processDemande = async (req, res) => {
    try {
      const { demandeId, action } = req.body; // action: 'approve' ou 'reject'
  
      const demande = await Demande.findById(demandeId);
      if (!demande) {
        return res.status(404).json({ message: 'Demande non trouvée' });
      }
  
      if (action === 'approve') {
        // Logique pour créer le compte utilisateur
        // (envoyer un lien d'inscription au prestataire par SMS)
        demande.status = 'processed';
      } else {
        demande.status = 'rejected';
      }
  
      demande.processedAt = new Date();
      await demande.save();
  
      res.json({ message: `Demande ${action === 'approve' ? 'approuvée' : 'rejetée'}` });
  
    } catch (error) {
      res.status(500).json({ message: 'Erreur', error: error.message });
    }
  };