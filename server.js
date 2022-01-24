const express=require('express');
const bodyParser= require('body-parser');
const bcrypt= require('bcrypt-nodejs');
const cors=require('cors');
const knex = require('knex');

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

app.post('/signin', (req, res) => {
	const {email, name, password} =req.body;
	db('login').where({email})
	.then(login => {
		const isValid=bcrypt.compareSync(password, login[0].hash);
		if (isValid) {
			return db('users').where({email})
			.then(user => {res.json(user[0])})
		} else {
			return res.status(400).json('no such user');
		}
	})


	.catch(err => res.status(400).json('unable to login'))
})

app.post('/register', (req, res) => {
	const {email, name, password} =req.body;
	const hash = bcrypt.hashSync(password);
	db.transaction(trx => {
		trx.insert({
			hash : hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users')
				.returning('*')
				.insert({
					name: name,
					email: loginEmail[0].email,
					joined : new Date()
				})
				.then(user => {
					res.json(user[0]);
				})			
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(err => res.status(400).json('unable to register'))
})

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	db
	.select('*').from('users').where({id})
		.then(user => {
			if (user.length) {
				res.json(user[0]);				
			} else {
				res.status(400).json('unable to find profile');	
			}
		})
		.catch(err => res.status(400).json('error getting profile'))
})

app.put('/image', (req,res)=> {
	const { id } = req.body;
	db('users')
		.returning('*')
		.where({id})
		.increment('entries',1)
		.then(entries => {
			res.json(entries[0].entries)
		})
		.catch(err => res.status(400).json('unable to get entries'))
})

app.listen(3001, () => {
	console.log('initialized server on port 3001')
})