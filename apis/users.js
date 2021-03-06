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

		if (Object.keys(errors).length !== 0) return res.json({errors});
		const mailExists = await User.findOne({ Email: email });
		if (mailExists) return res.json({ errors: 'email already in use' });

		const usernameExists = await User.findOne({ Username: username });
		if (usernameExists)
			return res.json({ errors: 'username is already taken' });

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
		return res.json({ message: 'Verify Email to Begin' });
	} catch (error) {
		console.error(error);
		return res.json({ errors: error });
	}
});

router.post('/login', async (req, res) => {
	console.log('logging in');
	const { username, password } = req.body;
	try {
		const user = await User.findOne({ Username: username });
		if (user) {
			if (!user.isVerified)
				return res.json({ errors: 'please confirm your email' });
			const match = await bcrypt.compare(password, user.Password);
			if (!match) return res.json({ errors: 'wrong credentials' });
			const token = createLoginToken(user._id, user.Username);
			const payload = {
				token,
				username,
				fname: user.FirstName,
				lname: user.LastName,
				friends: user.Friends,
			};
			return res.json(payload);
		} else {
			return res.json({ errors: 'username does not exist' });
		}
	} catch (error) {
		console.error(error);
		return res.json({ errors: error });
	}
});

router.post('/friendrequest', auth, async (req, res) => {
	try {
		const { username } = req.body.username;
		const friend = User.findOne({ Username: username });
		if (!friend) return res.json('this user does not exists');
		const user = User.findById(req.user.id);
		if (!user) return res.json({errors: 'you are not a valid user'});
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
		return res.json({
			id: friend._id,
			username: friend.Username,
			pending: true,
		});
	} catch (error) {
		console.error(error);
		return res.json({errors: error});
	}
});

router.post('/addfriend', async (req, res) => {
	try {
		const friend = User.findById(req.body.id);
		if (!friend) return res.json('friend does not exist');
		const user = User.findById(req.user.id);
		if (!user) return res.json('you are not a valid user');
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
		return res.json({message: 'successfully added friend'});
	} catch (error) {
		console.error(error);
		return res.json({errors: error});
	}
});

router.delete('/deletefriend', async (req, res) => {
	try {
		const friend = User.findById(req.body.id);
		if (!friend) return res.json({errors: 'friend does not exist'});
		const user = User.findById(req.user.id);
		if (!user) return res.json({errors: 'you are not a valid user'});
		user.Friends = user.Friends.filter((request) => request.id !== req.body.id);
		friend.Friends = friend.Friends.filter(
			(request) => request.id !== req.user.id
		);
		await user.save();
		await friend.save();
		return res.json({message: 'successfully removed friend'});
	} catch (error) {
		console.error(error);
		return res.json({errors: error});
	}
});
module.exports = router;
