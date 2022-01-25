const express=require('express');
const bodyParser= require('body-parser');
const bcrypt= require('bcrypt-nodejs');
const cors=require('cors');
const knex = require('knex');

const register=require('./controllers/register');
const signin=require('./controllers/signin');
const image=require('./controllers/image');
const profile=require('./controllers/profile');

const PORT= process.env.PORT

const db =knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    // port : 5432,
    user : 'qrault',
    password : '',
    database : 'smart-brain'
  }
});

const app=express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
	res.json('success');
})

app.post('/signin', (req, res) => signin.handleSignin(req, res, bcrypt, db))

app.post('/register', register.handleRegister(bcrypt, db))

app.get('/profile/:id', profile.handleProfile(db))

app.put('/image', image.handleImage(db))
app.post('/imageUrl', image.handleImageUrl)

app.listen(PORT, () => {
	console.log(`initialized server on port ${PORT}`)
})

console.log(process.env)