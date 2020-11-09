const { connect } = require('mongoose');

async function connectDB() {
	try {
		await connect(process.env.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('connected to db...');
	} catch (error) {
		console.error(error);
		exit(1);
	}
}

module.exports = connectDB;
