const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const session = require('express-session')
require('dotenv').config() ;
const { db, Users } = require('./db.js')

function generateJWT(username) {
  //the jwt contains the username and expires in 5 minutes
  return jwt.sign(username, process.env.JWT_SECRET, /*{ expiresIn: 5*60*1000} */) ;
}

// middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/', express.static(__dirname + '/public'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  resave: true
}))

async function checkCredentials(req, res, next) {
  const {username, pwd} = req.body 
  if(!username || !pwd) {
    res.send({status: false, message: "invalid credentials"}) ;
    return ;
  }
  try {
    const user = await Users.findOne({ where: {username}})
    req.user = user ;
    next() ;
  } catch(err) {
    res.send({status: false, message: err}) ;
    return ;
  }
}


app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/pages/login.html')
})

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/pages/register.html')
})

//login route
app.post('/login', async (req, res) => {
  const { username, pwd } = req.body 
  
  if(!username || !pwd) {
    res.send({status: false, message: "invalid credentials"}) ;
  } else {
    try {
      const user = await Users.findOne({ where: { username: username}})
      if(user == null) {
        res.send({status: false, message: "invalid credentials"}) ;
      } else {
        const enteredPwd = pwd.split(',') ;
        const userPwd = user.pwd.split(',') ;
        if(enteredPwd.length !== userPwd.length) {
          res.send({status: false, message: "invalid credentials"}) ;
        } else {
          let isAMatch = true ;
          for(let i = 0;i < enteredPwd.length; i++) {
            if(!(enteredPwd[i] <= (userPwd[i] + 10) && enteredPwd[i] >= (userPwd[i] - 10))) {
              isAMatch = false ;
              break ;
            }
          }

          if(!isAMatch) {
            res.send({status: false, message: "invalid credentials"})
          } else {
            req.session.token = generateJWT(user.username) ;
            res.send({status: true, message: "login succesful"})
          }
        }
      } 
    } catch(err) {
      res.send({status: false, message: err})
    }
  } 
});


//register route
app.post('/register', checkCredentials, async (req, res) => {
  if(req.user) {
    res.send({staus: false, message: "User already exists, kindly login!"});
    return ;
  }

  const pwd = req.body.pwd.split(',') ;
  let check = pwd.every(val => !isNaN(val))

  if(check || pwd.length < 16) {
    check = pwd.every((val, i) => ((i&1) ? parseFloat(val) <= 768 && parseFloat(val) >= 0 : parseFloat(val) <= 1024 && parseFloat(val) >= 0))
    if(check) {
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
  } else {
    res.send({status: false, message: "invalid credentials, please register again!"}) ;
  }
});


// starting the server if db starts up fine
db.sync().then(
  app.listen(process.env.PORT || 8080, () => {
      console.log(`http://127.0.0.1:${process.env.PORT || 8080}`) ;
  })
).catch((err)=> {
  console.error(new Error(err))
  console.error("Error:", err)
})


