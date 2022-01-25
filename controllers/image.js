const Clarifai= require('clarifai');

const app = new Clarifai.App({
 apiKey: '1946c7b64ee7412197d89a5952179c2c'
});

const handleImageUrl= (req, res) => {
	const { input } = req.body;
	app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL,
      input)
    .then(data => {
    	res.json(data);
    })
    .catch(err => res.status(400).json('unable to clarifai the picture'))
}

const handleImage = (db) => (req, res) => {
	const { id } = req.body;
	db('users')
		.returning('*')
		.where({id})
		.increment('entries',1)
		.then(entries => {
			res.json(entries[0].entries)
		})
		.catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
	handleImage, 
	handleImageUrl
}