const express = require('express')
const app = express.Router()
const { isLoggedIn } = require('./middleware')

app.get('/me', isLoggedIn, async(req,res,next)=> {
    try {
        res.send(await fetchSpecificReview(req.params.itemId))
    } catch (error) {
        next(error)
    }
})


module.exports = app