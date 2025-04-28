exports.validateTransactionData = (data) => {
    const errors = {};

    // Vérifier le nom du client
    if (!data.nom_client || data.nom_client.trim() === '') {
      errors.nom_client = "Le nom du client est requis";
    }
  
    // Vérifier le montant
    if (!data.montant || isNaN(data.montant) || data.montant <= 0) {
      errors.montant = "Le montant doit être un nombre positif";
    }
  
    // Vérifier le type de transaction
    const validTypes = ['paiement', 'remboursement'];
    if (!data.type || !validTypes.includes(data.type)) {
      errors.type = "Le type de transaction doit être 'paiement' ou 'remboursement'";
    }
  
    // Vérifier le statut de la transaction
    const validStatuses = ['complet', 'en attente', 'échoué'];
    if (!data.statut || !validStatuses.includes(data.statut)) {
      errors.statut = "Le statut doit être 'complet', 'en attente' ou 'échoué'";
    }
  
    return errors;
  };
  