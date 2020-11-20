import React, {useState} from 'react';

function GroupAdd()
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

    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    var groupname;
    var users = ud.id;

    const createGroup = async event => 
    {
        event.preventDefault();

        var obj = { groupname:groupname.value, userids:users };
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
                window.location.href = '/groups';
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
            <form onSumbit={createGroup}>
                <input type="text" id="groupText" placeholder="Group Name" ref={ (c) => groupname = c} />
                <button type="button" id="addGroupButton" class="buttons" onClick={createGroup}> Create Group </button><br />
            </form>            
            <span id="groupCreateResult">{message}</span>
        </div>
    );
}

export default GroupAdd;