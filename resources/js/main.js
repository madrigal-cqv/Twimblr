function toggle_style() {
    if (window.localStorage.getItem("mode") === "original") {
        document.styleSheets[1].disabled = true;
        window.localStorage.setItem("mode", "new");
    } else {
        document.styleSheets[1].disabled = false;
        window.localStorage.setItem("mode", "original");
    }
}

async function fetch_sale() {
    const url = "/api/sale";
    const response = await fetch(url);
    if (response.ok && response.status == 200) {
        const json = await response.json();
        if (json.message) {
            banner.innerText = json.message;
        } else {
            banner.innerText = "";
        }
    }
}

if (window.localStorage.getItem("mode") === "new") {
    document.styleSheets[1].disabled = true;
}
const toggle = document.getElementById("toggle");
toggle.addEventListener("click", toggle_style);

let banner = document.getElementById("sale");
if (banner) {
    fetch_sale();
    timerId = setInterval(fetch_sale, 1000);
}
