const express = require('express')
const app = express.Router()
const { isLoggedIn } = require('./middleware')
const { fetchMyReviews } = require('../db/reviews')

app.get('/me', isLoggedIn, async(req,res,next)=> {
    try {
        res.send(await fetchMyReviews(req.user))
    } catch (error) {
        next(error)
    }
})


module.exports = app