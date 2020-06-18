import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import schoolLogo from '../assets/images/smcc-logo.jpg'
import axios from 'axios'
import avatarDefault from '../assets/images/default-pic.png'
import JavascriptTimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import ReactTimeAgo from 'react-time-ago'

JavascriptTimeAgo.addLocale(en)

export default class MemberPage extends Component {

    state = {
        isAuthenticating: true,
        redirect: false,
        user: {},
        memberList: [],
        posts: [],
        albums: [],
        events: [],
        postInput: '',
        updatePosts: false,
        editingInput: '',
        commentInput: '',
        isAnnouncement: false,
        photoToAttach: null,
    }

    componentDidMount() {
        this.getApiProfile()
        this.getApiMemberList()
        this.getApiPosts()
        this.getApiAlbums()
        this.getApiEvents()
    }

    componentDidUpdate() {
        if(this.state.updatePosts) {
            this.getApiPosts()
            this.setState({
                updatePosts: false
            })
        }
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

    getApiPosts = () => {
        axios.get('/api/posts')
            .then(response => {
                let posts = response.data
                posts.map(post => {
                    post.isEditing = false
                })
                this.setState({
                    posts: posts
                })
            })
            .catch(err => console.log(err))
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

    getApiAlbums = () => {
        axios.get('/api/albums')
            .then(response => {
                this.setState({
                    albums: response.data
                })
            })
    }

    getApiEvents = () => {
        axios.get('/api/events')
            .then(response => {
                this.setState({
                    events: response.data
                })
            })
    }

    renderEvents = () => {
        let output = []
        this.state.events.map(event => {
            const months = {
                "01": "JAN",
                "02": "FEB",
                "03": "MAR",
                "04": "APR",
                "05": "MAY",
                "06": "JUN",
                "07": "JUL",
                "08": "AUG",
                "09": "SEP",
                "10": "OCT",
                "11": "NOV",
                "12": "DEC",
            }
           
            output.push(
            
                <div className="event-item">
                    <div className="ei-top">
                        <div className="ei-date">
                            <span className="ei-month"> {months[event.date.slice(0,10).split('-')[1]]} </span><br/>
                            <span className="ei-day"> {event.date.slice(0,10).split('-')[2]} </span>
                        </div>
                        <div className="ei-details">
                            <span className="ei-name"> {event.name} </span><br/>
                            <span className="ei-time"> {event.time} </span>
                        </div>
                    </div>
                    <span className="ei-desc"> {event.description} </span>
                </div>
                    
            )
        })
       
        return output
    }

    renderAlbums = () => {
        let output = []
        this.state.albums.map(album => {
            output.push(
                <Link to={`/album/${album._id}`}>
                    <div className="ma-album-item">
                        <span className="ma-album-name"> {album.name.length > 16 ? album.name.slice(0, 16) + "..." : album.name} </span> <br/>
                        {
                            album.photos.length > 0 ?
                                <img src={album.photos[0].url} />
                                :
                                <img src={schoolLogo} />
                        }
                    </div>
                </Link>
            )
        })
        return (
            <div id="ma-album-box">
                {output}
            </div>
        )
    }

    handleChange = (event) => {
        const { name, value } = event.target
        this.setState({
            [name]: value
        })
    }

    checkIfOwner = (post) => {
        return post.user.id === this.state.user._id ? true : false
    }

    deletePost = (post) => {
        
        axios.delete(`/api/posts/delete/${post._id}`)
            .then(response => {
                console.log(response)
                this.setState({
                    updatePosts: true
                })
            })
            .catch(err => console.log(err))
    }

    editPost = (post) => {
        const status = !this.state.postEditing
        
        let postList = this.state.posts
        for(let item of postList) {
            if (item._id === post._id) {
                item.isEditing = true
                this.setState({
                    editingInput: item.content
                })
            }
        }
        this.setState({
            posts: postList,
        })
    }

    finishEdit = (post) => {
        const req = {
            content: this.state.editingInput,
            postData: post
        }

        axios.put('/api/posts/edit', req)
            .then(response => {
                console.log(response)
        
                this.setState({
                    updatePosts: true,
                    editingInput: ''
                })
            })
            .catch(err => console.log(err))


    }

    addComment = (post) => {
        const req = {
            user: {
                id: this.state.user._id,
                name: `${this.state.user.firstName} ${this.state.user.lastName}`,
                avatar: this.state.user.avatar && this.state.user.avatar.url ? this.state.user.avatar.url : null
            },
            comment: this.state.commentInput,
            postData: post
        }

        axios.put('/api/posts/comment', req)
            .then(response => {
                console.log(response)
                this.setState({
                    updatePosts: true,
                    commentInput: ''
                })
            })
            .catch(err => {
                this.setState({
                    updatePosts: true,
                    commentInput: ''
                })
            })
    }

    deleteComment = (comment) => {
        axios.delete(`/api/posts/comment/delete/${comment._id}`)
            .then(response => {
                console.log(response)
                this.setState({
                    updatePosts: true
                })
            })
            .catch(err => console.log(err))
    }

    renderComments = (post) => {
        let output = []

        let comments = post.comments
        console.log(comments)

        comments.sort(function(a, b) {
            let dateA = a.created_at; // ignore upper and lowercase
            let dateB = b.created_at.toUpperCase(); // ignore upper and lowercase
            if (dateA > dateB) {
              return -1;
            }
            if (dateA < dateB) {
              return 1;
            }
            // names must be equal
            return 0;
        })

        comments.map(comment => {
            output.push(
                <div className="comment-item">
                    <div className="ci-top">
                        <img src={comment.user.avatar ? comment.user.avatar : avatarDefault} />
                        <span className="comment-content"> <strong>{comment.user.name}</strong> {comment.comment} </span>
                        {
                            this.checkIfOwner(comment) ?
                                <i class="far fa-trash-alt" style={{color: "#a31010"}} onClick={() => this.deleteComment(comment)} ></i>
                                :
                                null
                        }
                    </div>
                    <span className="comment-time"> <ReactTimeAgo date={comment.created_at} /> </span>
                </div>
            )
        })
        return output
    }

    renderPosts = () => {
        let output = []
        this.state.posts.map(post => {
            output.push(
                <div className="post-item" >
                    <div className="pi-user-details">
                        <img src={post.user.avatar ? post.user.avatar : avatarDefault} /> 
                        <div>
                            <span className="pi-user-name" > {post.user.name} </span><br/>
                            <span className="pi-date" > <ReactTimeAgo date={post.created_at} /> </span>
                        </div>
                        { 
                            this.checkIfOwner(post) ?
                                <div className="user-post-edit">
                                    {
                                        post.isEditing ?
                                            <i class="fas fa-check-circle" style={{color: "#1DB954"}} onClick={() => this.finishEdit(post)} ></i>
                                            :
                                            <i class="fas fa-edit" onClick={() => this.editPost(post)} ></i>

                                    }
                                    <i class="far fa-trash-alt" style={{color: "#a31010"}} onClick={() => this.deletePost(post)}></i>
                                </div>
                                :
                                null
                        }
                    </div>
                    <div className="pi-content">
                        {
                            post.isEditing ? 
                                <input 
                                    className="post-edit-input" 
                                    type="text" 
                                    name="editingInput" 
                                    value={this.state.editingInput}
                                    onChange={this.handleChange} 
                                    onKeyPress={(event) => {
                                        if (event.key === "Enter") {
                                            this.finishEdit(post)
                                        }
                                    }}
                                />
                                :
                                <span> {post.content} </span>
                        }
                    </div>
                    {
                        post.media ?
                        
                            <img src={post.media.url} />
                        
                            :
                            null
                    }
                    
                    {
                        post.comments.length > 0 ? 
                            <div className="pi-comment-list">
                                {this.renderComments(post)}
                            </div>
                            :
                            null
                    }
                    <div className="pi-comments">
                        <img src={this.state.user.avatar && this.state.user.avatar.url ? this.state.user.avatar.url : avatarDefault} /> 
                        <input 
                            type="text" 
                            placeholder="Write a comment..." 
                            name="commentInput" 
                            onChange={this.handleChange} 
                            onKeyPress={(event) => {
                                if(event.key === "Enter") {
                                    this.addComment(post)
                                    event.target.value = ''
                                }
                            }}
                        />
                    </div>
                </div>
            )
        })
        return output
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
        let req = {
            user: user,
            content: content
        }

        if (this.state.photoToAttach) {
            const file = this.state.photoToAttach
    
            const formData = new FormData()
            formData.append('upload_preset', 'trt9vcvh')
            formData.append('file', file)
    
            axios.post('https://api.cloudinary.com/v1_1/dpbekfxvh/image/upload', formData)
                .then(response => {

                    req.media = {
                        url: response.data.secure_url,
                        publicId: response.data.public_id
                    }
                    console.log(req)
            
                    axios.post('/api/posts/create', req)
                        .then(response => {
                            console.log(response)
            
                            this.setState({
                                postInput: '',
                                updatePosts: true
                            })
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })
                .catch(err => console.log(err))
        } else {
            axios.post('/api/posts/create', req)
                .then(response => {
                    console.log(response)
    
                    this.setState({
                        postInput: '',
                        updatePosts: true
                    })
                })
                .catch(err => {
                    console.log(err)
                })
        }

    }

    handleAnnouncement = () => {
        const status = this.state.isAnnouncement
        this.setState({
            isAnnouncement: !status
        })
    }

    triggerUpload = () => {
        document.getElementById('post-image-input').click()
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

        const upload = () => {
            document.getElementById("selectImage").click()
        }

        return (
            <div id="member-container">
               
                <div className="ma-col" id="member-left-col">
                    <div >
                    <span className="ma-sub-title"> Member List  </span>
                        <div id="ma-member-list">
                            {this.renderMemberList()}
                        </div>
                    </div>
                </div>

                <div  className="ma-col" id="member-middle-col">
                    <div id="ma-post-input" style={{paddingTop: "30px"}}>
                        <textarea 
                            type="text" 
                            placeholder="Type your post here..." 
                            name="postInput" 
                            value={this.state.postInput} 
                            onChange={this.handleChange} 
                        /><br/>
                        <div>
                            <button onClick={this.submitPost} > Post </button> 
                            <i class="fas fa-image" onClick={this.triggerUpload}></i> 
                            {
                                this.state.photoToAttach ?
                                    <div>
                                        <span> {this.state.photoToAttach.name} </span> <i id="remove-attach" class="fas fa-times-circle" onClick={() => this.setState({photoToAttach: null})} ></i>
                                    </div>
                                    :
                                    null
                            }
                            <input type="file" id="post-image-input" onChange={(event) => {
                                this.setState({photoToAttach: event.target.files[0]})}
                            } style={{display: "none"}} />
                        </div>
                    </div>
                    <div id="ma-post-display">
                        {this.renderPosts()}
                    </div>
                </div>

                <div  className="ma-col" id="member-right-col">
                    <span className="ma-sub-title"> Albums </span>
                    <div id="ma-album-list">
                        {this.renderAlbums()}
                    </div><br/><br/>
                    <span className="ma-sub-title"> Events </span>
                    <div id="ma-event-list">
                        {this.renderEvents()}
                    </div>
                </div>
            </div>
        )

    }
} 