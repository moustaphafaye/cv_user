const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userType: {
        type: String,
        enum: ['client', 'prestataire'],
        required: true
    },

    // Champs communs
    tel: {
        type: String,
        required: function () { return this.userType === 'client'; }
    },
    password: {
        type: String,
        required: true
    },

    // Champs spécifiques aux prestataires
    info_person: {
        prenom: {
            type: String,
            required: function () { return this.userType === 'prestataire'; }
        },
        nom: {
            type: String,
            required: function () { return this.userType === 'prestataire'; }
        },
        email: {
            type: String,
            required: function () { return this.userType === 'prestataire'; }
        },
        tel: {
            type: String,
            required: function () { return this.userType === 'prestataire'; }
        },
        addresse: {
            type: String,
            required: function () { return this.userType === 'prestataire'; }
        }
    },
    experience: {
        annee: {
            type: Number,
            required: function () { return this.userType === 'prestataire'; }
        },
        specialite: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service' // ← référence au modèle Service
        }],
        disponibilite: {
            type: [String],
            enum: ['Lundi matin', 'Lundi après-midi', 'Mardin matin', 'Mardi apres midi', 'Mercredi matin', 'Mercredi apres midi']
        },
        tarif: {
            type: Number,
            required: function () { return this.userType === 'prestataire'; }
        }
    },
    document: {
        photo_profi: String,
        cv: String,
        certification: String
    },
    
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);