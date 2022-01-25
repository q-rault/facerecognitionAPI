const handleSignin = (req, res, bcrypt, db) => {
	const {email, password} =req.body;
	
	if (!email || !password) {
		return res.status(400).json('no fill must be blank');
	}

	db('login').where({email})
	.then(login => {
		const isValid=bcrypt.compareSync(password, login[0].hash);
		if (isValid) {
			return db('users').where({email})
			.then(user => {res.json(user[0])})
			.catch(console.log)
		} else {
			return res.status(400).json('no such user');
		}
	})


	.catch(err => res.status(400).json('unable to login'))
}

module.exports = {
	handleSignin
}