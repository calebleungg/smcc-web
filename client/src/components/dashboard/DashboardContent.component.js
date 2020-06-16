import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'
import loadingGif from '../../assets/images/loading.gif'

export default class DashboardContent extends Component {

    state = {
        contents: [],
        flashMessage: null,
        isLoading: true
    }

    componentDidMount() {
        axios.get('/api/content')
            .then(response => {
                const sections = response.data
                sections.map(section => {
                    this.setState({
                        [section._id]: {
                            name: section.name,
                            content: section.content
                        }
                    })
                })
                this.setState({
                    isLoading: false,
                    contents: sections
                })
            })
    }

    componentDidUpdate() {
        if (this.state.flashMessage) {
            setTimeout(() => {
                this.setState({
                    flashMessage: null
                })
            }, 1500)
        }
    }

    handleChange = (event) => {
        const { name, value, id } = event.target
        const sectionIndex = id.split('-')[0]
        let toBeSaved = this.state.contents
        toBeSaved[sectionIndex][name] = value
        this.setState({
            contents: toBeSaved
        })
    }  

    onSubmit = () => {
        const req = {
            content: this.state.contents
        }
        axios.put('/api/content/update', req)
            .then(response => {
                console.log(response)
                this.setState({
                    flashMessage: {
                        success: true,
                        message: "successfully saved updates"
                    }
                })
            })
            .catch(err => {
                console.log(err)
                this.setState({
                    flashMessage: {
                        success: true,
                        message: "successfully saved updates"
                    }
                })
            })
    }

    renderContent = () => {
        let output = []
        let counter = 0
        this.state.contents.map(section => {
 
            if (this.state[section._id]) {
                output.push(
                    <div className="content-card">
                        <input 
                            id={`${counter}-name`}
                            type="text"
                            value={this.state.contents[counter].name}
                            name="name"
                            onChange={this.handleChange}
                        /><br/>
                        <textarea 
                            id={`${counter}-content`}
                            type="text"
                            value={this.state.contents[counter].content}
                            name="content"
                            onChange={this.handleChange}
                        />
                    </div>
                )
                counter++
            }

        })
        return output
    }

    
    render(){

        if(this.state.isLoading) {
            return (
                <img className="loading-gif" src={loadingGif} />
            )
        }

        return (
            <div id="dash-content-container">
                <span style={this.state.flashMessage ? this.state.flashMessage.success ? {color:"#1DB954"} : {color:"red"} : null }> {this.state.flashMessage ? this.state.flashMessage.message : null } </span>
                { this.renderContent() }
                <button onClick={this.onSubmit}> Save changes </button><br/>
            </div>
        )
    }
} 