const client = require('./client')
const { v4 } = require('uuid')
const uuidv4 = v4

// CREATE ITEM
const createItem = async (item) => {
	// Check for spaces in itemname
	if(!item.name.trim()){
		throw Error ('Must have a valid item name')
	}

	// GENERATE SQL TO PASS
	const SQL = `
		INSERT INTO items
		(id, name, description)
		VALUES
		($1, $2, $3)
		RETURNING *
	`
	// GENERATE RESPONSE
	const response = await client.query(SQL , [ uuidv4() , item.name , item.description ])
	return response.rows[0]
}

// READ ITEM
const fetchItems = async () => {
	const SQL = `
		SELECT *
		FROM items
	`
	const response = await client.query(SQL)
	return response.rows
}

module.exports = {
    createItem,
	fetchItems
}

