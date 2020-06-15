import React, { Component } from 'react'
import bannerPhoto from '../assets/images/banner-photo.jpg'
import landingOne from '../assets/images/front-photo-1.jpg'
import landingTwo from '../assets/images/front-photo-2.jpg'
import logo from '../assets/images/smcc-logo.jpg'
import axios from 'axios'

export default class LandingPage extends Component {

    state = {
       sectionOne: {},
       sectionTwo: {},
       isLoading: true,
       albumList: [],
       isLoggedIn: false,
       user: {}
    }

    componentDidMount() {
        axios.get('/api/content')
            .then(response => {
                const sections = response.data
                sections.map(section => {
                    if (section.name === "History") {
                        this.setState({
                            sectionOne: section
                        })
                    }
                    if (section.name === "Let's Connect") {
                        this.setState({
                            sectionTwo: section
                        })
                    }
                    this.setState({
                        isLoading: false
                    })
                })
            })

        axios.get('/api/albums/public')
            .then(response => {
                let albums = response.data
                albums.map(album => {
                    album.counter = 0
                })
                this.setState({
                    albumList: albums
                })
            })
    
    }

    getAlbumCounter = (id) => {
        for (let album of this.state.albumList) {
            if (album._id === id) {
                return album.counter
            }
        }
    }

    handleNavigate = (option, id) => {
        let albums = this.state.albumList
        if (option === 'back') {
            for (let i = 0; i < albums.length; i++) {
                if (albums[i]._id === id && albums[i].counter > 0) {
                    console.log(albums[i].counter)
                    albums[i].counter = albums[i].counter - 1
                }
            }
        }
        if (option === 'next') {
            console.log(id)
            for (let i = 0; i < albums.length; i++) {
                if (albums[i]._id === id && albums[i].counter < (albums[i].photos.length - 1)) {
                    albums[i].counter = albums[i].counter + 1
                }
            }
        }
        this.setState({
            albumList: albums
        })
    }

    renderAlbums = () => {
        let output = []
        this.state.albumList.map(album => {
            if (album.photos.length > 0 ) {
                output.push(
                    <div className="landing-album-item">
                        <button onClick={(event) => {this.handleNavigate('back', album._id)}} > <i class="fas fa-angle-left"></i> </button>
                        <div>
                            <img src={album.photos[this.getAlbumCounter(album._id)].url} alt="album display" /> 
                            <p> {album.name} </p>
                        </div>
                        <button  onClick={(event) => {this.handleNavigate('next', album._id)}} > <i class="fas fa-angle-right"></i> </button>
                    </div>
                )
            } else {
                output.push(
                    <div className="landing-album-item">
                        <img src={logo}> </img>
                        <p> {album.name} </p>
                    </div>
                )
            }
            
        })
        return output
    }

    render(){

        return (
            <div id="landing-page-container">
                <img id="banner-photo" src={bannerPhoto} alt="picture of class at dinner" ></img>
                <button id="join-btn"> Join the community </button>
                {
                    !this.state.isLoading ? 
                        <div>
                            <div className="landing-content">
                                <img src={landingOne} alt="school 1967" ></img>
                                <div>
                                    <h2> {this.state.sectionOne.name} </h2>
                                    <p> {this.state.sectionOne.content} </p>
                                </div>
                            </div>
                            <div className="landing-content">
                                <div>
                                    <h2> {this.state.sectionTwo.name} </h2>
                                    <p> {this.state.sectionTwo.content} </p>
                                </div>
                                <img src={landingTwo} alt="school 1967" ></img>
                            </div>
                        </div>
                        :
                        null
                }
                <div id="landing-album-list">
                    <p> Down memory lane... </p>
                    <div>
                        {
                            this.state.albumList.length > 0 ? 
                                this.renderAlbums()
                                :
                                null
                        }
                    </div>
                </div>
            </div>
        )
    }
} 