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

const fetchItemReviews = async (itemId) => {
	const SQL = `
		SELECT *
		FROM reviews
		WHERE item_id = $1
	`
	const response = await client.query(SQL, [itemId])
	return response.rows
}

const fetchSpecificReview = async (item) => {
	const SQL = `
		SELECT *
		FROM reviews
		WHERE item_id = $1
		AND id = $2
	`
	const response = await client.query(SQL, [item.itemId, item.reviewId])
	return response.rows[0]
}

const fetchMyReviews = async (user) => {
	const SQL = `
		SELECT *
		FROM reviews
		WHERE user_id = $1
	`
	const response = await client.query(SQL, [user.id])
	return response.rows

}

const editMySingleReview = async (review) => {
	const SQL = `
		UPDATE reviews
		SET rating = $1
		WHERE id = $2
		RETURNING *
	`
	const response = await client.query(SQL , [ review.rating , review.id])
	return response.rows[0]
} 

module.exports = {
    createReview,
	fetchItemReviews,
	fetchSpecificReview,
	fetchMyReviews,
	editMySingleReview
}