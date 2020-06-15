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
        albumToAdd: ''
    }

    componentDidMount() {
        Axios.get('/api/albums')
            .then(response => {
                const list = response.data
                list.map(album => {
                    album.isViewing = false
                })
                this.setState({
                    albumList: list,
                    isLoading: false
                })
            })
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

    renderListNames = () => {
        let output = []
        this.state.albumList.map(album => {
            output.push(
                <button onClick={() => this.viewAlbum(album._id)} style={this.selectedAlbum(album._id)}> {album.name} </button>
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

    
    render(){
        console.log(this.state.albumList)

        if (this.state.isLoading) {
            return (
                <p> loading... </p>
            )
        }

        return (
            <div id="dash-album-container">
                <div id="dash-album-left">
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
                                        <span> <strong> Comment </strong> </span><br/><br/>
                                        <span> {this.state.expandedComments} </span>
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