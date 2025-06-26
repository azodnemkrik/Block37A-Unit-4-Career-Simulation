const express = require('express')
const app = express.Router()
const { findUserByToken } = require('../db/auth')

const isLoggedIn = async(req,res,next) => {
    try {
        // create user object
        const user = await findUserByToken(req.headers.authorization)
        // Create a "user" property in the req.
        // Remember req IS AN OBJECT and you can
        // declare properties easily in JS
        req.user = user
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = {
    isLoggedIn
}