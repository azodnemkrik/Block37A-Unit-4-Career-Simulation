const express = require("express")
const app = express.Router()
const {
    fetchItems,
    fetchSingleItem,
    fetchItemReviews,
    fetchSpecificReview,
} = require('../db/items')

const {
    createUser,
    authenticate
} = require('../db/users')

//define api routes here
// app.use('/users', require('../db/users'))


// CREATE
app.post('/auth/register', async (req,res,next) => {
    try {
        res.send(await createUser(req.body))
    } catch (error) {
        next(error)
    }
})

app.post('/auth/login' , async (req,res,next) => {
    try {
        const token = await authenticate(req.body)
        res.send(token)
    } catch (error) {
        next(error)
    }
})


// READ
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

app.get('/items/:itemId/reviews', async (req,res,next) => {
    try {
        res.send(await fetchItemReviews(req.params.itemId))
    } catch (error) {
        next(error)
    }
})

app.get('/items/:itemId/reviews/:reviewId', async (req,res,next) => {
    try {
        res.send(await fetchSpecificReview(req.params))
    } catch (error) {
        next(error)
    }
})

// UPDDATE
// DELETE



module.exports = app

/*
--POST /api/auth/register
-->POST /api/auth/login
GET /api/auth/me 🔒
 
--GET /api/items
--GET /api/items/:itemId
--GET /api/items/:itemId/reviews
--GET /api/items/:itemId/reviews/:reviewId

POST /api/items/:itemId/reviews 🔒
GET /api/reviews/me 🔒xw
PUT /api/users/:userId/reviews/:reviewId 🔒
DELETE /api/users/:userId/reviews/:reviewId 🔒
*/