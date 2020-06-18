import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'

export default class DashboardEvents extends Component {

    state = {
        events: [],
        newEventDate: '',
        newEventTime: '',
        newEventName: '',
        newEventDescription: '',
        updateEvents: false
    }

    componentDidMount() {
        this.getApiEvents()
    }

    componentDidUpdate() {
        if (this.state.updateEvents) {
            this.setState({
                newEventDate: '',
                newEventTime: '',
                newEventName: '',
                newEventDescription: '',
                updateEvents: false
            })
            this.getApiEvents()
        }
    }

    getApiEvents = () => {
        axios.get('/api/events')
            .then(response => {
                this.setState({
                    events: response.data
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

    renderEventList = () => {
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
                    <i class="fas fa-times-circle" onClick={() => this.deleteEvent(event)} ></i>
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

    onCreateEvent = () => {
        console.log(this.state)
        const req = {
            name: this.state.newEventName,
            date: this.state.newEventDate,
            time: this.state.newEventTime,
            description: this.state.newEventDescription
        }
        axios.post('/api/events/create', req)
            .then(response => {
                if(response.status === 200) {
                    this.setState({
                        updateEvents: true
                    })
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    deleteEvent = (event) => {
        axios.delete(`/api/events/delete/${event._id}`)
            .then(response => {
                if(response.status === 200) {
                    this.setState({
                        updateEvents: true
                    })
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    
    render(){

        return (
            <div id="dash-event-container" > 
                <div id="dash-left-col">
                    <div id="create-event-div">
                        <p> Create Event </p><br/>
                        <span> Date </span><br/>
                        <input 
                            className="small-input" 
                            onChange={this.handleChange} 
                            name="newEventDate" 
                            type="date" 
                            value={this.state.newEventDate}
                            style={{marginRight: "5px"}}
                        /> 
                        <input 
                            className="small-input" 
                            onChange={this.handleChange} 
                            name="newEventTime"  
                            value={this.state.newEventTime}
                            type="time" 
                        /><br/>
                        <span> Name </span><br/>
                        <input 
                            type="text" 
                            onChange={this.handleChange} 
                            name="newEventName" 
                            value={this.state.newEventName}
                            placeholder="Enter event name" 
                        /><br/>
                        <span> Description </span><br/>
                        <textarea 
                            type="text" 
                            onChange={this.handleChange} 
                            name="newEventDescription"  
                            value={this.state.newEventDescription}
                            placeholder="Enter event description" 
                        /><br/>
                        <button onClick={this.onCreateEvent} > Create </button>
                    </div>
                </div>
                <div id="dash-right-col">
                    <p> Event List </p>
                    {this.renderEventList()}
                </div>
            </div>
        )
    }
} 