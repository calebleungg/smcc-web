import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import schoolLogo from '../assets/images/smcc-logo.jpg'
import axios from 'axios'
import avatarDefault from '../assets/images/default-pic.png'

export default class MemberPage extends Component {

    state = {
        isAuthenticating: true,
        redirect: false,
        user: {},
        memberList: [],
        postInput: ''
    }

    componentDidMount() {
       this.getApiProfile()
       this.getApiMemberList()
    }

    getApiProfile = () => {
        axios.get('/api/auth/user')
            .then(response => {
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

    getApiMemberList = () => {
        axios.get('/api/users')
            .then(response => {
                const list = response.data
                this.setState({
                    memberList: list
                })
            })
            .catch(err => console.log(err))
    }

    handleChange = (event) => {
        const { name, value } = event.target
        this.setState({
            [name]: value
        })
    }

    renderMemberList = () => {
        let output = []
        this.state.memberList.map(member => {
            output.push(
                <div id="ma-member-card">
                    {
                        member.avatar && member.avatar.url ?
                            <img src={member.avatar.url} />
                            :
                            <img src={avatarDefault} />
                    }
                    <div>
                        <span id="ma-member-name"> {member.firstName} {member.lastName} </span><br/>
                        <span id="ma-member-country"> {member.country} </span>
                    </div>
                </div>
            )
        })
        return output
    }
    
    submitPost = () => {
        console.log(this.state.postInput)
        const user = {
            id: this.state.user._id,
            name: `${this.state.user.firstName} ${this.state.user.lastName}`,
            avatar: this.state.user.avatar && this.state.user.avatar.url ? this.state.user.avatar.url : null
        }
        const content = this.state.postInput        
        const req = {
            user: user,
            content: content
        }
        console.log(req)

        axios.post('/api/posts/create', req)
            .then(response => {
                console.log(response)
                
                this.setState({
                    postInput: ''
                })
            })
            .catch(err => {
                console.log(err)
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
            <div id="member-container">
                <div className="ma-col" id="member-left-col">
                    <div id="ma-member-list">
                        <span className="ma-sub-title"> Member List  </span>
                        {this.renderMemberList()}
                    </div>
                </div>

                <div  className="ma-col" id="member-middle-col">
                    <div id="ma-post-input">
                        <textarea 
                            type="text" 
                            placeholder="Type your post here..." 
                            name="postInput" 
                            value={this.state.postInput} 
                            onChange={this.handleChange} 
                            onKeyPress={(event) => {
                                if(event.key === "Enter") {
                                    this.submitPost()
                                }
                            }}
                        /><br/>
                        <button onClick={this.submitPost} > Post </button>
                    </div>
                    <div>
                        member posts
                    </div>
                </div>

                <div  className="ma-col" id="member-right-col">
                    <div>
                        album display
                    </div>
                    <div>
                        events display
                    </div>
                </div>
            </div>
        )

    }
} 