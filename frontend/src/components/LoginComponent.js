import React from 'react';

import '../css/Login.css';
export default function LoginComponent() {
	return (
		<div className="wrapper">
			<div className="container">
				<h1>Login</h1>
				<input placeholder="username" type="text" />
				<input placeholder="password" type="password" />
			</div>
		</div>
	);
}
