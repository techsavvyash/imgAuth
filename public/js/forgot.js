let submitBtn = document.getElementById('submitBtn')
let userName = document.getElementById('userName')

submitBtn.onclick = (event) => {
    event.preventDefault() ;
    const username = userName.value ;
    const data = {
        username
    }

    axios.post('/forgot', data).then(res => {
        console.log(res.data)
    })
}