var mysql = require('mysql');
var conn;
function handleError () {
    conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        //password: 'card2015!',
		password: 'card',
        database: 'card',
        port: 3306
    });

    //连接错误，2秒重试
    conn.connect(function (err) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleError , 2000);
        } else {
	        console.log('connect db success');
        }
    });

    conn.on('error', function (err) {
        console.log('db error', err);
        // 如果是连接断开，自动重新连接
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleError();
        } else {
            throw err;
        }
    });
}
handleError();


exports.query = function(sql, callback) {
    conn.query(sql, function(err, rows, fields) {
        callback(err, rows, fields);
    });
};

exports.queryByPara = function(sql, paras, callback) {
    conn.query(sql, paras, function(err, rows, fields) {
        callback(err, rows, fields);
    });
};
