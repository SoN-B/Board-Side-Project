'use strict';

const recommend_btn = document.getElementById('recommend_btn');
const recommend_count = document.getElementById('recommend_count');

const url_str = window.location.href;
const words = url_str.split('/');
const content_id = words[4].split('?')[0] || words[4];

window.onload = function checkAuthorization() { // Always execute this function when page loaded.
    fetch(`/board/${content_id}/auth`, {
        headers: {
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem('access_token')
        }
    })
        .then((res) => res.json())
        .then((res) => {
            if (res.code === 200) {
                if (res.message === 'authorized') {
                    $('form[name="method_form"]').append(owner);
                } else if (res.message === 'unauthorized') {
                    $('form[name="method_form"]').append();
                }
            } else if (res.code === 419) { // Access Token has expired.
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
            }
        })
        .catch((err) => {
            alert('An error occurred while processing your request. Please try again later.');
        });
}

window.addEventListener('load', function() {
    fetch(`/board/${content_id}/recommand`, {
        headers: {
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem('access_token')
        }
    })
        .then((res) => res.json())
        .then((res) => {
            if(res.code == 200) {
                if (res.message === "created") {
                    recommend_btn.className = "btn btn-danger"
                    recommend_btn.textContent = "추천취소"
                } else if(res.message === "deleted") {
                    recommend_btn.className = "btn btn-success"
                    recommend_btn.textContent = "추천하기"
                }
            }
        })
        .catch((err) => {
            alert('An error occurred while processing your request. Please try again later.');
        });
});

function delete_click() {
    if (confirm("Are you sure want to delete this post?")) {
        alert("Delete post success.");
        document.method_form.submit();
    } else { alert("Delete post cancle."); }
}

function recommand_click() {
    if(!localStorage.getItem('access_token')) {
        alert('Please login first.');
        location.href = "/user/login";
    } else {
        fetch(`/board/${content_id}/recommand`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('access_token')
            }
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.code === 200 && res.message === "create") {
                    alert("Recommand success.");
                    location.herf = `/board/${content_id}<%= getPostQueryString() %>`
                    recommend_btn.className = "btn btn-danger"
                    recommend_btn.textContent = "추천취소"
                    recommend_count.textContent = res.data.recommand;
                } else if (res.code === 200 && res.message === "delete") {
                    alert("Recommand cancle success.");
                    location.herf = `/board/${content_id}<%= getPostQueryString() %>`
                    recommend_btn.className = "btn btn-success"
                    recommend_btn.textContent = "추천하기"
                    recommend_count.textContent = res.data.recommand;
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
}