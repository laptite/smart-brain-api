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
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});
const dbUsers = db.select('*').from('users');

app.use(cors());
app.use(express.json());

app.get('/', (req,res) => dbUsers.then(data => res.send(data)));

app.post('/register', register.handleRegister(db, bcrypt));

app.post('/signin', signin.handleSignin(db, dbUsers, bcrypt));

app.get('/signout', (req,res) => {
	dbUsers.then( data => res.json(data));
});

app.get('/profile/:id', profile.handleProfile(dbUsers));

app.put('/image', image.handleImage(db));
app.post('/imageurl', image.handleApiCall());

app.listen(process.env.PORT || 3000, () => {
	console.log(`app is running on port ${process.env.PORT}`)
})
