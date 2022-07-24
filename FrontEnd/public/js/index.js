const profile = document.querySelector("#profile");

profile.addEventListener("click", profileAuth);

function profileAuth() {
    fetch("/user/profile", {
    headers: { 'authorization': localStorage.getItem('access_token') }
    })
    .then((res) => res.json())
    .then((res) => {
        if(res.code === 200) {
            location.href = "/user/profile/output?username="+res.data.username+"&email="+res.data.email;
        } else {
            alert(res.message);
            location.href = "/user/login";
        }
    })
}