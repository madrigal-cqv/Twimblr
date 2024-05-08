function post_validation() {
    submit.disabled = true
    if (post.value.length < 257 && post.value.length > 0) {
        form.requestSubmit();
    } else {
        submit_noti.innerText = "Post must be over 0 and not over 256 letters in length."
    }
}

function toggle_post() {
    submit.disabled = false;
}

let submit_noti = document.getElementById("submit_noti");
let post = document.getElementById("post");
let submit = document.getElementById("submit");
let form = document.getElementById("form");

submit.addEventListener("click", post_validation);
post.addEventListener("input", toggle_post)