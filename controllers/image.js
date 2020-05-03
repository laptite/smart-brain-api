const Clarifai = require('clarifai');
const app = new Clarifai.App({
  apiKey: '3ebad0c372e84c7bb1fe70a8642e2094'
});

const handleApiCall = () => (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => res.json(data))
    .catch(err => {
      res.status(400).json('Unable to connect to API');
    })
}

const handleImage = (db) => (req, res) => {
  const { id } = req.body;
  const user = db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => res.json(entries))
  .catch(err => {
    res.status(400).json('Unable to update image count');
  })
}

module.exports = {
  handleImage: handleImage,
  handleApiCall: handleApiCall
}
