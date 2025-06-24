const express = require("express")
const app = express.Router()
const {
    fetchItems,
    fetchSingleItem
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

app.get('/items/:itemId', async (req,res,next) => {
    try {
        res.send(await fetchSingleItem(req.params.itemId))
    } catch (error) {
        next(error)
    }
})







module.exports = app

/*
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me 🔒
 
--GET /api/items
--GET /api/items/:itemId
GET /api/items/:itemId/reviews
GET /api/items/:itemId/reviews/:reviewId

POST /api/items/:itemId/reviews 🔒
GET /api/reviews/me 🔒xw
PUT /api/users/:userId/reviews/:reviewId 🔒
DELETE /api/users/:userId/reviews/:reviewId 🔒
*/