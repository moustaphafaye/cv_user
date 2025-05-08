const Reservation = require('../models/reservation');
const User = require('../models/user');
const Service = require('../models/service');
const Demande = require('../models/demande');
const Transaction = require('../models/transaction');
const Ticket = require('../models/ticket');
const Avis = require('../models/avis');


exports.statistiques_de_la_semaine = async (req, res) => {
  try {

    // console.log('body', req.query.duree);
    const duree = parseInt(req.query.duree) || 7; // Par défaut 7 jours
    // const body = req.params;

    const dateLimite = new Date();
    dateLimite.setDate(dateLimite.getDate() - duree);

    // Réservations
    const reservations = await Reservation.find({
      createdAt: { $gte: dateLimite },
      status: { $in: ['pending', 'confirmed', 'completed', 'cancelled'] }
    })
      .populate({
        path: 'prestataire',
        select: '-password'
      })
      .populate('service');

    const reservationCount = reservations.length;

    const reservationsByStatus = {
      pending: [],
      confirmed: [],
      completed: [],
      cancelled: []
    };
    reservations.forEach(reservation => {
      if (reservationsByStatus[reservation.status]) {
        reservationsByStatus[reservation.status].push(reservation);
      }
    });

    // Services
    const services = await Service.find({
      createdAt: { $gte: dateLimite }
    });
    const serviceCount = services.length;

    // Prestataires
    const prestataires = await User.find({
      userType: 'prestataire',
      createdAt: { $gte: dateLimite }
    }).select('-password');
    const prestataireCount = prestataires.length;

    // Clients
    const client = await User.find({
      userType: 'client',
      createdAt: { $gte: dateLimite }
    }).select('-password');
    const clientCount = client.length;

    // Demandes
    const demandes = await Demande.find({
      createdAt: { $gte: dateLimite }
    });
    const demandesCount = demandes.length;
    const demandesByStatus = {
      en_attente: [],
      approuvé: [],
      rejeté: [],
      // cancelled: []
    };
    demandes.forEach(demande => {
      if (demandesByStatus[demande.status]) {
        demandesByStatus[demande.status].push(demande);
      }
    });

    // Transactions
    const transaction = await Transaction.find({
      createdAt: { $gte: dateLimite }
    });
    const transactionCount = transaction.length;
    let amount = 0;
    const transactionByStatus = {
      complet: [],
      en_attente: [],
      échoué: [],
      // cancelled: []
    };
    transaction.forEach(transaction => {
      if (transactionByStatus[transaction.status]) {
        transactionByStatus[transaction.status].push(transaction);
      }
      amount = transaction.amount + amount;
    });

    const paiementLinkTransactions = transaction.filter(t => t.type === 'payment_link');
    const paiementLinkCount = paiementLinkTransactions.length;
    const paiementLinkByStatus = {
      complet: [],
      en_attente: [],
      échoué: [],
    };
    
    paiementLinkTransactions.forEach(t => {
      if (paiementLinkByStatus[t.status]) {
        paiementLinkByStatus[t.status].push(t);
      }
    });

    // Tickets
    const tickets = await Ticket.find({
      createdAt: { $gte: dateLimite }
    });
    const ticketCount = tickets.length;

    // Avis
    const avis = await Avis.find({
      createdAt: { $gte: dateLimite }
    });

    res.json({
      success: true,
      data: {
        reservations: {
          total: reservationCount,
          data: reservations,
          byStatus: {
            pending: {
              total: reservationsByStatus.pending.length,
              data: reservationsByStatus.pending
            },
            confirmed: {
              total: reservationsByStatus.confirmed.length,
              data: reservationsByStatus.confirmed
            },
            completed: {
              total: reservationsByStatus.completed.length,
              data: reservationsByStatus.completed
            },
            cancelled: {
              total: reservationsByStatus.cancelled.length,
              data: reservationsByStatus.cancelled
            }
          }
        },
        services: {
          total: serviceCount,
          data: services
        },
        prestataires: {
          total: prestataireCount,
          data: prestataires
        },
        clients: {
          total: clientCount,
          data: client
        },
        demandes: {
          total: demandesCount,
          data: demandes,
          byStatus: {
            en_attente: {
              total: demandesByStatus.en_attente.length,
              data: demandesByStatus.en_attente
            },
            approuvé: {
              total: demandesByStatus.approuvé.length,
              data: demandesByStatus.approuvé
            },
            rejeté: {
              total: demandesByStatus.rejeté.length,
              data: demandesByStatus.rejeté
            }
          }
        },
        transactions: {
          total: transactionCount,
          totalAmount: amount + ' ' + 'FCFA',
          data: transaction,
          byStatus: {
            complet: {
              total: transactionByStatus.complet.length,
              data: transactionByStatus.complet
            },
            en_attente: {
              total: transactionByStatus.en_attente.length,
              data: transactionByStatus.en_attente
            },
            échoué: {
              total: transactionByStatus.échoué.length,
              data: transactionByStatus.échoué
            }
          },
          paiementLinkTransactions: {
            total: paiementLinkCount,
            data: paiementLinkTransactions,
            byStatus: {
              complet: {
                total: paiementLinkByStatus.complet.length,
                data: paiementLinkByStatus.complet
              },
              en_attente: {
                total: paiementLinkByStatus.en_attente.length,
                data: paiementLinkByStatus.en_attente
              },
              échoué: {
                total: paiementLinkByStatus.échoué.length,
                data: paiementLinkByStatus.échoué
              }
            }
          }
        },
        tickets: {
          total: ticketCount,
          data: tickets
        },
        avis: {
          total: avis.length,
          data: avis
        }
      }
    });

  } catch (error) {
    console.error('Erreur lors du calcul des statistiques :', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du calcul des statistiques',
      error: error.message
    });
  }
};


