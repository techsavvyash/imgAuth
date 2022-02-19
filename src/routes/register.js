const express = require("express");
const router = express.Router() ;

const {checkCredentials, checkToken, findUser} = require('../controllers/middleware');
const { getRegister, postRegister } = require("../controllers/register");

//REGISTER ROUTES
router.route("/register").get(checkToken, findUser, getRegister);
router.route("/register").post(checkCredentials, findUser, postRegister) ;

 


module.exports = router ;
