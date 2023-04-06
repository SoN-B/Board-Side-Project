'use strict';

const title = document.querySelector("[name='title']");
const body = document.querySelector("[name='body']");
const update_btn = document.querySelector("#update_btn");

update_btn.addEventListener("click", updatePost);

function updatePost() {
    const url_str = window.location.href;
    const content_id = url_str.split('/');
    const query = url_str.split('?');

    if(!title.value) return alert("Please input title.");
    if(!body.value) return alert("Please input body.");

    const req = {
        id : content_id[4],
        title : title.value,
        content : body.value
    }

    fetch(`/board/${content_id[4]}/edit`, {
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
            alert("Update success.")
            query[1] === undefined ? location.href = `/board/${content_id[4]}` : location.href = `/board/${content_id[4]}?` + query[1]
        } else if(res.code === 419){ // Access Token has expired.
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
                    }
                })
        } else { // 401 or 500
            alert(res.message);
            location.href = "/user/login";
        }
    });
}