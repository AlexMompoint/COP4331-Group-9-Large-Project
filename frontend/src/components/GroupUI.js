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

    const [message,setMessage] = useState('');

    var _gd = localStorage.getItem('group_data');
    var gd = JSON.parse(_gd);
    var groupname = gd.groupname;
    var id = gd.id;

    const deleteGroup = async event => 
    {
        event.preventDefault();

        var obj = { id:id };
        var js = JSON.stringify(obj);
        
        try
        {
            const response = await fetch(buildPath('api/deletegroup'),
            {method:'POST',body:js,headers:{'Content-Type':'application/json'}});
            var txt = await response.text();
            var res = JSON.parse(txt);

            if(res.error.length > 0)
            {
                setMessage("API Error:" + res.error);
            }
            else
            {
                localStorage.removeItem("group_data");
                window.location.href = '/groups';
                setMessage('Group has been removed');
            }
        }
        catch(e)
        {
            setMessage(e.toString());
        }
    };

    return(
        <div id="accessUIDiv">
            <span id="groupName"> {groupname} </span><br />
            <form onSumbit={deleteGroup}>
                <button type="button" id="addGroupButton" class="buttons" onClick={deleteGroup}> Delete Group </button><br />
            </form>            
            <span id="groupCreateResult">{message}</span>
        </div>
    );
}

export default GroupUI;