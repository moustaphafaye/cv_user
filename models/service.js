const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    unique: true,
    // enum: ['Ménage', 'Repassage', 'Garde d\'enfants', 'Aide aux seniors', 'Courses'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  tarif_horaire: {
    type: Number,
    min: 0
  },
  // created_at: {
  //   type: Date,
  //   default: Date.now
  // }
},{ timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);