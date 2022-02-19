const express = require("express");
const router = express.Router() ;

const { getChange, postChange } = require("../controllers/change");
const {checkCredentials, checkToken, findUser} = require('../controllers/middleware');

//CHANGE password routes
router.route("/change").get(checkToken, findUser, getChange) ;
router.route("/change").post(checkCredentials, checkToken, findUser, postChange) ; 


module.exports = router ;
