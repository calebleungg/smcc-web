import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import schoolLogo from '../assets/images/smcc-logo.jpg'

export default class Navbar extends Component {

    state = {
       
    }

    render(){

        return (
            <nav id="top-navigation-bar">
                <Link to="/"><img src={schoolLogo} alt="smcc lgoo" id="home-btn"></img></Link> 
                <div>
                    <Link to="/upload"> <button> Upload </button> </Link> 
                    <button>Contact Us </button>
                    <button>Member Application </button>
                    <button>Login </button>
                </div>
            </nav>
        )
    }
} 