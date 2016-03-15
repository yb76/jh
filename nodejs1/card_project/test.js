var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'p123456',
    database: 'carddb',
    port: 3306
});
conn.connect();
conn.query('select * from user_info', function (err, rows, fields) {
    if (err) {
        console.log('select error!');
        throw err;
    }
    else {
        console.log('The solution is: ', rows[0]);
    }
});
conn.end();
console.log("create db!");