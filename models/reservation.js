const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    // client: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: function () { return !this.isAnonymous; }
    // },
    prestataire: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false, // Rendre facultatif
        validate: {
            validator: async function(prestataireId) {
                if (!prestataireId) return true; // Valide si null/undefined
                const user = await mongoose.model('User').findById(prestataireId);
                return user && user.userType === 'prestataire';
            },
            message: 'Doit être un ID de prestataire valide ou vide'
        }
    },
    date: {
        type: Date,
        required: true
    },
    heure: {
        type: String,
        required: true,
        match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/ // Format HH:MM
    },
    duree: {
        type: Number, // en heures
        required: true,
        min: 1
    },
    adresse: {
        type: String,
        required: true
    },
    nom_complet: {
        type: String,
        required: true
    },
    telephone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: /^\S+@\S+\.\S+$/
    },
    message: {
        type: String,
        maxlength: 500
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Reservation', reservationSchema);