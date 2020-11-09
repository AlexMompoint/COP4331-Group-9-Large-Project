const { model, Schema } = require('mongoose');

const userSchema = new Schema({
	Username: String,
	Password: String,
	Email: String,
	FirstName: String,
	LastName: String,
	isVerified: Boolean,
});

const User = model('user', userSchema);

module.exports = User;
