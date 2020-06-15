import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import schoolLogo from '../assets/images/smcc-logo.jpg'
import Axios from 'axios'

export default class LoginPage extends Component {

    state = {
       email: '',
       password: '',
       redirectHome: false,
       error: ''
    }

    handleChange = (event) => {
        const { name, value } = event.target
        this.setState({
            [name]: value
        })
    }
    
    onSubmit = () => {
        const auth = {
            username: this.state.email,
            password: this.state.password
        }
        console.log(auth)
        Axios.post('/api/auth/login', auth)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        redirectHome: true
                    })
                    window.location.reload(false)
                } 
            })
            .catch(err => {
                console.log(err)
                this.setState({
                    error: "Invalid email or password"
                })
            })
    }

    handleEnter = (event) => {
        if(event.key === "Enter") {
            this.onSubmit()
        }
    }

    render(){

        if(this.state.redirectHome) {
            return <Redirect to="/" />
        }

        return (
            <div id="login-page-container">
                <img src={schoolLogo}></img>
                <div>
                    <h2> Log In </h2>
                    <input 
                        type="text" 
                        placeholder="Email" 
                        name="email" 
                        value={this.state.email} 
                        onChange={this.handleChange} 
                    /> <br/>
                    <input 
                        type="password" 
                        placeholder="Password" 
                        name="password" 
                        value={this.state.password} 
                        onChange={this.handleChange}
                        onKeyPress={this.handleEnter}
                    /> <br/>
                    <button onClick={this.onSubmit}> Sign in </button>
                    <span> {this.state.error} </span>
                </div>
            </div>
        )
    }
} 