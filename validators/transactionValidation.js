exports.validateTransactionData = (data) => {
  const errors = {};

  // Vérification du client
  if (!data.client || data.client.trim() === '') {
    errors.client = "Le nom du client est requis";
  }

  // Vérification du montant
  if (!data.amount || isNaN(data.amount) || data.amount <= 0) {
    errors.amount = "Le montant doit être un nombre positif";
  }

  // Vérification du type
  const validTypes = ['payment_link', 'payment', 'remboursement'];
  if (!data.type || !validTypes.includes(data.type)) {
    errors.type = "Le type doit être 'payment_link', 'payment' ou 'remboursement'";
  }

  // Vérification du status
  const validStatus = ['complet', 'en attente', 'échoué'];
  if (!data.status || !validStatus.includes(data.status)) {
    errors.status = "Le status doit être 'complet', 'en attente' ou 'échoué'";
  }

  // Vérification du téléphone
  if (!data.phone || data.phone.trim() === '') {
    errors.phone = "Le numéro de téléphone est requis";
  }

  return errors;
};
