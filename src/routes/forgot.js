const express = require("express");
const router = express.Router() ;

const { postForget } = require("../controllers/change");

router.route('/forget').get((req, res) => {
    res.sendFile(path.join(__dirname, '../public/pages/forget.html'))
})
router.route('/forget').post(postForget)

module.exports = router ;
