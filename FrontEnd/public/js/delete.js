// const update_post = document.querySelector("#update");
const delete_post = document.querySelector("#delete");

// update_post.addEventListener('click', Update);

delete_post.addEventListener('click', Delete);
// function Update() {
//     let urlStr = window.location.href;
//     let contentid = urlStr.split('/');

//     fetch(`/board/${contentid[4]}/edit`, {
//         headers:{ 
//             'Content-Type': 'application/json',
//             'authorization': localStorage.getItem('access_token')
//         }
//     })
//     .then((res) => res.json())
//     .then((res) => {
//         if(res.code === 200) {
//             location.href = `/board/${contentid[4]}/edit`;
//             //"/user/profile/output?username="+res.data.username+"&email="+res.data.email;
//         } else return alert(res.message);
//     })
// }

function Delete() {
    let urlStr = window.location.href;
    let contentid = urlStr.split('/');

    answer = window.confirm("Are you sure want to delete this post?");
    
    const req = { id : contentid[4] };

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