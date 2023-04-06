'use strict';

const title = document.querySelector("[name='title']");
const body = document.querySelector("[name='body']");
const create_btn = document.querySelector("#create_btn");

create_btn.addEventListener("click", createPost);

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
    })
    .catch((err) => {
        alert('An error occurred while processing your request. Please try again later.');
    });
}