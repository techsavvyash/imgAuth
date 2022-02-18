const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const session = require('express-session')
require('dotenv').config() ;
const { db, Users } = require('./db.js')

function generateJWT(username) {
  //the jwt contains the username and expires in 5 minutes
  return jwt.sign({username}, process.env.JWT_SECRET, { expiresIn: 5*60*1000 }) ;
}

// middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/', express.static(__dirname + '/public'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  resave: true,
  SameSite: 'strict',
}))

async function checkCredentials(req, res, next) {
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

  try {
    const user = await Users.findOne({ where: {username}})
    req.user = user ;
    next() ;
  } catch(err) {
    console.log(err)
    res.send({status: false, message: err}) ;
    return ;
  }
}

async function checkToken(req, res, next) {
  const token = req.session.token ;
  if(token == null) {
    res.user = null ;
    next()
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if(err) {
      req.user = null ;
      next() ;
    }

    req.user = user ;
    next() ;
  })


}

// route handlers
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/pages/login.html')
})

app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/public/pages/register.html')
})

app.get('/success', checkToken, (req, res) => {
  if(req.user == null) {
    res.redirect('/login')
    return ;
  }
  res.sendFile(__dirname + '/public/pages/success.html')
})

//login route
app.post('/login', checkCredentials, (req, res) => {
  const { username, pwd} = req.body
  const user = req.user ; 
  if(req.user == null) {
    res.send({status: false, message: "invalid credentials"}) ;
    return ;
  }
  
  try {
    const enteredPwd = pwd.split(',') ;
    const userPwd = user.pwd.split(',') ;
    //console.log("Entered Pwd: ", enteredPwd) ;
    //console.log("UserPwd: ", userPwd)
    if(enteredPwd.length !== userPwd.length) {
      res.send({status: false, message: "invalid credentials"}) ;
      return ; 
    }
    let isAMatch = true ;
    for(let i = 0 ; i < enteredPwd.length; i++) {
      if(!(parseFloat(enteredPwd[i]) <= (parseFloat(userPwd[i]) + 10) && parseFloat(enteredPwd[i]) >= (parseFloat(userPwd[i]) - 10))) {
        console.log("False at: ", i+1);
        isAMatch = false ;
        break ;
      }
    }
    if(!isAMatch) {
      res.send({status: false, message: "invalid credentials"})
    } else {
      req.session.token = generateJWT(user.username) ;
      res.send({status: true, message: "login succesful"})
      //res.redirect('/success')
    }
  } catch(err) {
    console.log(err);
    res.send({status: false, message: err})
  }
});


//register route
app.post('/register', checkCredentials, async (req, res) => {
  if(req.user) {
    // case when the username is already taken
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


