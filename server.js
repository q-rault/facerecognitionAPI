const express=require('express');
const bodyParser= require('body-parser');
const bcrypt= require('bcrypt-nodejs');
const cors=require('cors');

const app=express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());

const extractedDatabase= {
	users: [
		{
			id: '123',
			name: 'John',
			email: 'john@gmail.com',
			password: 'ilovecookies',
			entries: 0,
			joined : new Date()
		},
		{
			id: '124',
			name: 'Sally',
			email: 'sally@gmail.com',
			password: 'bananas',
			entries: 0,
			joined : new Date()
		},		
	]
}


app.get('/', (req, res) => {
	res.send(extractedDatabase.users)
})

app.post('/signin', (req, res) => {
	const {email, name, password} =req.body;
	// Load hash from your password DB.
	// let ilovecookies_hash='$2a$10$zW1l1tGlzkBk5Sg96P3ps.uGmk49ShXXayBQ277.Suv/TCIR4VG.W';
	// bcrypt.compare('ilovecookies', ilovecookies_hash, function(err, res) {
	//     console.log(res);// res == true
	// });
	// bcrypt.compare("veggies", ilovecookies_hash, function(err, res) {
	//     console.log(res);// res = false
	// });
	// res.send('signin post');
	console.log(email, password)
	if (email===extractedDatabase.users[0].email && 
		password ===extractedDatabase.users[0].password) {
			res.json(extractedDatabase.users[0]);
	} else {
		res.status(400).json('error logging in');
	}
})

app.post('/register', (req, res) => {
	const {email, name, password} =req.body;
	// bcrypt.hash('ilovecookies', null, null, function(err, hash) {
	//     console.log(hash);
	//     // Store hash in your password DB.
	// })
	extractedDatabase.users.push({
		id: '125',
		name: name,
		email: email,
		// password: password,
		entries: 0,
		joined : new Date()
	})
	// res.send('signin post');
	console.log(extractedDatabase.users[extractedDatabase.users.length-1]);
	res.json(extractedDatabase.users[extractedDatabase.users.length-1]);
})

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	let found= false;
	extractedDatabase.users.forEach(user => {
		if (user.id===id) {
			found=true
			return res.json(user);
		}
	})
	if (!found) {
		res.status(400).json('profile not found')
	}
})

app.put('/image', (req,res)=> {
	const { id } = req.body;
	let found= false;
	extractedDatabase.users.forEach(user => {
		if (user.id===id) {
			found=true
			user.entries++;
			return res.json(user.entries);
		}
	})
	if (!found) {
		res.status(400).json('no such user')
	}
})





app.listen(3001, () => {
	console.log('initialized server on port 3001')
})