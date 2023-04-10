const profile = document.querySelector("#profile");
const logout = document.querySelector("#logout");

profile.addEventListener("click", profileAuth);
if(logout) logout.addEventListener("click", logOut);

function profileAuth() {
    fetch("/user/profile", {
        headers: { 'authorization': localStorage.getItem('access_token') }
    })
    .then((res) => res.json())
    .then((res) => {
        if(res.code === 200) {
            location.href = "/user/profile/output?username="+res.data.username+"&email="+res.data.email+"&profile="+res.data.profile;
        } else if (res.code === 419) {
            fetch("/user/token/refresh", {
                headers: { 'authorization': localStorage.getItem('refresh_token') }
            })
                .then((res) => res.json())
                .then((res) => {
                    if(res.code === 419) {
                        alert(res.message);
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        window.location.href = "/user/login";
                    } else {
                        alert(res.message);
                        localStorage.setItem('access_token', res.access_token);
                        window.location.reload();
                    }
                })
        } else { // 401 or 500
            alert(res.message);
            location.href = "/user/login";
        }
    })
    .catch((err) => {
        alert('An error occurred while processing your request. Please try again later.');
    });
}

function logOut() {
    if(!localStorage.getItem('access_token')) {
        alert("Already logout state.")
        location.href = "/user/login";
    } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        location.href = "/";
    }
}