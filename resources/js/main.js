async function like_function() {
    let id = parseInt(this.id.slice(2));
    message = {"id": id};
    if (!active) {
        let url = "/like";
        let response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        });
        if (response.ok) {
            this.children[0].style.color = "crimson";
            this.parentElement.children[0].innerText = parseInt(this.parentElement.children[0].innerText) + 1
            active = true;
        }
    } else {
        let url = "/unlike";
        let response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        });
        if (response.ok) {
            this.children[0].style.color = "darkgray";
            this.parentElement.children[0].innerText = parseInt(this.parentElement.children[0].innerText) - 1
            active = false;
        }
    }
}

async function fetch_likes() {
    let url = "/api/likes"
    for (let i = 0; i < counters.length; i++) {
        let id = parseInt(counters[i].id.slice(2));
        url += `?id=${id}`;
        let response = await fetch(url);
        if (response.ok) {
            const json = await response.json();
            counters[i].innerText = json.likes;
        }
    }
}

function toggle_menu() {
    if (!hidden) {
        menu.style.visibility = "hidden";
        hidden = true;
    } else {
        menu.style.visibility = "visible";
        hidden = false;
    }
}

function toggle_filter() {
    if (!hidden_fil) {
    filter.style.visibility = "hidden";
    hidden_fil = true;
    } else {
    filter.style.visibility = "visible";
    hidden_fil = false;
    }
}

function toggle_style() {
    if (window.localStorage.getItem("mode") === "original") {
        document.styleSheets[1].disabled = true;
        window.localStorage.setItem("mode", "new");
    } else {
        document.styleSheets[1].disabled = false;
        window.localStorage.setItem("mode", "original");
    }
}

async function toggle_session() {
    url = "/api/session";
    let response = await fetch(url);
    if (response.ok) {
        const json = await response.json();
        if (!json.session) {
            while (menu.childNodes.length > 1) {
                menu.removeChild(menu.lastChild);
                for (let i = 0; i < posts.length; i++) {
                    posts[i].children[0].children[1]?.remove();
                }
            }
        } else {
            signinup.remove();
            for (let i = 0; i < posts.length; i++) {
                if (posts[i].children[0].children[0].innerText != json.username) {
                    posts[i].children[0].children[1]?.remove();
                }
            }
        }
    }
}

async function delete_post() {
    let id = parseInt(this.id.slice(2));
    message = {"id": id, "username": `${this.parentElement.parentElement.children[0].innerText}`};
    let url = "/delete/post";
    let response = await fetch(url, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
    });
    if (response.ok && (response.status == 200 || response.status == 404)) {
        location.reload();
    }
}

if (window.localStorage.getItem("mode") === "new") {
    document.styleSheets[1].disabled = true;
}

let posts = document.getElementsByClassName("post")
let hearts = []
let counters = []
let deletes = []
let edits = []

for (let i = 0; i < posts.length; i++) {
    hearts[i] = document.getElementById(`h-${posts[i].id}`);
    hearts[i].addEventListener("click", like_function);
    counters[i] = document.getElementById(`l-${posts[i].id}`);
    deletes[i] = document.getElementById(`d-${posts[i].id}`);
    deletes[i].addEventListener("click", delete_post);
}

timerId = setInterval(fetch_likes, 1000);

let menu_toggle = document.getElementById("menu_bar");
let menu = document.getElementById("menu")
let filter_toggle = document.getElementById("filter_tog");
let filter = document.getElementById("filter")
active = false;
hidden = true;
hidden_fil = true;
menu_toggle.addEventListener("click", toggle_menu);
filter_toggle.addEventListener("click", toggle_filter)

const toggle = document.getElementById("toggle_style");
toggle.addEventListener("click", toggle_style);

let signinup = document.getElementById("session");
window.addEventListener("load", toggle_session);