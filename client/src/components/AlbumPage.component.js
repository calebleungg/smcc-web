import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import schoolLogo from '../assets/images/smcc-logo.jpg'
import axios from 'axios'
import ImageGallery from 'react-image-gallery';
export default class AlbumPage extends Component {

    state = {
        album: [],
        photos: [],
        showPhoto: false,
        photoViewing: '',
        photoDesc: '',
    }

    componentDidMount() {
        axios.get(`/api/albums/single/${this.props.match.params.id}`)
            .then(response => {
                let photos = []
                response.data.photos.map(photo => {
                    photos.push({
                        original: photo.url,
                        thumbnail: photo.url
                    })
                })
                this.setState({
                    photos: photos,
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

    // renderPhotos = () => {
    //     let output = []
    //     this.state.album.photos.map(photo => {
    //         output.push(
    //             <img src={photo.url} onClick={() => this.showPhoto(photo)} />
    //         )
    //     })
    //     return output
    // }

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
                        <ImageGallery thumbnailPosition={"left"} items={this.state.photos} />
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