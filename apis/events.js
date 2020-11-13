const router = require('express').Router();
const Event = require('../models/Event');

router.post('/api/addevent', async (req, res) => 
{
    // incoming: UserId, StartTime, EndTime, Days, Group
    // outgoing: error
    try 
    {
        const errors = {};
		let { userid, starttime, endtime, days, group } = req.body;

		// const timeConflict = await Event.     TODO somehow check for conflicting time events here?
		if (timeConflict) return res.status(400).json({ errors: 'time slot already busy' });

		const newEvent = new Event({
			UserId: userid,
			StartTime: starttime,
			EndTime: endtime,
			Days: days,
			Group: group,
        });
        
        const event = await newEvent.save();
        return res.status(200).json('successfully added event');
    } 
    catch (error) 
    {
		console.error(error);
		return res.status(500).json('internal server error');
	}
});

router.post('api/deleteevent', async (req, res) =>
{
    // incoming: eventId
    // outgoing: error
    try
    {
        const event = Event.findById(req.body.id);
		if (!event) return res.status(400).json('event does not exist');
        
        await Event.deleteOne( { _id: req.body.id }, function (err) {
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

router.post('api/editevent', async (req, res) =>
{
    // incoming: eventId, newStartTime, newEndTime
    // outgoing: error
    try
    {
        let { id, newstarttime, newendtime }
        const event = Event.findById(id);
        if (!event) return res.status(400).json('event does not exist');

        event.StartTime = newstarttime;
        event.EndTime = newendtime;
        await event.save();

        return res.status(200).json('successfully changed event times');
    }
    catch (error)
    {
        console.error(error);
        return res.status(500).json('internal server error');
    }

});

module.exports = router;
