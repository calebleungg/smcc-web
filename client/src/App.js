import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Navbar from './components/Navbar.component'
import LandingPage from './components/LandingPage.component'
import UploadPhoto from './components/UploadPhoto.component'
import LoginPage from './components/LoginPage.component'
import AdminDashboard from './components/AdminDashboard.component'
import RequestPage from './components/RequestPage.component'
import ProfilePage from './components/ProfilePage.component'
import MemberPage from './components/MemberPage.component'

import './App.scss'

function App() {
	return (
		<Router>
			<Navbar />
			<Route path="/" exact component={LandingPage} />
			<Route path="/upload" exact component={UploadPhoto} />
			<Route path="/login" exact component={LoginPage} />
			<Route path="/admin" exact component={AdminDashboard} />
			<Route path="/request" exact component={RequestPage} />
			<Route path="/profile" exact component={ProfilePage} />
			<Route path="/member" exact component={MemberPage} />
		</Router>
	);
}

export default App;
