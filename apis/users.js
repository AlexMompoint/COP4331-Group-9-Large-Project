const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = require('express').Router();
const sendVerificationMail = require('../utils/mail');
const { createLoginToken } = require('../utils/jwt');

router.post('/createUser', async (req, res) => {
	try {
		const errors = {};
		let { username, password, email, confirmPassword, fname, lname } = req.body;

		const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		if (password !== confirmPassword) errors.password = 'passwords must match';
		if (!regex.test(email)) errors.email = 'please provide a valid email';

		if (Object.keys(errors).length !== 0) return res.status(400).json(errors);
		const mailExists = await User.findOne({ Email: email });
		if (mailExists) return res.status.json({ errors: 'email already in use' });

		const usernameExists = await User.findOne({ Username: username });
		if (usernameExists)
			return res.status(400).json({ errors: 'username is already taken' });

		password = await bcrypt.hash(password, 12);
		const newUser = new User({
			Username: username,
			Password: password,
			Email: email,
			FirstName: fname,
			LastName: lname,
			isVerified: false,
		});
		const user = await newUser.save();
		await sendVerificationMail(email, user._id);
		return res.status(201).json('Verify Email to Begin');
	} catch (error) {
		console.error(error);
		return res.status(500).json('internal server error');
	}
});

router.post('/login', async (req, res) => {
	const { username, password } = req.body;
	try {
		const user = await User.findOne({ Username: username });
		if (user) {
			if (!user.isVerified)
				return res.status(400).json('please confirm your email');
			const match = await bcrypt.compare(password, user.Password);
			if (!match) return res.status(400).json('wrong credentials');
			const token = createLoginToken(user._id, user.Username);
			const payload = {
				token,
				username,
				fname: user.FirstName,
				lname: user.LastName,
			};
			return res.status(200).json(payload);
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json('internal server error');
	}
});

module.exports = router;
