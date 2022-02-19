const Users = require("../config/db.js").Users
const generateJWT = require("../util/generateJWT.js").generateJWT
const path = require('path')

exports.getRegister = (req, res) => {
    if(req.user == null) res.sendFile(path.join(__dirname, '../../public/pages/register.html'))
    else res.redirect('/success')
}

exports.postRegister = async (req, res) => {
    if(req.user != null) {
      // case when the username is already taken
      console.log(req.user)
      res.send({staus: false, message: "User already exists, kindly login!"});
      return ;
    }
    // else all the discrepencies in the credentials have already been taken care of
    // by the checkCredentials middleware so we just create a user and log him in
    try {
      const user = await Users.create({username: req.body.username, pwd: req.body.pwd}) ;
      console.log(user.username)
      req.session.token = generateJWT(user.username);
      res.send({status: true, message: "user created successfully and you have been logged in!"});
    } catch(err) {
      console.log(err);
      res.send({status: false, message: err}) ;
    }
  }