const express = require('express')
const app = express.Router()
const { isLoggedIn } = require('./middleware')
const { editMySingleReview } = require('../db/reviews')

app.put('/:userId/reviews/:reviewId', isLoggedIn, async(req,res,next)=> {
    try {
        res.send(await editMySingleReview(req.params))
    } catch (error) {
        next(error)
    }
})

module.exports = app