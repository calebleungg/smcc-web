const PageContent = require('../models/PageContent')

const getContent = (req, res) => {

    PageContent.find()
        .then(sections => {
            res.send(sections)
        })
        .catch(err => res.send(err))

}


const addContent = (req, res) => {
    const{ name, content } = req.body
    let newContent = new PageContent({name, content})
    newContent.save()
        .then(response => {
            console.log(response)
            res.send('succesfully added content')
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
}


const updateContent = (req, res) => {
    const { content } = req.body
    for (let section of content) {
        PageContent.findByIdAndUpdate(section._id, {name: section.name, content: section.content}, {new: true})
            .then(response => {
                console.log(response)
                res.send(response)
            })
            .catch(err => {
                console.log(err)
                res.send(err)
            })
    }
}

module.exports = { addContent, getContent, updateContent }