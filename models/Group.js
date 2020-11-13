const { model, Schema } = require('mongoose');

const groupSchema = new Schema({
    Name: String,
	Users: [Number],
});

const Group = model('group', groupSchema);

module.exports = Group;