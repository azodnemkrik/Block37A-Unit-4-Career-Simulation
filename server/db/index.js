const client = require('./client')
const bcrypt = require('bcrypt')
const { v4 } = require('uuid')
const uuidv4 = v4

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
	const response = await client.query(SQL, [uuidv4() , user.username , user.password , user.is_admin ])
	return response.rows[0]
}


const seed = async () => {
	// console.log("add logic to create and seed tables")
	const SQL = `
		DROP TABLE IF EXISTS reviews;
		DROP TABLE IF EXISTS items;
		DROP TABLE IF EXISTS users;
		CREATE TABLE users(
			id UUID PRIMARY KEY,
			username VARCHAR(100) UNIQUE NOT NULL,
			password VARCHAR(100) NOT NULL,
			is_admin BOOLEAN DEFAULT false NOT NULL
		);
		CREATE TABLE items(
			id UUID PRIMARY KEY,
			name VARCHAR(100) UNIQUE NOT NULL,
			description VARCHAR(100) NOT NULL
		);
		CREATE TABLE reviews(
			id UUID PRIMARY KEY,
			user_id UUID REFERENCES users(id) NOT NULL,
			item_id UUID REFERENCES items(id) NOT NULL,
			review VARCHAR(200) NOT NULL
		);
	`
	await client.query(SQL)
	console.log("Created tables")
	
	// CREATE STARTER USERS
	const [kirk, kathy, mae, devin, haleigh] = await Promise.all([
		createUser({ username: 'Kirk', password:'1111', is_admin: true}),
		createUser({ username: 'Kathy', password:'1111', is_admin: false}),
		createUser({ username: 'Mae', password:'1111', is_admin: false}),
		createUser({ username: 'Devin', password:'1111', is_admin: false}),
		createUser({ username: 'Haleigh', password:'1111', is_admin: false})
	])

};



module.exports = {
	client,
	seed
};
