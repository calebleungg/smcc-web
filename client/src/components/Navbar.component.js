import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import schoolLogo from '../assets/images/smcc-logo.jpg'
import avatar from '../assets/images/default-pic.png'
import axios from 'axios'

export default class Navbar extends Component {

    state = {
       isLoggedIn: false,
       user: {}
    }

    componentDidMount() {
        axios.get('/api/auth/user')
            .then(response => {
                console.log(response.data)
                if(response.data.user) {
                    this.setState({
                        isLoggedIn: true,
                        user: response.data.user
                    })
                }
            })
            .catch(err => console.log(err))
    }

    handleLogout = () => {
        axios.get('/api/auth/logout')
            .then(response => {
                console.log(response)
                window.location.reload(false)
                this.setState({
                    isLoggedIn: false,
                    user: {}
                })
            })
    }

    render(){

        return (
            <nav id="top-navigation-bar">
                <Link to="/"><img src={schoolLogo} alt="smcc lgoo" id="home-btn"></img></Link> 
                <div>
                    <Link to="/"> <button>Contact Us </button> </Link> 
                    <Link to="/request"> <button>Member Application </button></Link>
                    {
                        this.state.user.role === 'admin' ? 
                            <Link to="/admin"> <button id="admin-btn"> Admin </button> </Link>
                            :
                            null
                    }
                    {
                        this.state.isLoggedIn ? 
                            <Link to="/"> <button onClick={this.handleLogout} id="auth-btn"> Log out </button> </Link> 
                            :
                            <Link to="/login"> <button id="auth-btn">Login </button> </Link>
                    }
                    {
                        this.state.isLoggedIn ? 
                            <Link to="/"> <button id="profile-btn"> <img src={avatar} ></img> </button> </Link> 
                            :
                            null
                    }
                </div>
            </nav>
        )
    }
} 