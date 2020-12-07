const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
	nom: { type: String, required: true, unique: false },
	prenom: { type: String, required: true, unique: false },
    email: { type: String, required: true, unique: true },
    role : { type: String, required: true, unique: false },
  	password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
