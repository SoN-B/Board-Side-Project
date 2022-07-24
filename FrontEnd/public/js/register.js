const username = document.querySelector("#username");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const register = document.querySelector("#button");

register.addEventListener("click", Register);

function Register() {
    const req = {
        username: username.value,
        email : email.value,
        password : password.value,
    }

    fetch("/user/register", {
        method: "POST",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req)
    })
    .then((res) => res.json())
    .then((res) => {
        if(res.code === 200) {
            location.href = "/user/login"; 
        } else return alert(res.message);
    })
}