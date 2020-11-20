import React from 'react';

function LoggedInName()
{
    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    // var userId = ud.id;
    var firstName = ud.firstName;
    var lastName = ud.lastName;

    const doLogout = event =>
    {
        event.preventDefault();
        localStorage.removeItem("user_data")
        window.location.href = '/';
    };

    return(
         <div id="logoutDiv">
            <form onSubmit={doLogout}>
                <input type="submit" id="logoutButton" class="buttons" value="Logout" onClick={doLogout} />
            </form>
        </div>
    );
};

export default LoggedInName;
