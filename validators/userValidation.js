exports.validateUserData = (data) => {
  const errors = {};

  if (!data.userType) {
    errors["userType"] = "Le type d'utilisateur est requis.";
  } else if (!['client', 'prestataire'].includes(data.userType)) {
    errors["userType"] = "Le type d'utilisateur doit être 'client' ou 'prestataire'.";
  }

  if (!data.password) {
    errors["password"] = "Le mot de passe est requis.";
  }

  if (data.userType === 'client') {
    if (!data.tel) {
      errors["tel"] = "Le numéro de téléphone est requis pour un client.";
    }
  }

  if (data.userType === 'prestataire') {
    if (!data.info_person) {
      errors["info_person"] = "Les informations personnelles sont requises pour un prestataire.";
    } else {
      if (!data.info_person.prenom) {
        errors["info_person.prenom"] = "Le prénom est requis pour un prestataire.";
      }
      if (!data.info_person.nom) {
        errors["info_person.nom"] = "Le nom est requis pour un prestataire.";
      }
      if (!data.info_person.email) {
        errors["info_person.email"] = "L'email est requis pour un prestataire.";
      }
      if (!data.info_person.tel) {
        errors["info_person.tel"] = "Le téléphone est requis pour un prestataire.";
      }
      if (!data.info_person.addresse) {
        errors["info_person.addresse"] = "L'adresse est requise pour un prestataire.";
      }
    }

    if (!data.experience) {
      errors["experience"] = "L'expérience est requise pour un prestataire.";
    } else {
      if (typeof data.experience.annee !== 'number') {
        errors["experience.annee"] = "Le nombre d'années d'expérience est requis.";
      }
      if (!data.experience.tarif && data.experience.tarif !== 0) {
        errors["experience.tarif"] = "Le tarif est requis pour un prestataire.";
      }
    }
  }

  return errors;
};
