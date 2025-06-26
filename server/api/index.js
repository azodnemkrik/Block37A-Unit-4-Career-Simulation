const express = require("express")
const app = express.Router()

//define api routes here
app.use('/users', require('./users'))
app.use('/items', require('./items'))
app.use('/reviews', require('./reviews'))
app.use('/auth', require('./auth'))

module.exports = app

/*
--POST /api/auth/register
--POST /api/auth/login
--GET /api/auth/me 🔒
 
--GET /api/items
--GET /api/items/:itemId
--GET /api/items/:itemId/reviews
--GET /api/items/:itemId/reviews/:reviewId

--POST /api/items/:itemId/reviews 🔒
-->GET /api/reviews/me 🔒
PUT /api/users/:userId/reviews/:reviewId 🔒
DELETE /api/users/:userId/reviews/:reviewId 🔒
*/