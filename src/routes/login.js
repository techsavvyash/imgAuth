const express = require("express");
const router = express.Router() ;

const { getLogin, postLogin } = require("../controllers/login");
const {checkCredentials, checkToken, findUser} = require('../controllers/middleware');

//LOGIN routes
router.route("/login").get(checkToken, findUser, getLogin);
router.route("/login").post(checkCredentials, findUser, postLogin);
 


module.exports = router ;
