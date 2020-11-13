const { model, Schema } = require('mongoose');

const eventSchema = new Schema({
	UserId: Number,
	StartTime: String,
    EndTime: String,
    Days: String,
	Group: String,
});

const Event = model('event', eventSchema);

module.exports = Event;
