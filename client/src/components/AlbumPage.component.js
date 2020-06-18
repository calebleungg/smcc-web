import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import schoolLogo from '../assets/images/smcc-logo.jpg'
import axios from 'axios'
import Modal from 'react-modal';

export default class AlbumPage extends Component {

    state = {
        album: null,
        showPhoto: false,
        photoViewing: '',
        photoDesc: '',
    }

    componentDidMount() {
        axios.get(`/api/albums/single/${this.props.match.params.id}`)
            .then(response => {
                this.setState({
                    album: response.data
                })
            })
    }

    showPhoto = (photo) => {
        console.log(photo.url)
        this.setState({
            photoViewing: photo.url,
            photoDesc: photo.comment,
            showPhoto: true
        })
    }

    closePhoto = () => {
        this.setState({
            photoDesc: '',
            photoViewing: '',
            showPhoto: false
        })
    }

    renderPhotos = () => {
        let output = []
        this.state.album.photos.map(photo => {
            output.push(
                <img src={photo.url} onClick={() => this.showPhoto(photo)} />
            )
        })
        return output
    }

    render(){

        if(this.state.showPhoto) {
            return (
                <div id="album-page-container">
                    <div id="photo-modal">
                        <div>
                            <div>
                                <i class="fas fa-times-circle"  onClick={this.closePhoto}></i><br/><br/>
                                <span> {this.state.photoDesc} </span> 
                            </div>
                            <img id="view-photo" src={this.state.photoViewing} />
                        </div>
                    </div>
                </div>
            )
        }

        if(this.state.album) {
            
            return (
                <div id="album-page-container">
                    <h2> {this.state.album.name} </h2><br/>
                    <p> {this.state.album.description} </p>
                    <div id="ap-display">
                        {this.renderPhotos()}
                    </div>
                </div>
            )

        } else {
            return (
                <div id="album-page-container" >
                    loading...
                </div>
            )
        }

    }
} 