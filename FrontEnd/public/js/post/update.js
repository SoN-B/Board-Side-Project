const title = document.querySelector("#title");
const body = document.querySelector("#body");
const update_post = document.querySelector("#update");

update_post.addEventListener("click", updatePost);

function updatePost() {
    let urlStr = window.location.href;
    let contentid = urlStr.split('/');
    let query = urlStr.split('?');

    if(!title.value) return alert("Please input title.");
    if(!body.value) return alert("Please input body.");

    const req = {
        id : contentid[4],
        title : title.value,
        content : body.value
    }

    fetch(`/board/${contentid[4]}/edit`, {
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
            location.href = `/board/${contentid[4]}?` + query[1];
        } else return alert(res.message);
    })
}