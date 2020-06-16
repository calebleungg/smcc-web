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
        updateProfile: false
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
                        this.state.user.avatar.url ?
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
                </div>
               
            </div>
        )
        
    }
} 