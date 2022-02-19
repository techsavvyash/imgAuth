const jwt = require("jsonwebtoken")
require("dotenv").config();

exports.generateJWT = (username) => {
    //the jwt contains the username and expires in 5 minutes
    return jwt.sign({username}, process.env.JWT_SECRET, { expiresIn: 5*60*1000 }) ;
}
