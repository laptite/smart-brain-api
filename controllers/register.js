const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
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
    })
    .then(transaxn.commit)
    .catch(transaxn.rollback)
  )
  .catch(err => res.status(400).json('unable to register'));
}

module.exports = { 
  handleRegister: handleRegister
};