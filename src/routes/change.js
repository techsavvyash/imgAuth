const express = require("express");
const router = express.Router() ;

const { getChange, postChange } = require("../controllers/change");
const { getLogin } = require("../controllers/login");
const {checkCredentials, checkToken, findUser, verifyToken} = require('../controllers/middleware');

//CHANGE password routes
router.route("/change").get(checkToken, findUser, getChange) ;
router.route("/change").post(checkCredentials, checkToken, findUser, postChange) ; 
router.route("/change/:id").get(verifyToken, findUser, getChange);
router.route("/change/:id").post(checkCredentials, verifyToken, findUser, postChange);

module.exports = router ;
