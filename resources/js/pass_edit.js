function pass_verification() {
    if (pass_new.value != pass_new_re.value) {
        pass_verif.innerText = "Not matched"
    } else {
        pass_verif.innerText = ""
    }
}

function enableSubmit() {
    submit.disabled = false;
}

function submit_verif() {
    submit.disabled = true;
    let success = pass_new.value.length <= 100 && pass_new.value.length > 0 && pass_new.value == pass_new_re.value;
    if (!success) {
        submit_noti.innerText = "Invalid/Unmatched password.";
    } else {
        form.requestSubmit();
    }
}

let pass_new = document.getElementById("pass_new");
let pass_new_re = document.getElementById("pass_new_re");
let pass = document.getElementById("password");
let pass_verif = document.getElementById("pass_verif");

pass_new.addEventListener("input", enableSubmit);
pass_new_re.addEventListener("input", enableSubmit);

pass_new.addEventListener("input", pass_verification);
pass_new_re.addEventListener("input", pass_verification);

let submit_noti = document.getElementById("submit_noti");
let submit = document.getElementById("submit");
let form = document.getElementById("form");
submit.addEventListener("click", submit_verif);