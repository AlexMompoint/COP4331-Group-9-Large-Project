import React from 'react';

function GroupName()
{
    var _gd = localStorage.getItem('group_data');
    var gd = JSON.parse(_gd);
    var groupname = gd.groupname;
    var users = gd.users;

    const goHome = event =>
    {
        event.preventDefault();
        localStorage.removeItem("group_data")
        window.location.href = '/userpage';
    };

    return(
        <div id="groupNameDiv">
            <span id="groupName">Group: {groupname}</span><br />
            <button type="button" id="goHomeButton" class="buttons" onClick={goHome}> Go Back to User Page </button>
        </div>
    );
};

export default GroupName;