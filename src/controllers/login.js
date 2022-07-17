const path = require("path");
const generateJWT = require("../util/utils").generateJWT;

exports.getLogin = (req, res) => {
  if (req.user == null)
    res.sendFile(path.join(__dirname, "../../public/pages/login.html"));
  else res.redirect("/success");
};

exports.postLogin = (req, res) => {
  const { username, pwd } = req.body;
  const user = req.user;
  if (req.user == null) {
    res.send({ status: false, message: "invalid credentials" });
    return;
  }

  try {
    const enteredPwd = pwd.split(",");
    const userPwd = user.pwd.split(",");
    //console.log("Entered Pwd: ", enteredPwd) ;
    //console.log("UserPwd: ", userPwd)
    if (enteredPwd.length !== userPwd.length) {
      res.send({ status: false, message: "invalid credentials" });
      return;
    }
    let isAMatch = true;
    for (let i = 0; i < enteredPwd.length; i++) {
      if (
        !(
          parseFloat(enteredPwd[i]) <= parseFloat(userPwd[i]) + 10 &&
          parseFloat(enteredPwd[i]) >= parseFloat(userPwd[i]) - 10
        )
      ) {
        console.log("False at: ", i + 1);
        isAMatch = false;
        break;
      }
    }
    if (!isAMatch) {
      res.send({ status: false, message: "invalid credentials" });
    } else {
      req.session.token = generateJWT(user.username);
      res.send({ status: true, message: "login succesful" });
      //res.redirect('/success')
      //res.render("success", {text: "Login Successful"})
    }
  } catch (err) {
    console.log(err);
    res.send({ status: false, message: err });
  }
};
