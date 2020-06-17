import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import avatarDefault from '../assets/images/default-pic.png'
import loadingGif from '../assets/images/loading.gif'


export default class ProfilePage extends Component {

    state = {
        isAuthenticating: true,
        isUploading: false,
        redirect: false,
        user: {},
        file: null,
        flash: null,
        updateProfile: false,
        changePassword: false,
        newPassword: '',
        confirmPassword: '',
        oldPassword: ''
    }

    componentDidMount() {
        this.getApiProfile()
    }

    getApiProfile = () => {
        axios.get('/api/auth/user')
            .then(response => {
                console.log(response.data)
                if(response.data.user) {
                    this.setState({
                        user: response.data.user
                    })
                }
                this.setState({
                    isAuthenticating: false
                })
            })
            .catch(err => {
                this.setState({
                    isAuthenticating: false,
                    redirect: true
                })
                console.log(err)
            })
    }

    componentDidUpdate() {
        if (this.state.updateProfile) {
            this.getApiProfile()
            this.setState({
                updateProfile: false
            })
        }
        if (this.state.flash && this.state.flash.success) {
            setTimeout(() => {
                this.setState({
                    flash: null
                })
            }, 2000)
        }
    }

    handleChange = (event ) => {
        const { name, value } = event.target
        let updateUser = this.state.user
        updateUser[name] = value
        this.setState({
            user: updateUser
        })
    }

    onFileChange = (event) => {
        this.setState({
            file: event.target.files[0]
        })
    }

    handleUpload = () => {
        this.setState({
            isUploading: true
        })

        const file = this.state.file

        const formData = new FormData()
        formData.append('upload_preset', 'trt9vcvh')
        formData.append('file', file)

        axios.post('https://api.cloudinary.com/v1_1/dpbekfxvh/image/upload', formData)
            .then(response => {
            
                console.log(response.data)

                const req = {
                    url: response.data.secure_url,
                    publicId: response.data.public_id
                }

                axios.put(`/api/users/update/avatar/${this.state.user._id}`, req)
                    .then(response => {
                        console.log(response)
                        this.setState({
                            isUploading: false,
                            file: null,
                            updateProfile: true,
                            flash: {
                                success: true,
                                message: "profile uploaded successfully"
                            }
                        })
                    })
                    .catch(err => {
                        console.log(err)
                        this.setState({
                            isUploading: false,
                            file: null,
                            flash: {
                                success: false,
                                message: "error uploading profile"
                            }
                        })
                    })
            })
    }

    handleSubmit = () => {
        console.log(this.state.user)
        axios.put(`/api/users/update/details/${this.state.user._id}`, this.state.user)
            .then(response => {
                console.log(response)
                this.setState({
                    flash: {
                        success: true,
                        message: "profile uploaded successfully"
                    }
                })
            })
            .catch(err => {
                console.log(err)
                this.setState({
                    flash: {
                        success: false,
                        message: "There was an error saving your updated information."
                    }
                })
            })
    }

    handlePasswordChange = () => {
        const status = this.state.changePassword
        this.setState({
            changePassword: !status
        })
    }

    onSubmitNewPassword = () => {
        const checkSame = (this.state.newPassword === this.state.confirmPassword)
        const checkLength = (this.state.newPassword.length > 6)
        const email = this.state.user.email

        if (checkLength && checkSame) {
            const req = {
                email: email,
                oldPassword: this.state.oldPassword,
                newPassword: this.state.newPassword
            }

            axios.put('/api/users/password/change', req)
                .then(response => {
                    console.log(response)
                    if (response.data.name === "IncorrectPasswordError") {
                        return (
                            this.setState({
                                flash: {
                                    success: false,
                                    message: "Old password was incorrect"
                                }
                            })
                        )
                    } 
                    return (
                        this.setState({
                            changePassword: false,
                            flash:{
                                success: true,
                                message: "New password saved"
                            }
                        })
                    )
                })
                .catch(err => {
                    console.log(err)
                    this.setState({
                        flash:{
                            success: false,
                            message: "Internal error saving your password"
                        }
                    })
                })

        } else {
            this.setState({
                flash: {
                    success: false,
                    message: "Passwords must be the same. Min characters 6."
                }
            })
        }

    
    }

    handleInputChange = (event) => {
        const { name, value } = event.target
        this.setState({
            [name]: value
        })
    }

   
    render(){

        if(this.state.redirect) {
            return <Redirect to="/" />
        }

        if(this.state.isAuthenticating) {
            return (
                <div id="profile-page-container">
                    authenticating...
                </div>
            )
        }

        
        return (
            <div id="profile-page-container">
                <div id="avatar-div">
                    {
                        this.state.user.avatar && this.state.user.avatar.url ?
                            <img src={this.state.user.avatar.url} /> 
                            :
                            <img src={avatarDefault} /> 
                    }<br/>
                    <input 
                        type="file"
                        onChange={this.onFileChange}
                    /><br/>
                    <button onClick={this.handleUpload}> upload </button><br/>
                    {
                        this.state.isUploading ?
                            <span> uploading... </span>
                            :
                            null
                    }
                    {
                        this.state.flash ?
                            <span style={this.state.flash.success ? {color: "#1DB954"} : {color: "red"}} > {this.state.flash.message} </span>
                            :
                            null
                    }
                </div>
                <div id="request-form">
                    <span> First name </span><br/>
                    <input 
                        type="text"
                        name="firstName"
                        value={this.state.user.firstName}
                        onChange={this.handleChange}                     
                    /><br/>
                    <span> Last name </span><br/>
                    <input 
                        type="text"
                        name="lastName"
                        onChange={this.handleChange}                     
                        value={this.state.user.lastName}                        
                    /><br/>
                    <span> Email </span><br/>
                    <input 
                        type="email"
                        name="email"
                        onChange={this.handleChange}                     
                        value={this.state.user.email}
                        disabled="true"
                    /><br/>
                    <span> Phone </span><br/>
                    <input 
                        type="text"
                        name="phone"
                        onChange={this.handleChange}                     
                        value={this.state.user.phone}
                    /><br/>
                    <span> Year Graduated </span><br/>
                    <input 
                        type="text"
                        name="yearGraduated"
                        onChange={this.handleChange}                     
                        value={this.state.user.yearGraduated}
                    /><br/>
                    <span> Country </span><br/>
                    <input 
                        type="text"
                        name="country"
                        onChange={this.handleChange}                     
                        value={this.state.user.country}
                    /><br/>
                    <span> Address </span><br/>
                    <input 
                        type="text"
                        name="address"
                        onChange={this.handleChange}                     
                        value={this.state.user.address}
                    /><br/>
                    <button onClick={this.handleSubmit}> update </button><br/><br/>
                    <a id="change-password-btn" onClick={this.handlePasswordChange} style={this.state.changePassword ? {color: "red"} : null}> {this.state.changePassword ? "cancel" : "Change password"} </a>
                    {
                        this.state.changePassword ?
                            <div id="password-div">
                                <span> Old password </span><br/>
                                <input type="password" name="oldPassword" placeholder="Enter new password" onChange={this.handleInputChange} /><br/>
                                <span> New password </span><br/>
                                <input type="password" name="newPassword" placeholder="Enter new password" onChange={this.handleInputChange} /><br/>
                                <span> Confirm new password </span><br/>
                                <input type="password" name="confirmPassword" placeholder="Enter new password again" onChange={this.handleInputChange} /><br/>
                                <button onClick={this.onSubmitNewPassword}> change </button>
                            </div>
                            :
                            null

                    }
                </div>
               
            </div>
        )
        
    }
} 