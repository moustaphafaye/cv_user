const Ticket = require('../models/ticket');
const { validateTicketData } = require('../validators/ticketValidation');

// Créer un ticket
exports.createTicket = async (req, res) => {
  try {
    const errors = validateTicketData(req.body);

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: 'Erreur de validation', errors });
    }

    const newTicket = new Ticket(req.body);
    await newTicket.save();

    res.status(201).json({ success: true, message: 'Ticket créé avec succès', data: newTicket });
  } catch (error) {
    console.error('Erreur création ticket :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};

// Lister tous les tickets
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    console.error('Erreur listage tickets :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};

// Voir détails d'un ticket
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket non trouvé' });
    }

    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    console.error('Erreur détail ticket :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};

// Modifier un ticket
exports.updateTicket = async (req, res) => {
  try {
    const errors = validateTicketData(req.body);

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: 'Erreur de validation', errors });
    }

    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket non trouvé' });
    }

    res.status(200).json({ success: true, message: 'Ticket mis à jour', data: ticket });
  } catch (error) {
    console.error('Erreur modification ticket :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};

// Supprimer un ticket
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket non trouvé' });
    }

    res.status(200).json({ success: true, message: 'Ticket supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression ticket :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};
