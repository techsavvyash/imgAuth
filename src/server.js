const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config() ;
const { db, Users } = require('./db.js')

function generateJWT(username) {
  //the jwt contains the username and expires in 5 minutes
  return jwt.sign(username, process.env.JWT_SECRET, {expiresIn: 5*60*1000}) ;
}

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/', express.static(__dirname + '/public'))


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
app.post('/register', (req, res) => {
  res.send("Registration Success!");
});


// starting the server if db starts up fine
db.sync().then(
  app.listen(process.env.PORT, () => {
      console.log(`http://127.0.0.1:${process.env.PORT}`) ;
  })
).catch((err)=> {
  console.error(new Error(err))
  console.error("Error:", err)
})


