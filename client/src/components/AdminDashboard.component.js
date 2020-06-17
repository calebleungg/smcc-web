import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import DashboardContent from './dashboard/DashboardContent.component'
import DashboardMembers from './dashboard/DashboardMembers.component'
import DashboardAlbums from './dashboard/DashboardAlbums.component'
import DashboardEvents from './dashboard/DashboardEvents.component'
import avatarDefault from '../assets/images/default-pic.png'

export default class AdminDashboard extends Component {

    state = {
        isVerifying: true,
        isAuthenticated: false,
        viewContent: true,
        viewMembers: false,
        viewAlbums: false,
        viewEvents: false,
        admin: {}
    }

    componentDidMount() {
        axios.get('/api/auth/user')
            .then(response => {
                const user = response.data.user
                if (response.status === 200 && user.role === 'admin') {
                    this.setState({
                        admin: user,
                        isAuthenticated: true
                    })
                } 
                this.setState({
                    isVerifying: false
                })
            })
            .catch(err => {
                this.setState({
                    isVerifying: false
                })
            })
    }

    handleClick = (event) => {
        this.setState({
            viewContent: false,
            viewMembers: false,
            viewAlbums: false,
            viewEvents: false
        })
        const { name } = event.target
        const prevState = this.state[name]
        this.setState({
            [name]: true
        })
    }

    render(){

        const selectedBtn = (btn) => {
            if (btn) {
                return {
                    backgroundColor: "#f0f0f0",
                    fontWeight: "600"
                }
            }
        }

        if (this.state.isVerifying) {
            return (
                <div id="admin-container">
                    authenticating...
                </div>
            )
        } else {
            if (this.state.isAuthenticated) {
                return (
                    <div id="admin-container">
                        <div id="admin-side-panel">
                            <p> Admin dashboard</p>
                            <div>
                                {
                                    this.state.admin.avatar && this.state.admin.avatar.url ?
                                        <img src={this.state.admin.avatar.url} />
                                        :
                                        <img src={avatarDefault} />
                                    
                                }
                                <br/>
                                <br/>
                                <span id="admin-name"> {this.state.admin.firstName} {this.state.admin.lastName} </span>
                            </div>
                            <div id="panel-options">
                                <button style={selectedBtn(this.state.viewContent)} name="viewContent" onClick={this.handleClick} > Page Content </button>
                                <button style={selectedBtn(this.state.viewMembers)} name="viewMembers" onClick={this.handleClick}> Members </button>
                                <button style={selectedBtn(this.state.viewAlbums)} name="viewAlbums" onClick={this.handleClick}> Albums </button>
                                <button style={selectedBtn(this.state.viewEvents)} name="viewEvents" onClick={this.handleClick}> Events </button>
                            </div>
                        </div>
                        <div id="admin-content-div">
                            {this.state.viewContent ? <DashboardContent /> : null}
                            {this.state.viewMembers ? <DashboardMembers /> : null}
                            {this.state.viewAlbums ? <DashboardAlbums /> : null}
                            {this.state.viewEvents ? <DashboardEvents /> : null}
                        </div>
                    </div>
                )
            } else {
                return <Redirect to="/" />
            }
        }
    }
} 