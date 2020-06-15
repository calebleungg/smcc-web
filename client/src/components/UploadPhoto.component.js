import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'

export default class UploadPhoto extends Component {

    state = {
        file: null,
        comment: ''
    }
 
    onFileChange = (event) => {
        this.setState({
            file: event.target.files[0]
        })
    }
    

    onUpload = () => {

        const file = this.state.file
        console.log(this.state.comment)

        const formData = new FormData()
        formData.append('upload_preset', 'trt9vcvh')
        formData.append('file', file)
            console.log(formData)

        axios.post('https://api.cloudinary.com/v1_1/dpbekfxvh/image/upload', formData)
            .then(response => {
            
                console.log(response.data)
                axios.put(`/api/album/upload/5ee74c908bec406274068b29`, {
                    comment: this.state.comment,
                    url: response.data.secure_url
                }).then(response => {
                    console.log(response)
                }).catch(err => console.log(err))
            })
    }

    handleInput = (event) => {
        const { name, value } = event.target
        this.setState({
            [name]: value
        })
    }

    getBase64(e) {
        let file = e.target.files[0]
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          this.setState({
            imgUpload: reader.result
          })
        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
        }
      }
    

    render(){

        return (
            <div id="upload-container">
                <input name="photo" type="file" onChange={this.onFileChange} />
                <textarea name="comment" value={this.state.comment} onChange={this.handleInput}></textarea>
                <button onClick={this.onUpload} > upload </button>
            </div>
        )
    }
} 