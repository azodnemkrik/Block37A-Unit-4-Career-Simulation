const express = require('express')
const app = express.Router()
const {
    fetchItems,
    fetchSingleItem,
    fetchItemReviews,
    fetchSpecificReview,
} = require('../db/items')

app.get('/', async (req,res,next) => {
    try {
        res.send(await fetchItems())
    } catch (error) {
        next(error)
    }
})

app.get('/:itemId', async (req,res,next) => {
    try {
        res.send(await fetchSingleItem(req.params.itemId))
    } catch (error) {
        next(error)
    }
})

app.get('/:itemId/reviews', async (req,res,next) => {
    try {
        res.send(await fetchItemReviews(req.params.itemId))
    } catch (error) {
        next(error)
    }
})

app.get('/:itemId/reviews/:reviewId', async (req,res,next) => {
    try {
        res.send(await fetchSpecificReview(req.params))
    } catch (error) {
        next(error)
    }
})


module.exports = app