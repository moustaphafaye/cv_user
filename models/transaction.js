const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    client: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['payment_link', 'payment', 'remboursement'],
        required: true
    },
    status: {
        type: String,
        enum: ['complet', 'en attente', 'échoué'],
        required: true
    },
    phone: {
        type: String
    },
    date: {
        type: Date,
        required: true
    },
    paymentLink: {
        type: String
    },
    email: {
        type: String
    }
}, {
    timestamps: true // Ajoute createdAt et updatedAt automatiquement
});

module.exports = mongoose.model('Transaction', transactionSchema);
