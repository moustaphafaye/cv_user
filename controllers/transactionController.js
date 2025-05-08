const Transaction = require('../models/transaction');
const { validateTransactionData } = require('../validators/transactionValidation');

const { sendPaymentLinkEmail } = require('../mail/mailer');
// Créer une transaction


// exports.createTransaction = async (req, res) => {
//   try {
//     const {
//       type,
//       ...data
//     } = req.body;

//     const errors = validateTransactionData({ type, ...data });

//     if (Object.keys(errors).length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Erreur de validation',
//         errors,
//       });
//     }

//     // Création de l'objet avec seulement les champs valides selon le type
//     const transactionData = {
//       ...data,
//       type,
//     };

//     const newTransaction = new Transaction(transactionData);
//     await newTransaction.save();

//     return res.status(201).json({
//       success: true,
//       message: 'Transaction créée avec succès',
//       data: newTransaction,
//     });
//   } catch (error) {
//     console.error('Erreur lors de la création de la transaction :', error);
//     res.status(500).json({
//       success: false,
//       message: 'Erreur serveur',
//       error: error.message,
//     });
//   }
// };



exports.createTransaction = async (req, res) => {
  try {
    let {
      client,
      amount,
      type,
      status,
      phone,
      email,
      paymentLink,
      date,
    } = req.body;

    const errors = validateTransactionData({
      client,
      amount,
      type,
      status,
      phone,
      date,
    });

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors,
      });
    }

    const transactionData = {
      client,
      amount: Number(amount),
      type,
      status,
      phone,
      date: date ? new Date(date) : undefined,
    };

    if (type === 'payment_link') {
      if (email) transactionData.email = email;
      if (paymentLink) transactionData.paymentLink = paymentLink;
    }

    const newTransaction = new Transaction(transactionData);
    await newTransaction.save();

    if (type === 'payment_link' && email) {
      await sendPaymentLinkEmail(email, client, amount, paymentLink);
    }

    return res.status(201).json({
      success: true,
      message: 'Transaction créée avec succès',
      data: newTransaction,
    });
  } catch (error) {
    console.error('Erreur création transaction :', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message,
    });
  }
};


// exports.createTransaction = async (req, res) => {
//   try {
//     let {
//       client,
//       amount,
//       type,
//       status,
//       phone,
//       email,
//       paymentLink,
//       date,
//     } = req.body;

//     // Validation des données
//     const errors = validateTransactionData({
//       client,
//       amount,
//       type,
//       status,
//       phone,
//       date
//     });

//     if (Object.keys(errors).length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Erreur de validation',
//         errors,
//       });
//     }

//     // Construction des données selon le type
//     const transactionData = {
//       client,
//       amount: Number(amount),
//       type,
//       status,
//       phone,
//       date: date ? new Date(date) : undefined,
//     };

//     // Si type = 'payment_link', on inclut email et paymentLink
//     if (type === 'payment_link') {
//       if (email) transactionData.email = email;
//       if (paymentLink) transactionData.paymentLink = paymentLink;
//     }

//     // Création et enregistrement
//     const newTransaction = new Transaction(transactionData);
//     await newTransaction.save();

//     return res.status(201).json({
//       success: true,
//       message: 'Transaction créée avec succès',
//       data: newTransaction,
//     });
//   } catch (error) {
//     console.error('Erreur création transaction :', error);
//     res.status(500).json({
//       success: false,
//       message: 'Erreur serveur',
//       error: error.message,
//     });
//   }
// };



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
