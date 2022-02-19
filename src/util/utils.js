const jwt = require("jsonwebtoken")
require("dotenv").config();
const nodemailer = require("nodemailer");
const otpGenerator = require('otp-generator')

exports.generateOTP = () => otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });


exports.generateJWT = (username) => {
    //the jwt contains the username and expires in 5 minutes
    return jwt.sign({username}, process.env.JWT_SECRET, { expiresIn: 5*60*1000 }) ;
}


exports.validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};

exports.sendEmail = (options) => {
    const transporter = nodemailer.createTransport({
        service: process.env.MAIL_SERVICE,
        host: process.env.SERVICE_HOST,
        auth: {
            user: process.env.SERVICE_USER,
            pass: process.env.SERVICE_PASS,
        },
    });

    const mailOptions = {
        from: process.env.MAIL_FROM,
        to: options.to,
        subject: options.subject,
        html: options.text,
    };
    
    transporter.sendMail(mailOptions, function(err, info){
        if(err){
            console.log(err);
        } else {
            console.log(info);
        }
    })
}
