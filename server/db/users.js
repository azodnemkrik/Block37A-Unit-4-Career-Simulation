const client = require('./client')
const bcrypt = require('bcrypt')
const { v4 } = require('uuid')
const uuidv4 = v4
const jwt = require('jsonwebtoken')

// CREATE USER
const createUser = async (user) => {
	// Check for spaces in username
	if(!user.username.trim()){
		throw Error ('Must have a valid username')
	}
	// Check for spaces in password
	if(!user.password.trim()){
		throw Error ('Must have a valid password]')
	}
	// Hash the password so it\'s hidden in the DB
	user.password = await bcrypt.hash(user.password, 6)

	// GENERATE SQL TO PASS
	const SQL = `
		INSERT INTO users
		(id, username, password, is_admin)
		VALUES
		($1, $2, $3, $4)
		RETURNING *
	`
	// GENERATE RESPONSE
	const response = await client.query(SQL, [ uuidv4() , user.username , user.password , user.is_admin ])
	return response.rows[0]
}

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

module.exports = {
    createUser,
    authenticate
}