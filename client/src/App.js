import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Navbar from './components/Navbar.component'
import LandingPage from './components/LandingPage.component'
import UploadPhoto from './components/UploadPhoto.component'

import './App.scss'

function App() {
	return (
		<Router>
			<Navbar />
			<Route path="/" exact component={LandingPage} />
			<Route path="/upload" exact component={UploadPhoto} />
		</Router>
	);
}

export default App;
