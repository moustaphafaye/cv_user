const User = require('../models/user');

exports.createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    const saved = await newUser.save();
    res.status(201).json({ message: "Utilisateur créé avec succès", user: saved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
///fonction pour ajouter une formation
exports.addFormation = async (req, res) => {
  const userId = req.params.id;
  const newFormation = req.body.formation;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { formations: newFormation } },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.status(200).json({ message: "Formation ajoutée avec succès", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

///fonction pour ajouter une experience
exports.addExperience = async (req, res) => {
  const userId = req.params.id;
  const newExperience = req.body.experience;

  console.log("Nouvelle expérience reçue :", newExperience);

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { experiences: newExperience } },
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    res.status(200).json({ message: "Expérience ajoutée avec succès", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Ajouter une langue dans le cv
exports.addLangue = async (req, res) => {
  const userId = req.params.id;
  const newLangue = req.body.langue;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { langues: newLangue } },
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    res.status(200).json({ message: "Langue ajoutée avec succès", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//fonction Ajouter une compétence
exports.addCompetence = async (req, res) => {
  const userId = req.params.id;
  const newCompetence = req.body.competence;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { competences: newCompetence } },
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    res.status(200).json({ message: "Compétence ajoutée avec succès", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//notre fonction Ajouter un loisir
exports.addLoisir = async (req, res) => {
  const userId = req.params.id;
  const newLoisir = req.body.loisir;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { loisirs: newLoisir } },
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    res.status(200).json({ message: "Loisir ajouté avec succès", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// exports.searchUser = async (req, res) => {
//   let user = await User.find();
//   res.send(user)
//   // res.status(200).json({ user });
// }
exports.searchUser = async (req, res) => {
  const query = req.params.key;

  try {
    let  user = await User.findOne({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        // { telephone: { $regex: query, $options: 'i' } }
      ]
    });

    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
