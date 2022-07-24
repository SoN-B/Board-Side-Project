const email = document.querySelector("#email");
const password = document.querySelector("#password");
const login = document.querySelector("#button");

login.addEventListener("click", Login);

function Login() {
    if(!email.value) return alert("Please input id.");
    if(!password.value) return alert("Please input password.");

    const req = {
        email : email.value,
        password : password.value,
    }

    fetch("/user/login", {
        method: "POST",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req)
    })
    .then((res) => res.json())
    .then((res) => {
        if(res.code === 200) {
            localStorage.setItem('access_token', res.access_token);
            localStorage.setItem('refresh_token', res.refresh_token);

            location.href = "/"; 
        } else return alert(res.message);
    })
}