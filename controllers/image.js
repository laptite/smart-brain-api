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
  handleImage: handleImage
}
