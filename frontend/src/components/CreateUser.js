import React, {useState} from 'react';

function CreateUser()
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

    var username;
    var password;
    var fname;
    var lname;
    const [message,setMessage] = useState('');

    const createUser = async event => 
    {
        event.preventDefault();
        
        var obj = {login:username.value,password:password.value,fname:fname.value,lname:lname.value}
        var js = JSON.stringify(obj);

        try
        {
            const response = await fetch(buildPath('api/createUser'),
            {method:'POST',body:js,headers:{'Content-Type':'application/json'}});
            var txt = await response.text();
            var res = JSON.parse(txt);

            if(res.error.length > 0)
            {
                setMessage("API Error:" + res.error);
            }
            else
            {
                setMessage('User has been added');
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
            <span id ="inner-title">Create a User</span><br />
            <input type="text" id="fname" placeholder="First Name" ref={(c) => fname = c} /><br />
            <input type="text" id="lname" placeholder="Last Name" ref={(c) => lname = c} /><br />
            <input type="text" id="username" placeholder="Username To Add" ref={(c) => username = c} /><br />
            <input type="password" id="password" placeholder="Password" ref={(c) => password = c} /><br />
            <button type="button" id="createUserButton" class="buttons" onClick={createUser}> Create User </button><br />
            <span id="userAddResult">{message}</span>
        </div>
    );
};

export default CreateUser;