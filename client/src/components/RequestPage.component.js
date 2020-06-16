import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import schoolLogo from '../assets/images/smcc-logo.jpg'
import axios from 'axios'

export default class RequestPage extends Component {

    state = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        yearGraduated: '',
        country: '',
        address: '',
        passwordPref: '',
        flash: null
    }

    componentDidUpdate() {
        if (this.state.flash && this.state.flash.success) {
            setTimeout(() => {
                this.setState({
                    flash: null
                })
            }, 3000)
        }
    }

    handleChange = (event) => {
        const { name, value } = event.target
        this.setState({
            [name]: value
        })
    }

    onSubmit = () => {

        if (Object.values(this.state).includes('')) {
            return this.setState({
                flash: {
                    success: false,
                    message: "Please fill out all fields"
                }
            })
        }
        
        
        axios.post('/api/requests/create', this.state)
            .then(response => {
                console.log(response)
                this.setState({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    yearGraduated: '',
                    country: '',
                    address: '',
                    passwordPref: '',
                    flash: {
                        success: true,
                        message: "You request has been made. Thank you very much!"
                    }
                })
            })
            .catch(err => {
                console.log(err)
                this.setState({
                    flash: {
                        success: false,
                        message: "There was an error making your request. Please fill out all fields and try again"
                    }
                })
            })
    }

  
    render(){

        if (this.state.flash && this.state.flash.success) {
            return (
                <div id="request-page-container">
                    <div style={{color:"#1DB954", fontSize: "1.3em", fontWeight: "600", textAlign: "center"}}>
                        <span>You request has been made. Thank you very much! </span><br/><br/>
                        <span>We will be in touch shortly </span>
                    </div>
                </div>
            )
        }

        return (
            <div id="request-page-container">
                <div id="request-instructions">
                    <p> Member Application </p>
                    <span>SMCC is a private group run by the students of the class. If you were in this SMCC Cohort please fill this application out.</span> 
                    <br/><br/><span>The current admin of the website is Ken Leung. Once a request has been verified, you will be notified.</span>
                    <br/><br/><span>If you have any questions please visit the Contact page.</span>
                </div>
                <div id="request-form">
                    <span> First name </span><br/>
                    <input 
                        type="text"
                        name="firstName"
                        value={this.state.firstName}
                        placeholder="Enter first name"
                        onChange={this.handleChange}
                        required="true"
                    /><br/>
                    <span> Last name </span><br/>
                    <input 
                        type="text"
                        name="lastName"
                        value={this.state.lastName}
                        placeholder="Enter last name"
                        onChange={this.handleChange}
                        required="true"
                    /><br/>
                    <span> Email </span><br/>
                    <input 
                        type="email"
                        name="email"
                        value={this.state.email}
                        placeholder="Enter email"
                        onChange={this.handleChange}
                        required="true"
                    /><br/>
                    <span> Phone </span><br/>
                    <input 
                        type="text"
                        name="phone"
                        value={this.state.phone}
                        placeholder="Enter phone number"
                        onChange={this.handleChange}
                    /><br/>
                    <span> Year Graduated </span><br/>
                    <input 
                        type="text"
                        name="yearGraduated"
                        value={this.state.yearGraduated}
                        placeholder="What year did you graduate?"
                        onChange={this.handleChange}
                    /><br/>
                    <span> Country </span><br/>
                    <input 
                        type="text"
                        name="country"
                        value={this.state.country}
                        placeholder="Enter country of residence"
                        onChange={this.handleChange}
                    /><br/>
                    <span> Address </span><br/>
                    <input 
                        type="text"
                        name="address"
                        value={this.state.address}
                        placeholder="Enter address"
                        onChange={this.handleChange}
                    /><br/>
                    <span> Preferred password </span><br/>
                    <input 
                        type="text"
                        name="passwordPref"
                        value={this.state.passwordPref}
                        placeholder="Enter a password you'd like to use for your account"
                        onChange={this.handleChange}
                    /><br/>
                    <button onClick={this.onSubmit}> Submit Request </button><br/>
                    <span style={this.state.flash ? this.state.flash.success ? {color:"#1DB954"} : {color: "red"} : null} > {this.state.flash ? this.state.flash.message : null } </span>
                </div>
            </div>
        )
    }
} 