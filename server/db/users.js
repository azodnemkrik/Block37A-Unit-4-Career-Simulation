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
	// Hash the password so it's hidden in the DB
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

module.exports = {
    createUser
}