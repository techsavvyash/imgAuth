const Users = require("../config/db.js").Users
const { fail } = require("assert")
const path = require('path')
const generateJWT = require('../util/utils').generateJWT
const sendEmail = require('../util/utils').sendEmail
const validateEmail = require('../util/utils').validateEmail

exports.getChange = (req, res) => {
    if(req.user == null) {
      res.redirect('/login')
      return ;
    }
  
    res.sendFile(path.join(__dirname, '../../public/pages/change.html'))
}

exports.postChange = async (req, res, next) => {
    if(req.user == null) {
      res.redirect('/login')
      return ;
    }

    const {username, pwd} = req.body ;
    if(username !== req.user.username) {
      res.send({status: false, message: "Invalid credentials, make sure you have entered the correct email and included enough points!"})
    }
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


exports.postForget = async (req, res) => {
  const {username} = req.body ;
  if(!username || !validateEmail(username)) {
    res.send({status: false, message: "invalid email"}) ;
    return ;
  }

  const user = await Users.findOne({where: {username}}) ;
  if(user == null) {
    res.send({status: false, message: "invalid email"}) ;
    return ;
  }

  const resetId = generateJWT(user.username) ;
  
  try {
    await sendEmail({
      to: user.username,
      subject: "IMGAuth: Password Retrieval OTP",
      text: `Follow this link to change your password https://morning-lake-28894.herokuapp.com//change/${resetId}`
    })
    res.send({status: true, message: "An email has been sent to your registered email, kindly follow the steps to reset your password"});
    return ;
  } catch(err) {
    console.log(err);
    res.send({status: false, message: "Please try again, some error occured!"});
  }
}