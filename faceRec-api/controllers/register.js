const handleRegister =(req, resp, db, bcrypt) => {
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password, 10);
  
    // A transaction
    db.transaction((trx) => {
      return trx
        .insert({
          hash: hash,
          email: email,
        })
        .into("login")
        .returning("email")
        .then((loginEmail) => {
          return trx("users")
            .returning("*")
            .insert({
              email: loginEmail[0],
              name: name,
              joined: new Date(),
            })
            .then((user) => {
              resp.json(user[0]);
            });
        })
        .then(trx.comit)
        .catch(trx.rollback);
    }).catch((err) =>
      resp
        .status(400)
        .json(
          "Sorry we are unable to register that user.. please try another name and email address"
        )
    );
  }
  module.exports = {
      handleRegister: handleRegister
  }