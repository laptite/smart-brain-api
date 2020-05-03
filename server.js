const { parse, stringify } = require('flatted/cjs');
const express  = require('express');
const bcrypt   = require('bcrypt');
const cors 		 = require('cors');
const knex		 = require('knex');
const register = require('./controllers/register');
const signin   = require('./controllers/signin');
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
	dbUsers.then( data => res.send(data));
});

app.post('/register', (req, res) => { 
	register.handleRegister(req, res, db, bcrypt);
})

app.post('/signin', (req, res) => {
	signin.handleSignin(req, res, db, bcrypt);
})

app.get('/signout', (req,res) => {
	dbUsers.then( data => res.json(data));
});

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
