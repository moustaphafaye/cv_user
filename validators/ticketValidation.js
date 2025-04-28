exports.validateTicketData = (data) => {
    const errors = [];
  
    if (!data.sujet) {
      errors.push('Le sujet est requis.');
    }
  
    if (!data.nom_complet) {
      errors.push('Le nom complet est requis.');
    }
  
    if (!data.priorite) {
      errors.push('La priorité est requise.');
    } else if (!['basse', 'moyenne', 'haute'].includes(data.priorite)) {
      errors.push('La priorité doit être soit basse, moyenne ou haute.');
    }
  
    if (!data.description) {
      errors.push('La description est requise.');
    }
  
    return errors;
  };
  