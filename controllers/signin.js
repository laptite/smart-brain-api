const handleSignin = (db, dbUsers, bcrypt) => (req, res) => {
  db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
      if (isValid) {
        return dbUsers
        .where('email', '=', req.body.email)
        .then(user => res.json(user[0]))
        .catch(err => res.status(400).json('Unable to find user'))
      } else {
        res.status(400).json('Invalid email and/or password');
      }
    })
    .catch(err => res.status(400).json('Unable to sign in'));
}

module.exports = { 
  handleSignin: handleSignin
};
