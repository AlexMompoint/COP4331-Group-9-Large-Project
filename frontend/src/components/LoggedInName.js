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
         <div id="loginDiv">
            <form onSubmit={doLogin}>
                <span id ="inner-title">Please Login!</span><br />
                <input type="text" id="loginName" placeholder="Username" ref={ (c) => loginName = c} /><br />
                <input type="password" id="loginPassword" placeholder="Password" ref={ (c) => loginPassword = c} /><br />
                <input type="submit" id="loginButton" class="buttons" value="Login" onClick={doLogin} />
            </form>
            <span id="loginResult">{message}</span>
        </div>
    );
};

export default LoggedInName;
