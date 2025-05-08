const mongoose = require('mongoose');

const demandeSchema = new mongoose.Schema({
  telephone: {
    type: String,
    required: true,
    unique: true // Empêche les doublons
  },
  status: {
    type: String,
    enum: ['en_attente', 'approuvé', 'rejeté'],
    default: 'en_attente'
  },
 
  processed_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Référence à l'admin qui a traité la demande
  }
},{ timestamps: true });

module.exports = mongoose.model('Demande', demandeSchema);