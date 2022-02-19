let pwd_img = document.getElementById('pwd_img')
let counter = document.getElementById('counter')
let cancel = document.getElementById('cancel')
let loginBtn = document.getElementById('loginBtn')
let loginForm  = document.getElementById('loginForm')
let userName = document.getElementById('username')
let password = document.getElementById('pwd')

let count = 0 ;
let pwd = []

pwd_img.addEventListener("click", (event) => {
    
    count++ ;
    counter.innerHTML = "Points: " + count ;
    ratio = 1
    if(pwd_img.offsetHeight != 768) {
        ratio = pwd_img.offsetHeight/768 ;
    }
    x = (event.offsetX)/ratio; y = (event.offsetY)/ratio ;
    pwd.push(x,y)
    console.log(x, y)
    password.value = pwd.toString();
})

cancel.onclick = (event) => {
    event.preventDefault();
    pwd.pop() ;
    pwd.pop() ;
    password.value = pwd.toString() ;
    count-- ;
    counter.innerHTML = "Points: " + count ;
}



loginBtn.onclick = (event) => {
    event.preventDefault();
    const data = {
        username: userName.value,
        pwd: pwd.toString()
    }
    axios.post('/login', data).then(res => {
        console.log(res.data)
        if(res.data.status) {
            window.location = '/success'
        } else {
            console.log(res.data)
            alert(res.data.message)
        }
    })
}