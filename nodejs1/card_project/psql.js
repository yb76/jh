var _mysql = require('mysql');
var _conf = require('./configure.js');
var _conn = _mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'p123456',
    database: 'carddb',
    port: 3306
});

exports.connect = function(callback){
    _conn.connect(callback);
};

exports.query = function(sql, callback){
    _conn.query(sql, function (err, rows, fields) {
        callback(err, rows, fields);
	});
};

