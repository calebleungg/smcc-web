import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'

export default class UploadPhoto extends Component {

    state = {
        file: null,
        comment: '',
        albumId: this.props.id,
        isUploading: false
    }
 
    onFileChange = (event) => {
        this.setState({
            file: event.target.files[0]
        })
    }
    

    onUpload = () => {
        this.setState({
            isUploading: true
        })

        const file = this.state.file
        console.log(this.state.comment)

        const formData = new FormData()
        formData.append('upload_preset', 'trt9vcvh')
        formData.append('file', file)
        console.log(formData)

        axios.post('https://api.cloudinary.com/v1_1/dpbekfxvh/image/upload', formData)
            .then(response => {
            
                console.log(response.data)
                axios.put(`/api/albums/upload/${this.props.id}`, {
                    comment: this.state.comment,
                    url: response.data.secure_url
                }).then(response => {
                    console.log(response)
                    this.setState({
                        isUploading: false,
                        success: "image successfully uploaded"
                    })

                    setTimeout(() => {
                        window.location.reload(false)
                    }, 2000)

                }).catch(err => {
                    console.log(err)
                    this.setState({
                        isUploading: false,
                        error: "Failed to upload photo"
                    })
                })
            })
    }

    handleInput = (event) => {
        const { name, value } = event.target
        this.setState({
            [name]: value
        })
    }
    

    render(){

        return (
            <div id="upload-container">
                <span id="add-title"> Add photo: </span><br/>
                <input id="file-select-input" name="photo" type="file" onChange={this.onFileChange} /> <br/>
                <textarea name="comment" id="photo-comment-input" placeholder="Enter a comment" value={this.state.comment} onChange={this.handleInput} /><br/>
                <button onClick={this.onUpload} > upload </button><br/>
                <span> {this.state.isUploading ? "uploading..." : null} </span>
                <span style={{color: "red"}}> {this.state.error ? this.state.error : null} </span>
                <span style={{color: "#1DB954"}}> {this.state.success ? this.state.success : null} </span>
            </div>
        )
    }
} 