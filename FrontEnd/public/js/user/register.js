const username = document.querySelector("#username");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const register = document.querySelector("#button");

register.addEventListener("click", Register);

function Register() {
    const emailRegex = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/; // 계정@도메인.최상위도메인

    if(username.value.length < 3) return alert("username must be longer than 2 characters.");
    if(!emailRegex.test(email.value)) return alert("email must be in the correct format.");
    if(password.value.length < 3) return alert("password must be longer than 2 characters.");

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