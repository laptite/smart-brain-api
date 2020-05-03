const handleProfile = (dbUsers) => (req, res) => {
  const { id } = req.params;
  dbUsers.where({id})
    .then(user => {
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(400).json('Profile not found')
      }
    })
    .catch(err => {
      res.status(400).json('Error connecting to database');
    })
}

module.exports = {
  handleProfile: handleProfile
}
