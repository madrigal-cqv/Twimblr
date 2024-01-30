const table = document.getElementById("contact_table");
let button = [];
let deleted = [];
let time_cell = [];
let data = [];

async function delete_row() {
    // source: https://stackoverflow.com/questions/48239/getting-the-id-of-the-element-that-fired-an-event
    id = parseInt(this.id);
    const url = "/api/contact";
    message = {"id": id};
    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
    });
    if (response.ok && (response.status == 200 || response.status == 404)) {
        for (let i = 1; i < table.tBodies[0].rows.length; i++) {
            if (id == table.rows[i].childNodes[7].children[0].id) {
                table.deleteRow(i);
            }
        }
    }
}

function time_to_dhms(time) {
    let day = Math.floor(time / (1000 * 60 * 60 * 24));
    let left = time - day * (1000 * 60 * 60 * 24);
    let hour = Math.floor(left / (1000 * 60 * 60));
    left = left - hour * (1000 * 60 * 60);
    let minutes = Math.floor(left / (1000 * 60));
    left = left - minutes * (1000 * 60);
    let seconds = Math.floor(left / 1000)
    // source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
    return `${day}d ${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function log_new_time() {
    let curr = new Date();
    for (let i = 0; i < table.tBodies[0].rows.length - 1; i++) {
        time_cell[i] = table.rows[i+1].childNodes[6];
        data[i] = table.rows[i+1].childNodes[4];
        deadline = Date.parse(data[i].innerText);
        if (deadline == NaN) {
            return;
        } else if (deadline - curr.getTime() < 0) {
            time_cell[i].innerText = "PAST";
        } else {
            time_cell[i].innerText = time_to_dhms(deadline - curr.getTime());
        }
    }
}

async function set_new_sale() {
    const url = "/api/sale";
    let sale_msg = document.getElementById("sale_msg");
    message = {"message": `${sale_msg.value}`}
    const response = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)});
    if (response.ok && response.status == 201) {
        sale_return.innerText = "Successful!";
    } else {
        sale_return.innerText = "Hmm...";
    }
}

async function remove_curr_sale() {
    const url = "/api/sale";
    const response = await fetch(url, { method: "DELETE" });
    if (response.ok && response.status == 200) {
        sale_return.innerText = "Successful!";
    } else {
        sale_return.innerText = "Hmm...";
    }
}

for (let i = 0; i < table.tBodies[0].rows.length - 1; i++) {
    button[i] = table.rows[i+1].childNodes[7].children[0];
    button[i].addEventListener("click", delete_row);
}

log_new_time();
timerId = setInterval(log_new_time, 1000);

const set_sale = document.getElementById("set_sale");
const end_sale = document.getElementById("end_sale");
let sale_return = document.getElementById("sale_set_status");

set_sale.addEventListener("click", set_new_sale);
end_sale.addEventListener("click", remove_curr_sale);