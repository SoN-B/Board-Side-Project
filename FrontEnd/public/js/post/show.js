let rec = document.getElementById('insert_2');

let urlStr = window.location.href;
let words = urlStr.split('/');
let contentid;

if(words[4].indexOf('?')) {
    words = words[4].split('?');
    contentid = words[0];
} else {
    contentid = words[4];
}

window.onload = function () { // 항상 실행
    fetch(`/board/${contentid}/auth`, {
        headers: {
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem('access_token')
        }
    })
        .then((res) => res.json())
        .then((res) => {
            if (res.code === 200) { $('#insert_1').append(owner); }
            else if (res.code === 419) { // "Token has expired."
                fetch("/user/token/refresh", {
                    headers: { 'authorization': localStorage.getItem('refresh_token') }
                })
                    .then((res) => res.json())
                    .then((res) => {
                        alert(res.message);
                        localStorage.setItem('access_token', res.access_token);
                    })
            }
        })
}

window.addEventListener('load', function() {
    fetch(`/board/${contentid}/recommand`, {
        headers: {
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem('access_token')
        }
    })
        .then((res) => res.json())
        .then((res) => {
            if (res.code === 200 && res.message === "created") { 
                rec.className = "btn btn-danger"
                rec.textContent = "추천취소"
            } else if(res.code === 200 && res.message === "deleted") {
                rec.className = "btn btn-success"
                rec.textContent = "추천하기"
            }
        })
});

function excute() {
    if (confirm("Are you sure want to delete this post?")) {
        alert("Delete post success.");
        document.method_form.submit();
    } else { alert("Delete post cancle."); }
}

function recommand() {
    fetch(`/board/${contentid}/recommand`, {
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
                location.herf = `/board/${contentid}<%= getPostQueryString() %>` 
                window.location.reload();
            } else if (res.code === 200 && res.message === "delete") {
                alert("Recommand cancle success.");
                location.herf = `/board/${contentid}<%= getPostQueryString() %>` 
                window.location.reload();
            } else if (res.code === 419) {
                fetch("/user/token/refresh", {
                    headers: { 'authorization': localStorage.getItem('refresh_token') }
                })
                    .then((res) => res.json())
                    .then((res) => {
                        alert(res.message);
                        localStorage.setItem('access_token', res.access_token);
                    })
            }
        })
}