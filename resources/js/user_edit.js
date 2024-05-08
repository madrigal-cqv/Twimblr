async function user_validation() {
    submit.disabled = true;
    let url = "/api/user"
    url += "?username=" + user_new.value;
    let response = await fetch(url);
    let success = user_new.value.length <= 100 && user_new.value.length > 0;
    if (response.ok) {
        const json = await response.json();
        check = json.check;
        if (!success) {
            submit_noti.innerText = "Invalid new username."
        } else if (check) {
            submit_noti.innerText = "Username already exists."
        } else {
            form.requestSubmit();
        }
    }
}

function enableSubmit() {
    submit.disabled = false;
}

let user_new = document.getElementById("user_new");
let pass = document.getElementById("password");
user_new.addEventListener("input", enableSubmit);

let submit_noti = document.getElementById("submit_noti");
let submit = document.getElementById("submit");
let form = document.getElementById("form");
submit.addEventListener("click", user_validation);