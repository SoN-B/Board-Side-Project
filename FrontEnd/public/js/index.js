const profile = document.querySelector("#profile");
const logout = document.querySelector("#logout");

profile.addEventListener("click", profileAuth);
logout.addEventListener("click", logOut);

function profileAuth() {
    fetch("/user/profile", {
    headers: { 'authorization': localStorage.getItem('access_token') }
    })
    .then((res) => res.json())
    .then((res) => {
        if(res.code === 200) {
            location.href = "/user/profile/output?username="+res.data.username+"&email="+res.data.email;
        } else if(res.message === "Token has expired."){ // 419
            fetch("/user/token/refresh", {
                headers: { 'authorization': localStorage.getItem('refresh_token') }
                })
                .then((res) => res.json())
                .then((res) => {
                    alert(res.message);
                    localStorage.setItem('access_token', res.access_token);
                })
        } else { // 401
            alert(res.message);
            location.href = "/user/login";
        }
    })
}

function logOut() {
    if(!localStorage.getItem('access_token')) {
        alert("Already logout state.")
        location.href = "/user/login";
    }
    else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        location.href = "/";
    }
}