const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telephone: { type: String, required: true },
    adresse: { type: String, required: true },
    poste: { type: String, required: true },
    description: { type: String, required: true },
    
    experiences: [
        {
            poste: { type: String, required: true },
            entreprise: { type: String, required: true },
            date_debut: String,
            date_fin: String,
            description: { type: String, required: true },
        }
    ],
    //Education
    formations: [
        {
            ecole : { type: String , required: true},
            diplome: { type: String, required: true},
            date_debut: { type: String , required: true},
            date_fin: { type: String , required: true},
            description: { type: String , required: true},
        }
    ],
    langues: [
        {
            libelle: { type: String, required: true },
            niveau : { type: String, required: true}
        }
    ],
    competences: [
        {
            libelle :{ type: String, required: true}
        }
    ],
    loisirs : [
        {
            libelle: { type: String , required: true}
        }
    ],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
