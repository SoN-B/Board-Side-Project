const title = document.querySelector("#title");
const body = document.querySelector("#body");
const create_post = document.querySelector("#create");

create_post.addEventListener("click", createPost);

function createPost() {
    if(!title.value) return alert("Please input title.");
    if(!body.value) return alert("Please input body.");

    const req = {
        title : title.value,
        content : body.value
    }

    fetch("/board", {
        method: "POST",
        headers:{
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem('access_token')
        },
        body: JSON.stringify(req)
    })
    .then((res) => res.json())
    .then((res) => {
        if(res.code === 200) {
            location.href = "/board";
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