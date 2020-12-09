const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

var validateEmail = function(email) {
    var re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return re.test(email)
};

const userSchema = mongoose.Schema({
	nom: { type: String, required: true, unique: false },
	prenom: { type: String, required: true, unique: false },
    email: { 
    	type: String, 
    	required: true, 
    	unique: true,
    	validate: [validateEmail, 'Invalid email'],
        match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/, 'Please fill a valid email address'] 
    },
    role : { type: String, required: true, unique: false },
  	password: { type: String, required: true }
});




userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
