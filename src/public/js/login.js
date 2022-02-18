let pwd_img = document.getElementById('pwd_img')
let counter = document.getElementById('counter')
let cancel = document.getElementById('cancel')
let loginBtn = document.getElementById('loginBtn')
let loginForm  = document.getElementById('loginForm')
let userName = document.getElementById('userName')

let count = 0 ;
let pwd = []

pwd_img.addEventListener("click", (event) => {
    x = event.offsetX; y = event.offsetY ;
    count++ ;
    counter.innerHTML = "Points: " + count ;
    pwd.push(x,y)
})

cancel.onclick = (event) => {
    event.preventDefault();
    pwd.pop() ;
    pwd.pop() ;
    count-- ;
    counter.innerHTML = "Points: " + count ;
}



loginBtn.onclick = (event) => {
    event.preventDefault();
    const data = {
        username: userName.value,
        pwd: pwd.toString()
    }
    axios.post('/login', data).then(res => console.log(res.data))
}