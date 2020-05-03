const handleSignin = (db, dbUsers, bcrypt) => (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json('Entry cannot be blank');
  }
  db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash)
      if (isValid) {
        return dbUsers
        .where('email', '=', email)
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
