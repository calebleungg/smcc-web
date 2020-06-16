import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'

export default class DashboardMembers extends Component {

    state = {
        viewPending: true,
        viewCurrent: false,
        pending: [],
        userList: [],
        userViewing: null,
        updateList: false
    }

    componentDidUpdate() {

        if(this.state.updateList) {
            this.getApiUsers()
            this.setState({
                updateList: false
            })
        }

        if (!this.state.viewCurrent && !this.state.viewPending) {
            this.setState({
                viewPending: true
            })
        }
    }

    componentDidMount() {
        this.getApiUsers()
    }

    getApiUsers = () => {
        axios.get('/api/requests')
            .then(response => {
                this.setState({
                    pending: response.data
                })
            })
            .catch(err => console.log(err))

        axios.get('/api/users')
            .then(response => {
                this.setState({
                    userList: response.data
                })
            })
            .catch(err => console.log(err))
    }

    renderPending = (category) => {
        let output = []
        if (this.state[category].length === 0 && category === 'pending') {
            return (
                <p id="no-requests"> No new requests </p>
            )
        }
        this.state[category].map( request => {
            output.push(
                <div id="pending-item" onClick={() => {this.setState({userViewing: request})}}>
                    <span id="request-name"> {request.firstName} {request.lastName} </span><br/>
                    <span id="request-country"> {request.country} </span><br/>
                    <span id="request-email"> {request.email} </span><br/>
                </div>
            )
        })
        return output
    }

    handleChange = (event ) => {
        const { name, value } = event.target
        let user = this.state.userViewing
        user[name] = value
        this.setState({
            userViewing: user
        })
    }

    handleSelect = (event) => {
        const { name } = event.target
        this.setState({
            viewPending: false,
            viewCurrent: false,
        })
        this.setState({
            [name]: true
        })
    }

    handleApprove = () => {
        console.log(this.state.userViewing)
        const { firstName, lastName, email, phone, yearGraduated, country, address, passwordPref, _id } = this.state.userViewing
        const req = {
            requestId: _id,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            yearGraduated: yearGraduated,
            country: country,
            address: address,
            password: passwordPref
        }
        console.log(req)
        axios.post('/api/auth/register', req)
            .then(response => {
                console.log(response)
                this.setState({
                    updateList: true
                })
            })
            .then(err => console.log(err))
    }

    handleDecline = (id) => {
        console.log(id)
        axios.delete(`/api/requests/delete/${id}`)
            .then(response => {
                console.log(response)
                this.setState({
                    updateList: true
                })
            })
            .catch(err => console.log(err))
    }

    renderUserDetails = () => {
        const list = this.state.viewPending ? this.state.pending : this.state.userList
        for (let user of list) {
            if (user === this.state.userViewing) {
                return (
                    <div id="request-form">
                        <span> First name </span><br/>
                        <input 
                            type="text"
                            name="firstName"
                            value={this.state.userViewing.firstName}
                            onChange={this.handleChange}                     
                        /><br/>
                        <span> Last name </span><br/>
                        <input 
                            type="text"
                            name="lastName"
                            onChange={this.handleChange}                     
                            value={this.state.userViewing.lastName}                        
                        /><br/>
                        <span> Email </span><br/>
                        <input 
                            type="email"
                            name="email"
                            onChange={this.handleChange}                     
                            value={this.state.userViewing.email}
                        /><br/>
                        <span> Phone </span><br/>
                        <input 
                            type="text"
                            name="phone"
                            onChange={this.handleChange}                     
                            value={this.state.userViewing.phone}
                        /><br/>
                        <span> Year Graduated </span><br/>
                        <input 
                            type="text"
                            name="yearGraduated"
                            onChange={this.handleChange}                     
                            value={this.state.userViewing.yearGraduated}
                        /><br/>
                        <span> Country </span><br/>
                        <input 
                            type="text"
                            name="country"
                            onChange={this.handleChange}                     
                            value={this.state.userViewing.country}
                        /><br/>
                        <span> Address </span><br/>
                        <input 
                            type="text"
                            name="address"
                            onChange={this.handleChange}                     
                            value={this.state.userViewing.address}
                        /><br/>
                        { 
                            this.state.viewPending ? 
                                <span> Preferred password </span>
                                :
                                null
                        }<br/>
                        {
                            this.state.viewPending ? 
                                <input 
                                    type="text"
                                    name="passwordPref"
                                    onChange={this.handleChange}                     
                                    value={this.state.userViewing.passwordPref}
                                />
                                :
                                null
                        }
                        <br/>
                        { 
                            this.state.viewPending ? 
                                <div>
                                    <button id="approve-btn" onClick={this.handleApprove}> Approve </button>
                                    <button id="decline-btn" onClick={() => {this.handleDecline(user._id)}}> Decline </button>
                                </div>
                                :
                                null
                        }
                    </div>
                )
            }
        }
    }

    
    render(){

        const focusBtn = (name) => {
            if (name) {
                return {
                    backgroundColor: "#f0f0f0" 
                }
            }
            return null
        }

        return (
            <div id='dash-members-container'>
                <div id="member-left-col">
                    <div id="select-options">
                        <button className="col-title" style={focusBtn(this.state.viewPending)} name="viewPending" onClick={this.handleSelect}> 
                            Pending  
                            {
                                this.state.pending.length > 0 ? 
                                    <div id="num-circle"> {this.state.pending.length} </div> 
                                    :
                                    null
                            }
                        </button>
                        <button className="col-title" style={focusBtn(this.state.viewCurrent)} name="viewCurrent" onClick={this.handleSelect}> Current ({this.state.userList.length})</button>
                    </div>

                    <div id="display-list"> 
                        {this.state.viewPending ? this.renderPending('pending') : null}
                        {this.state.viewCurrent ? this.renderPending('userList') : null}
                    </div>
                </div>
                <div id="member-right-col">
                    { this.renderUserDetails() }
                </div>
            </div>
        )
    }
} 