const express = require('express');
const sessions = require('express-session');
const data = require("./data")
const app = express();
const port = 4131;
const oneWeek = 1000 * 60 * 60 * 24 * 7;

//static resources
app.use("/css", express.static("resources/css"))
app.use("/js", express.static("resources/js"))

app.use(express.json());       
app.use(express.urlencoded({ extended: true }));

app.set("views", "templates");
app.set("view engine", "pug");

// https://www.section.io/engineering-education/session-management-in-nodejs-using-expressjs-and-express-session/
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: false,
    cookie: { maxAge: oneWeek },
    resave: false 
}));

app.get("/", async (req, res) => {
    // lecture
    let page = parseInt(req.query.page ?? 1)
    let filter = req.query?.filter;
    if (!page || page < 1) {
        page = 1;
    }
    let offset = (page-1)*10;
    let posts;
    if (filter != "most_liked") {
        posts = await (await data.getPosts()).slice(offset, offset+10)
    } else {
        posts = await (await data.getPostsByLikes()).slice(offset, offset+10)
    }
    res.render("main.pug", {posts, page, filter})
})

app.get("/main", async (req, res) =>{
    let page = parseInt(req.query.page ?? 1)
    let filter = req.query?.filter;
    if (!page || page < 1) {
        page = 1;
    }
    let offset = (page-1)*10;
    let posts;
    if (filter != "most_liked") {
        posts = await (await data.getPosts()).slice(offset, offset+10)
    } else {
        posts = await (await data.getPostsByLikes()).slice(offset, offset+10)
    }
    res.render("main.pug", {posts, page, filter: req.query?.filter})
})

app.get("/signup", (req, res) => {
    res.render("signup.pug");
})

app.get("/signin", (req, res) => {
    res.render("signin.pug")
})

app.get("/post", (req, res) => {
    res.render("post_new.pug");
})

app.get("/edit/post", async (req, res) => {
    if (!req.query?.post_id) {
        res.redirect('/');
    } else {
        let post_id = parseInt(req.query.post_id);
        let post = await data.getPost(post_id);
        res.render("post_edit.pug", {current_post: post[0].post, post_id: post_id});
    }
})

app.get("/edit/username", async (req, res) => {
    res.render("username_edit.pug")
})

app.get("/edit/password", async (req, res) => {
    res.render("pass_edit.pug")
})

app.get("/api/user", async (req, res) => {
    if (req.query?.username === undefined) {
        res.send(`{"message": "wrong input"}`)
    }
    let check = await data.checkUser(req.query.username);
    res.send(`{"check": ${check}}`)
})

app.get("/api/signin", async (req, res) => {
    if (req.query?.username === undefined || req.query?.password === undefined) {
        res.send(`{"message": "wrong input"}`)
    }
    let check = await data.validateUser(req.query.username, req.query.password);
    res.send(`{"check": ${check}}`)
})

app.get("/api/likes", async (req, res) => {
    if (req.query?.id === undefined) {
        res.send(`{"message": "wrong input"}`)
    }
    let likes = await data.getLikes(req.query.id);
    if (likes[0] !== undefined) {
        res.send(`{"likes": ${likes[0].likes}}`);
    } else {
        res.send(`{"likes": -1}`);
    }
})

app.get("/api/session", (req, res) => {
    if (req.session?.userid) {
        res.send(`{"session": true, "username": "${req.session.userid}"}`);
    } else {
        res.send(`{"session": false}`);
    }
})

function validate_post(req) {
    return req.body?.post !== undefined && req.body?.post?.length < 257 && req.body?.post?.length > 0;
}

function validate_user(req) {
    return req.body?.username !== undefined && req.body?.username?.length < 101 && req.body?.username?.length > 0 &&
    req.body?.password !== undefined && req.body?.username?.length < 101 && req.body?.username?.length > 0;
}

app.post("/post", async (req, res) => {
    if (req.session?.userid) {
        if (!validate_post(req)) {
            res.status(400);
            res.send("server cannot process request")
        } else {
            await data.addPost(req.session.userid, req.body.post);
            res.status(201);
            res.redirect('/')
        }
    } else {
        res.status(400);
        res.redirect('/signin');
    }
})

app.post("/like", async (req, res) => {
    await data.increaseLike(req.body.id);
    res.status(200);
    res.send("successful");
})

app.post("/unlike", async (req, res) => {
    await data.decreaseLike(req.body.id);
    res.status(200);
    res.send("successful");
})

app.post("/signup", async (req, res) => {
    if (!validate_user(req)) {
        res.status(400);
        res.send("server cannot process request")
    } else {
        if (await data.checkUser(req.body.username)) {
            res.status(400);
            res.send("username already exists")
        } else {
            await data.addUser(req.body);
            res.status(201);
            res.redirect('/signin');
        }
    }
})

app.post("/signin", async (req, res) => {
    if (!validate_user(req)) {
        res.status(400);
        res.send("server cannot process request")
    } else {
        let check = await data.validateUser(req.body.username, req.body.password);
        if (!check) {
            res.status(400);
            res.redirect('/signin');
        } else {
            req.session.userid = req.body.username;
            res.redirect('/');
        }
    }
})

app.post("/signout", (req, res) => {
    req.session.destroy((err) => {
        res.redirect('/')
    })
})

app.post("/edit/post", async (req, res) => {
    if (!req.session?.userid || !req.body?.post_id) {
        res.status(400)
        res.send("server cannot handle request");
    } else  {
        let response = await data.getPost(req.body.post_id);
        if (req.session.userid != response[0].username) {
            res.status(400)
            res.send("server cannot handle request");
        } else {
            await data.editPost(req.body.post_id, req.body.post);
            res.redirect('/')
        }
    }
})

app.post("/edit/username", async (req, res) => {
    if (!req.session?.userid) {
        res.redirect('/signin');
    } else {
        let response = await data.validateUser(req.session.userid, req.body.password);
        if (!response) {
            res.redirect('/edit/username');
        } else {
            await data.updateUsername(req.session.userid, req.body.user_new);
            req.session.userid = req.body.user_new;
            res.redirect('/')
        }
    }
})

app.post("/edit/password", async (req, res) => {
    if (!req.session?.userid) {
        res.redirect('/signin');
    } else {
        let response = await data.validateUser(req.session.userid, req.body.password);
        if (!response) {
            res.redirect('/edit/password');
        } else {
            await data.updatePassword(req.session.userid, req.body.pass_new);
            res.redirect('/');
        }
    }
})

app.post("/delete/account", async (req, res) => {
    if (!req.session?.userid) {
        res.status(400);
        res.send("Server cannot process request")
    }
    let response = await data.deleteUser(req.session.userid);
    if (response) {
        res.status(200);
        req.session.destroy((err) => {
            res.redirect('/')
        })
    } else {
        res.status(404);
        req.session.destroy((err) => {
            res.redirect('/')
        })
    }
})

app.delete("/delete/post", async (req, res) => {
    if (!req.body?.id || !req.body?.username) {
        res.status(400);
        res.send("server cannot process request");
    } else {
        if (req.session?.userid == req.body.username) {
            await data.deletePost(req.body.id);
        }
        // https://stackoverflow.com/questions/24750169/expressjs-res-redirect-after-delete-request
        // this needs to be used in conjunction with location.reload() in main.js
        // I do not know why, but that's what testing told me
        res.redirect(303, '/');
    }
})

app.listen(port , () => {
    console.log(`Listening on port ${port}...`)
})