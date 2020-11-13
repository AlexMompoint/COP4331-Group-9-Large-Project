import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Redirect,
	Switch,
} from 'react-router-dom';
import './App.css';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
//import LoginComponent from './components/LoginComponent';
//import Login from './components/Login';
function App() {
	return (
		 <Router >
		   <Switch>
		     <Route path="/" exact>
		       <LoginPage />
		     </Route>
		     <Route path="/scheduler" exact>
		       <HomePage />
		     </Route>
		     <Redirect to="/" />
		   </Switch>
		 </Router>
		//<LoginComponent />
	);
}

export default App;
