const { Int32 } = require('mongodb');
const { model, Schema } = require('mongoose');

const eventSchema = new Schema({
	UserId: Int32,
	StartTime: String,
    EndTime: String,
    Days: String,
	Group: String,
	// Friends: [{ id: String, Username: String, pending: Boolean }],
});

const Event = model('event', eventSchema);

module.exports = Event;
