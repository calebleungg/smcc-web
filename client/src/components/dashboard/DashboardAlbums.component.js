import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import Axios from 'axios'
import UploadPhoto from '../UploadPhoto.component'

export default class DashboardAlbums extends Component {

    state = {
        albumList: [],
        isLoading: true,
        expandViewUrl: '',
        expandedComments: '',
        expandedView: false,
        addPhoto: false,
        albumToAdd: '',
        newAlbum: '',
        reRenderAlbums: false
    }

    componentDidMount() {
        this.getApiAlbums()
    }

    getApiAlbums = () => {
        Axios.get('/api/albums')
            .then(response => {
                const list = response.data
                list.map(album => {
                    album.isViewing = false
                    album.confirmingDelete = false
                })
                this.setState({
                    albumList: list,
                    isLoading: false
                })
            })
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.reRenderAlbums) {
            this.getApiAlbums()
            this.setState({
                reRenderAlbums: false
            })
        }
    }

    viewAlbum = (id) => {
        let albums = this.state.albumList
        albums.map(album => {
            album.isViewing = false
        })

        for(let i = 0; i < albums.length; i++) {
            if (albums[i]._id === id) {
                albums[i].isViewing = true
            }
        }
        this.setState({
            albumList: albums,
            addPhoto: false,
        })
        this.collapsePhoto()
    }

    selectedAlbum = (id) => {
        for (let album of this.state.albumList) {
            if (album._id === id && album.isViewing) {
                return ({
                    backgroundColor: "#f0f0f0",
                    fontWeight: "700"
                })
            }
        }
    }
    
    collapseDelete = (id) => {
        let albums = this.state.albumList
        albums.map(album => {
            album.confirmingDelete = false
        })
        this.setState({
            albumList: albums
        })
    }

    showDeleteBtn = (id) => {
        let albums = this.state.albumList
        albums.map(album => {
            album.confirmingDelete = false
        })
        for(let i = 0; i < albums.length; i++) {
            if (albums[i]._id === id) {
                albums[i].confirmingDelete = true
            }
        }
        this.setState({
            albumList: albums
        })
    }

    renderDeleteBtn = (id) => {
        for (let album of this.state.albumList) {
            if (album._id === id && album.confirmingDelete) {
                return true
            }
        }
        return false
    }

    renderListNames = () => {
        let output = []
        this.state.albumList.map(album => {
            output.push(
                <div>
                        <button onClick={() => this.viewAlbum(album._id)} style={this.selectedAlbum(album._id)}> 
                            {album.name} 
                            <i class="fas fa-trash" onClick={() => this.showDeleteBtn(album._id)}></i> 
                        </button>
                        <div id="confirm-div">
                            <button id="confirm-delete-btn" style={ this.renderDeleteBtn(album._id) ? null : {display: "none"} } onClick={() => this.handleDeleteAlbum(album._id)}> delete </button>
                            <button id="confirm-keep-btn" style={ this.renderDeleteBtn(album._id) ? null : {display: "none"} } onClick={this.collapseDelete}> keep </button>
                        </div>
                </div>
            )
        })
        return output
    }

    expandPhoto = (url, comments) => {
        this.setState({
            expandedView: true,
            expandedComments: comments,
            expandViewUrl: url
        })
    }

    collapsePhoto = () => {
        this.setState({
            expandedView: false,
            expandedComments: '',
            expandViewUrl: ''
        })
    }

    renderAlbumPhotos = () => {
        let output = []
        for (let album of this.state.albumList) {
            if (album.isViewing) {
                album.photos.map(photo => {
                    output.push(
                        <img src={photo.url} onClick={() => {this.expandPhoto(photo.url, photo.comment)}} />
                    ) 
                })
                return (
                    <div>
                        <i class="fas fa-plus-circle" id="add-photo-btn" onClick={() => {this.setState({addPhoto: true, albumToAdd: album._id})}}></i>
                        <div>
                            {output}
                        </div>
                    </div>
                )
            }
        }
    }

    handleChange = (e) => {
        const { name, value } = e.target
        this.setState({
            [name]: value
        })
    }

    onCreateAlbum = () => {
        if (this.state.newAlbum !== '' || this.state.newAlbum !== ' ' ) {
            Axios.post('/api/albums/create', {name: this.state.newAlbum})
                .then(response => {
                    console.log(response.data)
                    this.setState({
                        newAlbum: '',
                        reRenderAlbums: true
                    })
                })
                .catch(err => console.log(err))
        }
    }

    handleDeleteAlbum = (id) => {
        Axios.delete(`/api/albums/delete/${id}`)
            .then(response => {
                console.log(response)
                this.setState({
                    reRenderAlbums: true
                })
            })
            .catch(err => console.log(err))
        this.collapseDelete()
    }

    
    render(){

        if (this.state.isLoading) {
            return (
                <p> loading... </p>
            )
        }

        return (
            <div id="dash-album-container">
                <div id="dash-album-left">
                    <p> New Album </p>
                    <div id="album-create-input"> 
                        <input 
                            type="text" 
                            placeholder="Enter name"   
                            name="newAlbum" 
                            value={this.state.newAlbum} 
                            onChange={this.handleChange}
                            onKeyPress={(event) => {
                                if(event.key === "Enter") {
                                    this.onCreateAlbum()
                                }
                            }}
                        /><br/>
                        <button onClick={this.onCreateAlbum} > Create </button>
                    </div>

                    <p> Album List </p>
                    <div id="album-list"> 
                        {this.renderListNames()}
                    </div>
                </div>
                <div id="dash-album-right">
                    {
                        this.state.addPhoto ? 
                            <UploadPhoto id={this.state.albumToAdd} />
                            :
                            this.state.expandedView ? 
                                <div id="expanded-view" style={!this.state.expandedView ? {display: "none"} : null}>
                                    <i class="fas fa-arrow-left" onClick={this.collapsePhoto}> </i>
                                    <img id="expanded-photo" src={this.state.expandViewUrl} />
                                    <div>
                                        <span> <strong> Comment </strong> </span><br/>
                                        <p> {this.state.expandedComments} </p>
                                    </div>
                                </div>
                            :                           
                            this.renderAlbumPhotos()
                    }
                </div>
            </div>
        )
    }
} 