const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  sujet: {
    type: String,
    required: true
  },
  nom_complet: {
    type: String,
    required: true
  },
  priorite: {
    type: String,
    enum: ['basse', 'moyenne', 'haute'],
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true // createdAt et updatedAt
});

module.exports = mongoose.model('Ticket', ticketSchema);
