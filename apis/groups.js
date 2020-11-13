const router = require('express').Router();
const Group = require('../models/Group');

router.post('/api/addgroup', async (req, res) => 
{
    // incoming: GroupName, UserIds (array)
    // outgoing: error
    try 
    {
        const errors = {};
		let { groupname, userids, endtime } = req.body;

		const nameConflict = await Group.findOne({ Name: groupname });
		if (nameConflict) return res.status(400).json({ errors: 'group name already taken' });

		const newGroup = new Group({
			Name: groupname,
			Users: userids,
        });
        
        const group = await newGroup.save();
        return res.status(200).json('successfully added group');
    } 
    catch (error) 
    {
		console.error(error);
		return res.status(500).json('internal server error');
	}
});

router.post('api/deletegroup', async (req, res) =>
{
    // incoming: id
    // outgoing: error
    try
    {
        const group = Group.findById(req.body.id);
		if (!group) return res.status(400).json('group does not exist');
        
        await Group.deleteOne( { _id: req.body.id }, function (err) {
            if (err)  console.error(err); return res.status(401).json(err);
        });
        
		return res.status(200).json('successfully removed event');
    }
    catch (error) 
    {
		console.error(error);
		return res.status(500).json('internal server error');
	}
});

module.exports = router;