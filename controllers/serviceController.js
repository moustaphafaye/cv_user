const Service = require('../models/service');
const transporter = require("../mail/mailer"); // Importez le transporteur Nodemailer

// Créer un nouveau service
exports.createService = async (req, res) => {
    try {
        const { nom, description, tarif_horaire } = req.body;

        // Validation des données
        if (!nom) {
            return res.status(400).json({ message: 'Le nom du service est requis' });
        }

        // Vérifier si le service existe déjà
        const existingService = await Service.findOne({ nom });
        if (existingService) {
            return res.status(400).json({ message: 'Ce service existe déjà' });
        }

        // Création du service
        const newService = new Service({
            nom,
            description: description || '',
            tarif_horaire: tarif_horaire || 0
        });

        await newService.save();

        res.status(201).json({
            success: true,
            message: 'Service créé avec succès',
            data: newService
        });

    } catch (error) {
        console.error('Erreur création service:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création du service',
            error: error.message
        });
    }
};



// exports.createService = async (req, res) => {
//     try {
//         const { nom, description, tarif_horaire, email } = req.body; // Ajoutez `email` dans req.body

//         // Validation
//         if (!nom) {
//             return res.status(400).json({ message: 'Le nom du service est requis' });
//         }

//         // Vérifier si le service existe déjà
//         const existingService = await Service.findOne({ nom });
//         if (existingService) {
//             return res.status(400).json({ message: 'Ce service existe déjà' });
//         }

//         // Création du service
//         const newService = new Service({
//             nom,
//             description: description || '',
//             tarif_horaire: tarif_horaire || 0,
//         });

//         await newService.save();

//         // Envoi de l'e-mail après la création
//         await transporter.sendMail({
//             from: '"Équipe de Support" <support@votreapp.com>',
//             to: email, // L'e-mail du client (à passer dans req.body)
//             subject: "Votre service a été créé avec succès 🎉",
//             html: `
//                 <h1>Confirmation de création de service</h1>
//                 <p>Bonjour,</p>
//                 <p>Votre service <strong>${nom}</strong> a été créé avec succès.</p>
//                 <p>Détails :</p>
//                 <ul>
//                     <li>Description : ${description || "Non spécifiée"}</li>
//                     <li>Tarif horaire : ${tarif_horaire || 0} €</li>
//                 </ul>
//                 <p>Merci de nous faire confiance !</p>
//             `,
//         });

//         res.status(201).json({
//             success: true,
//             message: 'Service créé avec succès. Un e-mail de confirmation a été envoyé.',
//             data: newService,
//         });

//     } catch (error) {
//         console.error('Erreur création service:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Erreur lors de la création du service',
//             error: error.message,
//         });
//     }
// };
// Lister tous les services
exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.json({
            success: true,
            data: services
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des services',
            error: error.message
        });
    }
};


// 1. Lister tous les services
exports.listServices = async (req, res) => {
    try {
        const services = await Service.find().sort({ nom: 1 });
        res.json({
            success: true,
            count: services.length,
            data: services
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des services',
            error: error.message
        });
    }
};

// 2. Afficher un service spécifique (SHOW)
exports.showService = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Service.findById(id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service non trouvé'
            });
        }

        res.json({
            success: true,
            data: service
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du service',
            error: error.message
        });
    }
};

// 3. Mettre à jour un service
exports.updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const service = await Service.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service non trouvé'
            });
        }

        res.json({
            success: true,
            message: 'Service mis à jour avec succès',
            data: service
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Ce nom de service est déjà utilisé'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du service',
            error: error.message
        });
    }
};

// 4. Supprimer un service
exports.deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        const service = await Service.findByIdAndDelete(id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service non trouvé'
            });
        }

        res.json({
            success: true,
            message: 'Service supprimé avec succès',
            data: service
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du service',
            error: error.message
        });
    }
};