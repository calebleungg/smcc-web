import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'
import avatarDefault from '../../assets/images/default-pic.png'

export default class DashboardMembers extends Component {

    state = {
        viewPending: false,
        viewCurrent: true,
        pending: [],
        userList: [],
        userViewing: null,
        updateList: false,
        allowEdit: false,
        flash: null,
        resetPasswordInput: '',
        confirmDelete: false
    }

    componentDidUpdate() {

        if(this.state.flash && this.state.flash.success) {
            setTimeout(() => {
                this.setState({
                    flash: null
                })
            }, 2000)
        }

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

    handleEdit = () => {
        const status = this.state.allowEdit
        this.setState({
            allowEdit: !status
        })
    }

    handleInput = (event)  => {
        const { name, value} = event.target
        this.setState({
            [name]: value
        })
    }

    adminDeleteUser = () => {
        if (this.state.confirmDelete) {
            axios.delete(`/api/users/admin/delete/${this.state.userViewing._id}`)
                .then(response => {
                    console.log(response)
                    this.setState({
                        confirmDelete: false,
                        updateList: true
                    })
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    adminPasswordReset = () => {
        const req = {
            email: this.state.userViewing.email,
            reset: this.state.resetPasswordInput
        }

        axios.put('/api/users/admin/password-reset', req)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        resetPasswordInput: '',
                        flash:{
                            success: true,
                            message: "Password has been reset"
                        }
                    })
                } else {
                    this.setState({
                        flash:{
                            success: false,
                            message: "Error resetting password"
                        }
                    })
                }
            })
            .catch(err => {
                this.setState({
                    flash:{
                        success: false,
                        message: "Internal error resetting password"
                    }
                })
            })
    }

    setConfirmDelete = () => {
        const status = this.state.confirmDelete
        this.setState({
            confirmDelete: !status
        })
    }

    updateDetails = () => {
        // console.log(this.state.userViewing)
        axios.put(`/api/users/update/details/${this.state.userViewing._id}`, this.state.userViewing)
            .then(response => {
                console.log(response)
                this.setState({
                    allowEdit: false,
                    flash: {
                        success: true,
                        message: "Details successfully updated"
                    }
                })
            })
            .catch(err => {
                console.log(err)
                this.setState({
                    flash: {
                        success: false,
                        message: "There was an error saving the updated information."
                    }
                })
            })
    }

    renderUserDetails = () => {
        const list = this.state.viewPending ? this.state.pending : this.state.userList
        for (let user of list) {
            if (user === this.state.userViewing) {
                return (
                    <div id="request-form">
                     
                        <a onClick={this.handleEdit} > {!this.state.allowEdit ? "Allow Editing" : "Disable Editing" } </a><br/><br/>
                    
                        {
                            this.state.viewCurrent ?
                                user.avatar && user.avatar.url ?
                                    <img src={user.avatar.url} />
                                    :
                                    <img src={avatarDefault} />
                                :
                                null
                        }
                        <br/>
                        <span> First name </span><br/>
                        <input 
                            type="text"
                            name="firstName"
                            disabled={this.state.allowEdit ? false : true}
                            value={this.state.userViewing.firstName}
                            onChange={this.handleChange}                     
                        /><br/>
                        <span> Last name </span><br/>
                        <input 
                            type="text"
                            name="lastName"
                            disabled={this.state.allowEdit ? false : true}
                            onChange={this.handleChange}                     
                            value={this.state.userViewing.lastName}                        
                        /><br/>
                        <span> Email </span><br/>
                        <input 
                            type="email"
                            name="email"
                            disabled="true"
                            onChange={this.handleChange}                     
                            value={this.state.userViewing.email}
                        /><br/>
                        <span> Phone </span><br/>
                        <input 
                            type="text"
                            name="phone"
                            disabled={this.state.allowEdit ? false : true}
                            onChange={this.handleChange}                     
                            value={this.state.userViewing.phone}
                        /><br/>
                        <span> Year Graduated </span><br/>
                        <input 
                            type="text"
                            name="yearGraduated"
                            disabled={this.state.allowEdit ? false : true}
                            onChange={this.handleChange}                     
                            value={this.state.userViewing.yearGraduated}
                        /><br/>
                        <span> Country </span><br/>
                        <input 
                            type="text"
                            name="country"
                            disabled={this.state.allowEdit ? false : true}
                            onChange={this.handleChange}                     
                            value={this.state.userViewing.country}
                        /><br/>
                        <span> Address </span><br/>
                        <input 
                            type="text"
                            name="address"
                            disabled={this.state.allowEdit ? false : true}
                            onChange={this.handleChange}                     
                            value={this.state.userViewing.address}
                        /><br/>
                        {
                            this.state.viewCurrent && this.state.allowEdit ?
                                <button id="approve-btn" onClick={this.updateDetails} > Save details </button>
                                :
                                null
                        }
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
                        {
                            this.state.viewCurrent ?
                                <div id="admin-options">
                                    {
                                        this.state.flash ?
                                            <span style={this.state.flash.success ? {color: "#1DB954"} : {color: "red"}} > {this.state.flash.message} </span>
                                            :
                                            null
                                    }
                                    <br/>
                                    <button id="delete-user-btn" onClick={this.setConfirmDelete} style={this.state.confirmDelete ? {backgroundColor:"#1DB954"} : null}> {this.state.confirmDelete ? "cancel" : "Delete user"} </button> 
                                    {
                                        this.state.confirmDelete ?
                                            <a style={{color: "red"}} onClick={this.adminDeleteUser}> confirm delete, press here </a> 
                                            :
                                            null
                                    }
                                    <br/><br/>
                                    <div>
                                        <button id="reset-password" onClick={this.adminPasswordReset}> Reset password </button>
                                        <input type="text" placeholder="Enter new password for resest" value={this.state.resetPasswordInput} name="resetPasswordInput" onChange={this.handleInput}/>
                                    </div>
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
                        <button className="col-title" style={focusBtn(this.state.viewCurrent)} name="viewCurrent" onClick={this.handleSelect}> Current ({this.state.userList.length})</button>
                        <button className="col-title" style={focusBtn(this.state.viewPending)} name="viewPending" onClick={this.handleSelect}> 
                            Pending  
                            {
                                this.state.pending.length > 0 ? 
                                    <div id="num-circle"> {this.state.pending.length} </div> 
                                    :
                                    null
                            }
                        </button>
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