const handleRegister = (db, bcrypt) => (req, res) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json('Entry cannot be blank');
  }
  const passwordHash = bcrypt.hashSync(password, 10);
  db.transaction(transaxn => 
    transaxn.insert({ hash: passwordHash, email: email })
    .into('login')
    .returning('email')
    .then(loginEmail => {
      return transaxn('users')
        .returning('*')
        .insert({
          name: name,
          email: loginEmail[0],
          joined: new Date()
        })
        .then(user => res.json(user[0]))
        .catch(err => res.status(400).json('unable to add user'))
    })
    .then(transaxn.commit)
    .catch(transaxn.rollback)
  )
  .catch(err => res.status(400).json('unable to register'));
}

module.exports = { 
  handleRegister: handleRegister
};
