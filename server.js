const express = require ('express')
const basicAuth = require('express-basic-auth')
const data = require("./data")
const app = express()
const port = 4131

app.set("views", "templates"); // look in "templates" folder for pug templates
app.set("view engine", "pug");

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//static resources
app.use("/css", express.static("resources/css"))
app.use("/js", express.static("resources/js"))
app.use("/images", express.static("resources/images"))

let next_id = 1;

app.get("/", (req, res)=>{
    res.render("mainpage.pug");
})

app.get("/main", (req, res)=>{
    res.render("mainpage.pug");
})

app.get("/contact", (req, res)=>{
    res.render("contactform.pug");
})

app.get("/testimonies", (req, res)=>{
    res.render("testimonies.pug");
})

app.get("/api/sale", async (req, res)=>{
    res.set('Content-Type', 'application/json');
    // this approach makes more sense with how the database is set up
    // any sales that have not been ended yet are active and will be shown on main page
    let logs = await data.getActiveSales();
    let sale_msg = "";
    let sale_json;
    if (logs != []) {
        for (let i = 0; i < logs.length; i++) {
            if (!logs.end_time)
                sale_msg += logs[i].sale + '\n';
        }
        sale_json = {"message": sale_msg, "active": true};
    } else {
        sale_json = {"active": false};
    }
    res.send(JSON.stringify(sale_json));
})

function validate_req(req) {
    return req.body?.name === undefined || req.body?.email === undefined || req.body?.type === undefined ||
    req.body?.size === undefined || req.body?.deadline === undefined;
}

app.post("/contact", async (req, res)=>{
    if (validate_req(req)) {
        res.status(400);
        res.send("server cannot process request")
    } else {
        req.body.id = next_id;
        await data.addContact(req.body);
        next_id++;
        res.status(201);
        res.send(res.render("contactform.pug"));
    }
})

// app.use(basicAuth({
//     users: { 'username': 'password' },
//     challenge: true
// }))

app.get("/admin/contactlog", basicAuth({
    users: { 'admin': 'password' },
    challenge: true
}), async (req, res)=>{
    let contacts = await data.getContacts();
    res.render("contactlog.pug", {contacts: contacts});
})

app.delete("/api/sale", basicAuth({
    users: { 'admin': 'password' },
    challenge: true
}), async (req, res)=>{
    await data.endSale();
    res.send("successfully ended sale");
})

app.delete("/api/contact", basicAuth({
    users: { 'admin': 'password' },
    challenge: true
}), async (req, res)=>{
    // source: https://stackoverflow.com/questions/23271250/how-do-i-check-content-type-using-expressjs
    let content_type = req.headers['content-type'];
    if (!content_type || content_type.indexOf('application/json') !== 0) {
        res.status(400);
        res.send("Wrong header");
    } else if (req.body.id === undefined) {
        res.status(400);
        res.send("Wrong body");
    } else {
        let deleted = await data.deleteContact(req.body.id);
        if (deleted) {
            res.status(200);
        } else {
            res.status(404);
        }
        res.send("successful");
    }
})

app.post("/api/sale", basicAuth({
    users: { 'admin': 'password' },
    challenge: true
}), async (req, res)=>{
    // source: https://stackoverflow.com/questions/23271250/how-do-i-check-content-type-using-expressjs
    let content_type = req.headers['content-type'];
    if (!content_type || content_type.indexOf('application/json') !== 0) {
        res.status(400);
        res.send("Wrong header");
    } else if (req.body.message === undefined){
        res.status(400);
        res.send("Wrong body");
    } else {
        await data.addSale(req.body.message);
        res.status(201);
        res.send(JSON.stringify({"message": req.body.message, "active": true}));
    }
})

app.get("/admin/salelog", basicAuth({
    users: { 'admin': 'password' },
    challenge: true
}), async (req, res)=>{
    let logs = await data.getRecentSales();
    let sale_log = [];
    for (let i = 0; i < logs.length; i++) {
        if (!logs[i].end_time) {
            sale_log.push({"message": logs[i].sale, "active": true});
        } else {
            sale_log.push({"message": logs[i].sale, "active": false});
        }
    }
    res.send(sale_log);
})

// put at bottom so it's run last -- this acts as a "catch all" letting us 404!
app.use((req, res, next) => {
    res.status(404);
    res.render("e404.pug");
    next();
})

app.listen(port , () => {
    console.log(`Listening on port ${port}...`)
})