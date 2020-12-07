const mongoose = require('mongoose');

const User = require('./models/users');

const materielTemplate = mongoose.Schema({
  nom: { type: String, required: true },
  version: { type: String, required: true },
  ref: { type: String, required: true },
  imageUrl: { type: String, required: false },
  dateDepart: { type: Date, required: false },
  dateRetour: { type: Date, required: false },
  emprunteur: { type: User, required: false },
});

module.exports = mongoose.model('materiel', materielTemplate);