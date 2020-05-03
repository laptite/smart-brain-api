const { parse, stringify } = require('flatted/cjs');
const express  = require('express');
const bcrypt   = require('bcrypt');
const cors 		 = require('cors');
const knex		 = require('knex');
const register = require('./controllers/register');
const signin   = require('./controllers/signin');
const profile  = require('./controllers/profile');
const image    = require('./controllers/image');
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
	signin.handleSignin(req, res, db, dbUsers, bcrypt);
})

app.get('/signout', (req,res) => {
	dbUsers.then( data => res.json(data));
});

app.get('/profile/:id', (req, res) => {
	profile.handleProfile(req, res, dbUsers);
})

app.put('/image', (req, res) => {
	image.handleImage(req, res, db);
})

app.listen(3000, () => {
	console.log('app is running on port 3000')
})
