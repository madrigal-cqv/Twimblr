function pass_verification() {
    if (pass.value != pass_re.value) {
        pass_verif.innerText = "Not matched"
    } else {
        pass_verif.innerText = ""
    }
}

async function callback() {
    submit.disabled = true;
    let url = "/api/user"
    url += "?username=" + username.value;
    let response = await fetch(url);
    let success = username.value.length > 100 || pass.value.length > 100 || pass.value != pass_re.value || username.value.length == 0 || pass.value.length == 0;
    if (response.ok) {
        const json = await response.json();
        check = json.check;
        if (success) {
            submit_noti.innerText = "Invalid username and/or password and/or password retype."
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

let username = document.getElementById("username");
let pass = document.getElementById("password")
let pass_re = document.getElementById("password_re");
let pass_verif = document.getElementById("pass_verif");
let tos = document.getElementById("tos");
pass.addEventListener("input", pass_verification);
pass_re.addEventListener("input", pass_verification);

let submit_noti = document.getElementById("submit_noti");
let submit = document.getElementById("submit");
let form = document.getElementById("form");
submit.addEventListener("click", callback);

username.addEventListener("input", enableSubmit);
pass.addEventListener("input", enableSubmit);
pass_re.addEventListener("input", enableSubmit);
tos.addEventListener("input", enableSubmit);
