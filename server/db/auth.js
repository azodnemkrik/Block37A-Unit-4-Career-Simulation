const client = require('./client')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const authenticate = async (credentials) => {
    // Make call to DB to check credentials (username & password)
    const SQL = `
        SELECT id, password
        FROM users
        WHERE username = $1
    `
    // Check if user is a member first
    const response = await client.query(SQL, [credentials.username])
    if(!response.rows.length) {
        const error = Error ("No such user registered.")
        error.status = 401
        throw error
    }

    // bcrypt.compare() submitted password with password in DB
    const valid = await bcrypt.compare(credentials.password, response.rows[0].password)
    if(!valid) {
        const error = Error("Incorrect Password.")
        error.status = 401
        throw error
    }

    // If username & password are a match, reward token
    const token = await jwt.sign({id: response.rows[0].id}, process.env.JWT)
    console.log('SUCCESS - Token awarded:\n', token)
    return { token }

}

const findUserByToken = async (token) => {
    try {
        // const payload = await
    } catch (error) {
        
    }
}

module.exports = {
    authenticate,
    findUserByToken
}