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

async function addContact(data){
    // you CAN change the parameters for this function. please do not change the parameters for any other function in this file.
  return await connPool.awaitQuery("insert into contacts (name, email, type, deadline, size, id) values (?, ?, ?, ?, ?, ?)", 
                  [data.name, data.email, data.type, data.deadline, data.size, data.id]);
}

async function deleteContact(id){
  let success = await connPool.awaitQuery("delete from contacts where id=?", [id]);
  if (success.affectedRows == 1) {
    return true;
  }
  return false;
}

async function getContacts() {
  return await connPool.awaitQuery("select * from contacts")
}

async function addSale(message) {
  return await connPool.awaitQuery("insert into sale (sale, start_time) values (?, CURRENT_TIMESTAMP)", [message]);
}

async function endSale() {
  return await connPool.awaitQuery("update sale set end_time=CURRENT_TIMESTAMP where end_time is NULL");
}

// I added this function
async function getActiveSales() {
  return await connPool.awaitQuery("select * from sale where end_time is null order by start_time asc")
}

async function getRecentSales() {
  return await connPool.awaitQuery("select * from sale order by start_time desc limit 3");
}

module.exports = {addContact, getContacts, deleteContact, addSale, endSale, getActiveSales, getRecentSales}