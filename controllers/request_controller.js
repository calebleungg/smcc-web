const Request = require('../models/Request')

const getRequests = (req, res) => {
    Request.find()
        .then(response => {
            console.log(response)
            res.send(response)
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
}

const createRequest = (req, res) => {
    const { firstName, lastName, email, phone, yearGraduated, country, address, passwordPref } = req.body

    let newRequest = new Request({ firstName, lastName, email, phone, yearGraduated, country, address, passwordPref })
    newRequest.save()
        .then(response =>{
            console.log(response)
            res.send(response)
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
}

const deleteRequest = (req, res) => {
    Request.findByIdAndDelete(req.params.id)
        .then(response => {
            console.log(response)
            res.send(response)
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
}

module.exports = { createRequest, getRequests, deleteRequest }