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



// CREATE REVIEW
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
			description VARCHAR(1000) NOT NULL
		);
		CREATE TABLE reviews(
			id UUID PRIMARY KEY,
			user_id UUID REFERENCES users(id) NOT NULL,
			item_id UUID REFERENCES items(id) NOT NULL,
			rating INTEGER DEFAULT 3 NOT NULL,
			CONSTRAINT no_duplicate_items_per_user UNIQUE(user_id, item_id)
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
		
	// CREATE STARTER ITEMS
	const [r2d2, landspeeder, walle, falcon, voltron, razorcrest, atat] = await Promise.all([
		createItem({ name: 'LEGO R2-D2 #75308', description:'Relive classic Star Wars™ moments as you build this exceptionally detailed R2-D2 LEGO® droid figure. The brilliant new-for-May-2021 design is packed with authentic details, including a retractable mid-leg, rotating head, opening and extendable front hatches, a periscope that can be pulled up and turned, and Luke Skywalker\'s lightsaber hidden in a compartment in the head.' }),
		createItem({ name: 'LEGO Luke Skywalker\'s Landspeeder #75341', description:'Be transported to the desert planet of Tatooine as you build the first-ever LEGO® Star Wars™ Ultimate Collector Series version of Luke Skywalker\'s Landspeeder (75341). Use new building techniques and custom-made LEGO elements to recreate this iconic vehicle in intricate detail. From the cockpit windscreen to the turbine engine missing its cover, it has everything you remember from Star Wars: A New Hope.' }),
		createItem({ name: 'LEGO Ideas WALL•E #21303', description:'Build a beautifully detailed LEGO® version of WALL•E—the last robot left on Earth! Created by Angus MacLane, an animator and director at Pixar Animation Studios, and selected by LEGO Ideas members, the development of this model began alongside the making of the lovable animated character for the classic Pixar feature film.' }),
		createItem({ name: 'LEGO Millenium Falcon #75192', description:'Welcome to the largest, most detailed LEGO® Star Wars Millennium Falcon model we\'ve ever created—in fact, with 7,500 pieces it\'s one of our biggest LEGO models, period! This amazing LEGO interpretation of Han Solo\'s unforgettable Corellian freighter has all the details that Star Wars fans of any age could wish for, including intricate exterior detailing, upper and lower quad laser cannons, landing legs, lowering boarding ramp and a 4-minifigure cockpit with detachable canopy. Remove individual hull plates to reveal the highly detailed main hold, rear compartment and gunnery station.' }),
		createItem({ name: 'LEGO Voltron #21311', description:'It\'s time to defend the universe so get ready to form LEGO® Ideas 21311 Voltron, the biggest buildable LEGO mech ever! This awesome set features buildable and highly posable black, blue, yellow, red and green lions with specially designed, extra-strong joints to combine them all and create the Voltron super robot, plus a huge sword and shield that attach firmly to Voltron\'s hands.' }),
		createItem({ name: 'LEGO Razor Crest #75331', description:'Imagine life as a galactic bounty hunter as you build and display a LEGO® Star Wars™ Ultimate Collector Series version of The Razor Crest (75331) starship. Measuring over 28 in. (72 cm) long, it is packed with authentic details that reference memorable Star Wars: The Mandalorian moments.' }),
		createItem({ name: 'LEGO AT-AT #75313', description:'This is the AT-AT (75313) that every LEGO® Star Wars™ fan has been waiting for. This epic Ultimate Collector Series build-and-display model features posable legs and head, cannons with a realistic recoil action, rotating cannons, bomb-drop hatch and a hook to attach to Luke Skywalker\'s line, just like in the Battle of Hoth.' })
	])

	// CREATE START REVIEWS
	const [] = await Promise.all([
		createReview({ user_id: kirk.id, item_id:r2d2.id, rating: 2}),
		createReview({ user_id: kirk.id, item_id:voltron.id, rating: 4}),
		createReview({ user_id: kirk.id, item_id:falcon.id, rating: 5}),
		createReview({ user_id: kirk.id, item_id:razorcrest.id, rating: 5}),
		createReview({ user_id: kathy.id, item_id:walle.id, rating: 4}),
		createReview({ user_id: kathy.id, item_id:landspeeder.id, rating: 3}),
		createReview({ user_id: devin.id, item_id:falcon.id, rating: 4}),
		createReview({ user_id: devin.id, item_id:atat.id, rating: 4}),
		createReview({ user_id: mae.id, item_id:voltron.id, rating: 5}),
		createReview({ user_id: mae.id, item_id:walle.id, rating: 5}),
		createReview({ user_id: mae.id, item_id:r2d2.id, rating: 4}),
		createReview({ user_id: haleigh.id, item_id:walle.id, rating: 5}),
	])
		/*
			id UUID PRIMARY KEY,
			user_id UUID REFERENCES users(id) NOT NULL,
			item_id UUID REFERENCES items(id) NOT NULL,
			rating INTEGER DEFAULT 3 NOT NULL,
		*/ 

};



module.exports = {
	client,
	seed
};
