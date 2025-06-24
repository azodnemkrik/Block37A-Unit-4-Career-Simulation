const express = require("express")
const app = express.Router()
const {
    fetchItems
} = require('../db/items')

//define api routes here
// app.use('/users', require('../db/users'))


// CREATE
// READ
// UPDDATE
// DELETE
app.get('/items', async (req,res,next) => {
    try {
        res.send(await fetchItems())
    } catch (error) {
        next(error)
    }
})






module.exports = app