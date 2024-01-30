select_input = document.getElementById("type");
size = document.getElementById("size");
output = document.getElementById("output");

// this function calculate price per piece by taking in the type of product and the size of the product
// numbers are arbitrary
// the name is promo because I planned to do a promotion type function but decided against it later
function promo() {
    // I don't want to calculate prices when there are still missing input(s)
    if ((select_input.value == "") || (size.value == "")) {
        return;
    } else {
        let price_estimate = 0;
        switch (select_input.value) {
            case "diecut":
                if (size.value <= 5) {
                    price_estimate = 0.24 + size.value*0.01;
                } else if (size.value <= 18) {
                    price_estimate = 0.20 + size.value*0.03;
                } else {
                    price_estimate = 1.5 + size.value*0.5;
                }
                output.innerText = "Estimating $" + price_estimate + " per sticker."
                break;
            case "kisscut":
                if (size.value <= 6) {
                    price_estimate = 0.5 + size.value*0.01;
                } else if (size.value <= 18) {
                    price_estimate = 0.45 + size.value*0.03;
                } else {
                    price_estimate = 4 + size.value*0.5;
                }
                output.innerText = "Estimating $" + price_estimate + " per sheet."
                break;
            case "transfer":
                if (size.value <= 5) {
                    price_estimate = 0.4 + size.value*0.01;
                } else if (size.value <= 18) {
                    price_estimate = 0.36 + size.value*0.04;
                } else {
                    price_estimate = 2 + size.value*0.5;
                }
                output.innerText = "Estimating $" + price_estimate + " per sticker."
                break;
            case "labels":
                if (size.value <= 5) {
                    price_estimate = 1.42 + size.value*0.01;
                } else if (size.value <= 18) {
                    price_estimate = 1.4 + size.value*0.05;
                } else {
                    price_estimate = 10 + size.value*0.5;
                }
                output.innerText = "Estimating $" + price_estimate + " per roll."
                break;
        }
    }
}

size.addEventListener("input", promo);
select_input.addEventListener("input", promo);
