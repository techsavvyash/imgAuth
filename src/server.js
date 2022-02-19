const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const session = require('express-session') ; 
require('dotenv').config() ;
const { db, Users } = require('./config/db.js') ;
const {checkToken, findUser, checkCredentials} = require("./controllers/middleware")


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


// ROUTE HANDLERS
app.use(require("./routes/login"))
app.use( require("./routes/register"))
app.use( require('./routes/change'))


app.get('/success', checkToken, findUser,  async (req, res) => {
 if(req.user == null) {
   res.redirect('/login')
   return ;
 }
 res.sendFile(__dirname + '/public/pages/success.html')

})



// starting the server if db starts up fine
db.sync().then(
  app.listen(process.env.PORT || 8080, () => {
    console.log(`http://127.0.0.1:${process.env.PORT || 8080}`) ;
  })
).catch((err)=> {
  console.error(new Error(err))
  console.error("Error:", err)
})



