let pwd_img = document.getElementById('pwd_img')
let counter = document.getElementById('counter')
let cancel = document.getElementById('cancel')
let registerBtn = document.getElementById('registerBtn')
let loginForm  = document.getElementById('loginForm')
let userName = document.getElementById('userName')
let name = document.getElementById('name');

let count = 0 ;
let pwd = []

pwd_img.addEventListener("click", (event) => {
    x = event.offsetX; y = event.offsetY ;
    count++ ;
    if(count >= 8) {
        registerBtn.disabled = false ;
    }
    counter.innerHTML = "Points: " + count ;
    pwd.push(x,y)
})

cancel.onclick = (event) => {
    event.preventDefault();
    pwd.pop() ;
    pwd.pop() ;
    count-- ;
    if(count < 8) {
        registerBtn.disabled = true ;
    }
    counter.innerHTML = "Points: " + count ;
}

registerBtn.onclick = (event) => {
    event.preventDefault();
    const data = {
        name: name.value,
        username: userName.value,
        pwd: pwd.toString()
    }
    axios.post('/register', data).then(res => {
        alert(res.data.message)
        if(res.data.status) {
            window.location = '/success'
        }  
    })
}