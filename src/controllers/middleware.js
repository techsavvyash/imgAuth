const Users = require('../config/db.js').Users
const jwt = require('jsonwebtoken')
require('dotenv').config() ;
const path = require('path')

function checkCredentials(req, res, next) {
    const {username, pwd} = req.body 
    if(!username || !pwd) {
      res.send({status: false, message: "invalid credentials"}) ;
      return ;
    } else {
      const password = pwd.split(',')
      let check = password.every(val => !isNaN(val))
      if(!check || password.length < 16) {
        res.send({status: false, message: "invalid credentials"});
        return ;
      } else if(check && password.length >= 16) {
        check = password.every((val, i) => ((i&1) ? parseFloat(val) <= 768 && parseFloat(val) >= 0 : parseFloat(val) <= 1024 && parseFloat(val) >= 0))
        if(!check) {
          res.send({status: false, message: "invalid credentials!"});
          return ;
        }
      }
    }
    req.user = username ;
    next() ;
}
  
async function findUser(req, res, next) {
  const username = req.user ;
  try {
    if(username == null) {
      req.user = null ;
    } else {
      const user = await Users.findOne({ where: {username}})
      req.user = user ;
    }
    next() ;
  } catch(err) {
    console.log(err)
    res.send({status: false, message: err}) ;
    return ;
  }
}
  
function checkToken(req, res, next) {
  req.user = null ;
  const token = req.session.token ;
  if(token == null) {
    res.user = null ;
    
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if(err || user == null) {
      req.user = null ;
    } else {
      req.user = user.username ;
    }
    
  });
  next()
}

function verifyToken(req, res, next) {
  const id = req.params.id ;
  req.user = null ;
  jwt.verify(token, process.env.FORGOT_JWT_SECRET, (err, user) => {
    if(err || user == null) {
      req.user = null ;
      res.send({status: false, message: "your url probably expired, or some error occured, please try again!"});
    } else {
      req.user = user.username ;
    }
  });
  next() ;
}

module.exports = {
    checkCredentials, checkToken, findUser, verifyToken
}