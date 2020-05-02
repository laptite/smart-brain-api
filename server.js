const express = require('express');
const bcrypt  = require('bcrypt');
const cors 		= require('cors');
const knex		= require('knex')

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : '',
    password : '',
    database : 'smart-brain'
  }
});

const database = {
	users: [
		{
			id: '123',
			name: "John",
			email: "john@gmail.com",
			entries: 0,
			joined: new Date()
		},
		{
			id: 124,
			name: "Sally",
			email: "sally@gmail.com",
			entries: 0,
			joined: new Date()
		}
	],
	signin: [
		{
			id: '987',
			hash: ''
		}
	]
}

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req,res) => {
	console.log('get home path')
	console.log('res:', res.json())
	// res.json(database.users)
})

app.get('/signout', (req,res) => {
	console.log('get signout')
	// res.json(database.users)
})

app.post('/register', (req, res) => {
	const { email, name, password } = req.body;
	const passwordHash = bcrypt.hashSync(password, 10);
	db.transaction(transaxn => 
		transaxn.insert({ hash: passwordHash, email: email })
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return transaxn('users')
				.returning('*')
				.insert({
					name: name,
					email: loginEmail[0],
					joined: new Date()
				})
				.then(user => res.json(user[0]))
		})
		.then(transaxn.commit)
		.catch(transaxn.rollback)
	)
	.catch(err => res.status(400).json('unable to register'));
})

app.post('/signin', (req, res) => {
	db.select('email', 'hash').from('login')
	.where('email', '=', req.body.email)
	.then(data => {
		const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
		if (isValid) {
			return db.select('*').from('users')
			.where('email', '=', req.body.email)
			.then(user => res.json(user[0]))
			.catch(err => res.status(400).json('Unable to find user'))
		} else {
			res.status(400).json('Invalid email and/or password')
		}
	})
	.catch(err => res.status(400).json('Unable to sign in'));
})

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	db.select('*').from('users').where({id})
		.then(user=> {
			if (user.length) {
				res.json(user[0])
			} else {
				res.status(400).json('Profile not found')
			}
		})
		.catch(err => {
			res.status(400).json('Error connecting to database');
		})
})

app.put('/image', (req, res) => {
	const { id } = req.body;
	const user = db('users').where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => res.json(entries))
	.catch(err => {
		res.status(400).json('Unable to update image count');
	})
})

app.listen(3000, () => {
	console.log('app is running on port 3000')
})
