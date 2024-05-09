// this package behaves just like the mysql one, but uses async await instead of callbacks.
const mysql = require(`mysql-await`); // npm install mysql-await

// first -- I want a connection pool: https://www.npmjs.com/package/mysql#pooling-connections
// this is used a bit differently, but I think it's just better -- especially if server is doing heavy work.
var connPool = mysql.createPool({
  connectionLimit: 5, // it's a shared resource, let's not go nuts.
  host: "127.0.0.1",// this will work
  user: "",
  database: "",
  password: "", // we really shouldn't be saving this here long-term -- and I probably shouldn't be sharing it with you...
});

// later you can use connPool.awaitQuery(query, data) -- it will return a promise for the query results.

async function getPost(post_id) {
    return await connPool.awaitQuery("select * from posts where post_id = ?", [post_id]);
}

async function addPost(username, post) {
    return await connPool.awaitQuery("insert into posts (username, post) values (?, ?)", [username, post]);
}

async function deletePost(post_id) {
    return await connPool.awaitQuery("delete from posts where post_id = ?", [post_id]);
}

async function editPost(post_id, new_content) {
    return await connPool.awaitQuery("update posts set post = ? where post_id = ?", [new_content, post_id]);
}

async function addUser(data) {
    return await connPool.awaitQuery("insert into users (username, password) values (?, ?)", [data.username, data.password])
}

async function deleteUser(username) {
    let delete_post = await connPool.awaitQuery("delete from posts where username = ?", [username]);
    let delete_user = await connPool.awaitQuery("delete from users where username = ?", [username]);
    return delete_user.afffectedRows != 0
}

async function checkUser(username) {
    let res = await connPool.awaitQuery("select * from users where username = ?", [username]);
    if (res.length == 0) {
        return false;
    }
    return true;
}

async function validateUser(username, password) {
    let res = await connPool.awaitQuery("select * from users where username = ? and password = ?", [username, password]);
    if (res.length == 0) {
        return false;
    }
    return true;
}

async function updateUsername(curr, aft) {
    return await connPool.awaitQuery("update users set username = ? where username = ?", [aft, curr]);
}

async function updatePassword(username, password) {
    return await connPool.awaitQuery("update users set password = ? where username = ?", [password, username])
}

async function getPosts() {
    return await connPool.awaitQuery("select * from posts order by post_time desc");
}

async function getPostsByLikes() {
    return await connPool.awaitQuery("select * from posts order by likes desc");
}

async function getLikes(post_id) {
    return await connPool.awaitQuery("select likes from posts where post_id = ?", [post_id]);
}

async function increaseLike(post_id) {
    return await connPool.awaitQuery("update posts set likes = likes + 1 where post_id = ?", [post_id]);
}

async function decreaseLike(post_id) {
    return await connPool.awaitQuery("update posts set likes = likes - 1 where post_id = ?", [post_id]);
}

module.exports = {getPost, addPost, deletePost, editPost, addUser, deleteUser, checkUser, validateUser, updateUsername, updatePassword, getPosts, getPostsByLikes,  getLikes, increaseLike, decreaseLike}
