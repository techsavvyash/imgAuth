const express = require('express');
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/', express.static(__dirname))


app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/pages/login.html')
})

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/pages/register.html')
})
//login route
app.post('/login', (req, res) => {
    res.send("Login Success!");
});


//register route
app.post('/register', (req, res) => {
    res.send("Registration Success!");
});


// starting the server
app.listen(8080, () => {
    console.log("http://127.0.0.1:8080") ;
})


