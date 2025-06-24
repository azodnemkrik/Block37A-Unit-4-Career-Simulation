const client = require('./client')
const { v4 } = require('uuid')
const uuidv4 = v4

const createReview = async (review) => {

	// GENERATE SQL TO PASS
	const SQL = `
		INSERT INTO reviews
		(id, user_id, item_id, rating)
		VALUES
		($1, $2, $3, $4)
		RETURNING *
	`
	// GENERATE RESPONSE
	const response = await client.query(SQL , [ uuidv4() , review.user_id , review.item_id, review.rating ])
	return response.rows[0]
}

module.exports = {
    createReview
}