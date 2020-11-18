import React, {useState} from 'react';

function GroupUI()
{
    const app_name = 'group9-meetingscheduler'
    function buildPath(route)
    {
        if (process.env.NODE_ENV === 'production') 
        {
            return 'https://' + app_name +  '.herokuapp.com/' + route;
        }
        else
        {        
            return 'http://localhost:5000/' + route;
        }
    }

    var event = '';
    const [message,setMessage] = useState('');

    var _gd = localStorage.getItem('group_data');
    var gd = JSON.parse(_gd);
    var groupname = gd.groupname;
    var users = gd.users;

    const createGroup = async event => 
    {
        event.preventDefault();

        var obj = { groupname:groupname, userids:users };
        var js = JSON.stringify(obj);
        
        try
        {
            const response = await fetch(buildPath('api/addgroup'),
            {method:'POST',body:js,headers:{'Content-Type':'application/json'}});
            var txt = await response.text();
            var res = JSON.parse(txt);

            if(res.error.length > 0)
            {
                setMessage("API Error:" + res.error);
            }
            else
            {
                setMessage('Group has been added');
            }
        }
        catch(e)
        {
            setMessage(e.toString());
        }
    };

    return(
        <div id="accessUIDiv">
            <br />
            <input type="text" id="groupText" placeholder="Group Name" ref={ (c) => groupname = c} />
            <button type="button" id="addGroupButton" class="buttons" onClick={createGroup}> Create Group </button><br />
            <span id="groupCreateResult">{message}</span>
        </div>
    );
}

export default GroupUI;