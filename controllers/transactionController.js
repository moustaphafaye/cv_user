const Transaction = require('../models/transaction');
const { validateTransactionData } = require('../validators/transactionValidation');

// Créer une transaction
// exports.createTransaction = async (req, res) => {
//   try {
//     const errors = validateTransactionData(req.body);

//     if (errors.length > 0) {
//       return res.status(400).json({ success: false, message: 'Erreur de validation', errors });
//     }

//     const newTransaction = new Transaction(req.body);
//     await newTransaction.save();

//     res.status(201).json({ success: true, message: 'Transaction créée avec succès', data: newTransaction });
//   } catch (error) {
//     console.error('Erreur création transaction :', error);
//     res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
//   }
// };

// Lister toutes les transactions

exports.createTransaction = async (req, res) => {
  try {
    const { nom_client, montant, type, statut } = req.body;

    // Validation des données
    const errors = validateTransactionData({ nom_client, montant, type, statut });

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: errors // Retourner les erreurs spécifiques
      });
    }

    // Création de la transaction
    const newTransaction = new Transaction({
      nom_client,
      montant,
      type,
      statut
    });

    await newTransaction.save();

    return res.status(201).json({
      success: true,
      message: 'Transaction créée avec succès',
      data: newTransaction
    });
  } catch (error) {
    console.error('Erreur création transaction:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    console.error('Erreur listage transactions :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};

// Voir détails d'une transaction
exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction non trouvée' });
    }

    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    console.error('Erreur détail transaction :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};

// Modifier une transaction
exports.updateTransaction = async (req, res) => {
  try {
    const errors = validateTransactionData(req.body);

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: 'Erreur de validation', errors });
    }

    const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction non trouvée' });
    }

    res.status(200).json({ success: true, message: 'Transaction mise à jour', data: transaction });
  } catch (error) {
    console.error('Erreur modification transaction :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};

// Supprimer une transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction non trouvée' });
    }

    res.status(200).json({ success: true, message: 'Transaction supprimée avec succès' });
  } catch (error) {
    console.error('Erreur suppression transaction :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};
