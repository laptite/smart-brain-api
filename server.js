const { parse, stringify } = require('flatted/cjs');
const express  = require('express');
const bcrypt   = require('bcrypt');
const cors 		 = require('cors');
const knex		 = require('knex');
const register = require('./controllers/register');
const app      = express();

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : '',
    password : '',
    database : 'smart-brain'
  }
});
const dbUsers = db.select('*').from('users');

app.use(cors());
app.use(express.json());

app.get('/', (req,res) => {
	// console.log(res.send(stringify(dbUsers)));
	console.log(stringify(dbUsers));
});

app.get('/signout', (req,res) => console.log(res.json(dbUsers)));

app.post('/register', (req, res) => { 
	register.handleRegister(req, res, db, bcrypt);
})

app.post('/signin', (req, res) => {
	db.select('email', 'hash').from('login')
	.where('email', '=', req.body.email)
	.then(data => {
		const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
		if (isValid) {
			return dbUsers
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
