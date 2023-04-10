'use strict';

const update_btn = document.querySelector("#update_btn");
const fieldset = document.querySelector('fieldset');
const form_show = document.getElementById('show');

update_btn.addEventListener("click", updateProfile);

function updateProfile() {
    const is_disabled = fieldset.getAttribute('disabled') !== null;

    const username = document.getElementsByName("username")[0].value;
    const email = document.getElementsByName("email")[0].value;

    if(!username) return alert("Please input username.");
    if(!email) return alert("Please input email.");

    if(is_disabled === true) {
        form_show.style.display = "block";
        update_btn.innerText = "편집 완료";
        fieldset.disabled = false;
    } else {
        let form_data = new FormData();

        form_data.append("image", document.getElementsByName("input")[0].files[0]);
        form_data.append('username', username);
        form_data.append('email', email);

        fetch("/user/profile", {
            method: "PUT",
            headers:{
                'authorization': localStorage.getItem('access_token')
            },
            body: form_data
        })
        .then((res) => res.json())
        .then((res) => {
            if(res.code === 200) {
                alert(res.message);
                img.src = res.data.profile;
                $('input[name=username]').val(res.data.username);
                $('input[name=email]').val(res.data.email);
            } else {
                alert(res.message);
                location.reload();
            }
        })

        form_show.style.display = "none";
        update_btn.innerText = "프로필 편집";
        fieldset.disabled = true;
    }
}