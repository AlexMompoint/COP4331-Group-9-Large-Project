import React, { useState, useEffect } from 'react';

function LoggedInName() {
	const [user, setUser] = useState({});
	useEffect(() => {
		const fname = localStorage.getItem('fname');
		const lname = localStorage.getItem('lname');
		const token = localStorage.getItem('token');
		const username = localStorage.getItem('username');
		setUser({ firstName: fname, lastName: lname, token, username });
	}, []);

	const doLogout = (event) => {
		event.preventDefault();
		localStorage.removeItem('fname');
		localStorage.removeItem('lname');
		localStorage.removeItem('token');
		localStorage.removeItem('username');
		setUser(null);
		window.location.href = '/';
	};

	return (
		<div id="logoutDiv">
			<span id="userName">
				Logged In As {user.firstName} {user.lastName}{' '}
			</span>
			<br />
			<input
				type="submit"
				id="logoutButton"
				class="buttons"
				value="Logout"
				onClick={doLogout}
			/>
		</div>
	);
}

export default LoggedInName;
