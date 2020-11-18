const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = require('express').Router();
const sendVerificationMail = require('../utils/mail');
const { createLoginToken } = require('../utils/jwt');
const auth = require('../utils/auth');

router.post('/createUser', async (req, res) => {
	try {
		const errors = {};
		let { username, password, email, confirmPassword, fname, lname } = req.body;

		const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		if (password !== confirmPassword) errors.password = 'passwords must match';
		if (!regex.test(email)) errors.email = 'please provide a valid email';

		if (Object.keys(errors).length !== 0) return res.status(400).json(errors);
		const mailExists = await User.findOne({ Email: email });
		if (mailExists) return res.status(400).json({ errors: 'email already in use' });

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
			Friends: [],
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
				friends: user.Friends,
			};
			return res.status(200).json(payload);
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json('internal server error');
	}
});

router.post('/friendrequest', auth, async (req, res) => {
	try {
		const { username } = req.body.username;
		const friend = User.findOne({ Username: username });
		if (!friend) return res.status(400).json('this user does not exists');
		const user = User.findById(req.user.id);
		if (!user) return res.status(400).json('you are not a valid user');
		user.Friends.push({
			id: friend._id,
			Username: friend.Username,
			pending: true,
		});
		friend.Friends.push({
			id: req.user.id,
			Username: req.user.username,
			pending: true,
		});
		await user.save();
		await friend.save();
		return res.status.json({
			id: friend._id,
			username: friend.Username,
			pending: true,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json('internal server error');
	}
});

router.post('/addfriend', async (req, res) => {
	try {
		const friend = User.findById(req.body.id);
		if (!friend) return res.status(400).json('friend does not exist');
		const user = User.findById(req.user.id);
		if (!user) return res.status(400).json('you are not a valid user');
		user.Friends = user.Friends.filter((request) => {
			if (request.id === req.body.id) request.pending = false;
			return request;
		});
		friend.Friends = friend.Friends.filter((request) => {
			if (request.id === req.user.id) request.pending = false;
			return request;
		});
		await user.save();
		await friend.save();
		return res.status(200).json('successfully added friend');
	} catch (error) {
		console.error(error);
		return res.status(500).json('internal server error');
	}
});

router.delete('/deletefriend', async (req, res) => {
	try {
		const friend = User.findById(req.body.id);
		if (!friend) return res.status(400).json('friend does not exist');
		const user = User.findById(req.user.id);
		if (!user) return res.status(400).json('you are not a valid user');
		user.Friends = user.Friends.filter((request) => request.id !== req.body.id);
		friend.Friends = friend.Friends.filter(
			(request) => request.id !== req.user.id
		);
		await user.save();
		await friend.save();
		return res.status(200).json('successfully removed friend');
	} catch (error) {
		console.error(error);
		return res.status(500).json('internal server error');
	}
});
module.exports = router;
