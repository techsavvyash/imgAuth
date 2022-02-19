const express = require("express");
const { getChange, postChange } = require("../controllers/change");
const { getLogin, postLogin } = require("../controllers/login");
const router = express.Router() ;

const {checkCredentials, checkToken, findUser} = require('../controllers/middleware');
const { getRegister, postRegister } = require("../controllers/register");

//LOGIN routes
router.route("/login").get(checkToken, findUser, getLogin);
router.route("/login").post(checkCredentials, findUser, postLogin);

//REGISTER ROUTES
router.route("/register").get(checkToken, findUser, getRegister);
router.route("/register").post(checkCredentials, findUser, postRegister) ;

//success route
router.route("/success").get(checkToken, findUser, (req, res) => {
    if(req.user == null) {
      res.redirect('/login')
      return ;
    }
    res.sendFile(__dirname + '/public/pages/success.html')}) ;

//CHANGE password routes
router.route("/change").get(checkToken, findUser, getChange) ;
router.route("/change").post(checkCredentials, checkToken, findUser, postChange) ; 


module.exports = router ;
