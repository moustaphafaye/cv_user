const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    nom_client: {
        type: String,
        required: true
    },
    montant: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['paiement', 'remboursement'],
        required: true
    },
    statut: {
        type: String,
        enum: ['complet', 'en attente', 'échoué'],
        required: true
    }
}, {
    timestamps: true // Ajoute createdAt et updatedAt automatiquement
});

module.exports = mongoose.model('Transaction', transactionSchema);
