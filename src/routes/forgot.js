const express = require("express");
const router = express.Router() ;
const path = require('path')
const { postForget } = require("../controllers/change");

router.route('/forgot').get((req, res) => {
    res.sendFile(path.join(__dirname, '../../public/pages/forgot.html'))
})
router.route('/forgot').post(postForget)

module.exports = router ;
