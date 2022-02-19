const Users = require("../config/db.js").Users
const path = require('path')
const generateJWT = require('../util/generateJWT').generateJWT


exports.getChange = (req, res) => {
    if(req.user == null) {
      res.redirect('/login')
      return ;
    }
  
    res.sendFile(path.join(__dirname, '../public/pages/change.html'))
}

exports.postChange = async (req, res, next) => {
    if(req.user == null) {
      res.redirect('/login')
      return ;
    }
  
    const {username, pwd} = req.body ;
    
    try {
      await Users.update({
        pwd: pwd.toString()
      }, {where: {username: req.user.username}});
      req.session.token = '' ;
      res.send({status: true, message: "The password has been updated, kindly login again!"});
    } catch(err) {
      console.log(err) ;
      res.send({status: false, message: "Some error occured!"}) ;
    }
}