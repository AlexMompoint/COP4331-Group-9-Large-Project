import React, { useState } from 'react';
import axios from 'axios';
function Login() {
	const app_name = 'group9-meetingscheduler';
	function buildPath(route) {
		if (process.env.NODE_ENV === 'production') {
			return 'https://' + app_name + '.herokuapp.com/' + route;
		} else {
			return 'http://localhost:5000/' + route;
		}
	}

	var loginName;
	var loginPassword;
	const [message, setMessage] = useState('');

	const doLogin = async (event) => {
		event.preventDefault();
		try {
			const username = loginName.value;
			const password = loginPassword.value;
			const payload = { username, password };
			console.log(username);
			console.log(password);

			const url = buildPath('api/login');
			const response = await axios.post(url, payload);
			if (response.data.error) {
				setMessage(response.error);
			} else {
				const { fname, lname, token, username } = response.data;
				localStorage.setItem('fname', fname);
				localStorage.setItem('lname', lname);
				localStorage.setItem('token', token);
				localStorage.setItem('username', username);
				setMessage('');
				window.location.href = '/userpage';
			}
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<div id="loginDiv">
			<form onSubmit={doLogin}>
				<span id="inner-title">Please Login!</span>
				<br />
				<input
					type="text"
					id="loginName"
					placeholder="Username"
					ref={(c) => (loginName = c)}
				/>
				<br />
				<input
					type="password"
					id="loginPassword"
					placeholder="Password"
					ref={(c) => (loginPassword = c)}
				/>
				<br />
				<input
					type="submit"
					id="loginButton"
					class="buttons"
					value="Login"
					onClick={doLogin}
				/>
			</form>
			<span id="loginResult">{message}</span>
		</div>
	);
}

export default Login;
