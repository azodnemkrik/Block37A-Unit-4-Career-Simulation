const express = require('express')
const app = express.Router()

const {
    fetchItems,
    fetchSingleItem,
} = require('../db/items')

const {
    fetchItemReviews,
    fetchSpecificReview
} = require('../db/reviews')

const { createReview } = require('../db/reviews')
const { isLoggedIn } = require('./middleware')

app.get('/', async (req, res, next) => {
    try {
        res.send(await fetchItems())
    } catch (error) {
        next(error)
    }
})

app.get('/:itemId', async (req, res, next) => {
    try {
        res.send(await fetchSingleItem(req.params.itemId))
    } catch (error) {
        next(error)
    }
})

app.get('/:itemId/reviews', async (req, res, next) => {
    try {
        res.send(await fetchItemReviews(req.params.itemId))
    } catch (error) {
        next(error)
    }
})

app.get('/:itemId/reviews/:reviewId', async (req, res, next) => {
    try {
        res.send(await fetchSpecificReview(req.params))
    } catch (error) {
        next(error)
    }
})


app.post('/:itemId/reviews', isLoggedIn, async (req, res, next) => {
    try {
        const review = {
            user_id: req.body.user_id,
            item_id: req.params.itemId,
            rating: req.body.rating
        }
        res.send(await createReview(review))
    } catch (error) {
        next(error)
    }
})
// review.user_id , review.item_id, review.rating


module.exports = app