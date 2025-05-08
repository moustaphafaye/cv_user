const mongoose = require('mongoose');

const avisSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  auteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  note: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  avis: {
    type: String,
    maxlength: 1000,
    required: false
  },
  photo: {
    type: String, // URL ou nom de fichier stocké
    required: false
  },
  // created_at: {
  //   type: Date,
  //   default: Date.now
  // }
},{ timestamps: true });

module.exports = mongoose.model('Avis', avisSchema);
