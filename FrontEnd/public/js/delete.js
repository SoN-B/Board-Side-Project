const delete_post = document.querySelector("#delete");

delete_post.addEventListener('click', Delete);

function Delete() {
    let urlStr = window.location.href;
    let contentid = urlStr.split('/');

    answer = window.confirm("Are you sure want to delete this post?");
    
    const req = { id : contentid };
    if(answer){
        fetch(`/board/${contentid[4]}`, {
            method: 'POST',
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
            } else return alert(res.message);
        })
    } else { alert("Cancled!"); }
}