var mysql = require('./psql.js');

exports.run = function(message) {
	console.log('get product.');
    var req = message.req;
    var rsp = message.rsp;
    var cgi = message.cgi;
    rsp.setTimeout(30 * 1000, null);

    mysql.queryByPara('select * from product_info where com_id=?',
		[cgi.id],
		function(err, rows, fields) {
        if (err) {
            var res = { 'success': false };
            rsp.end(JSON.stringify(res));
            console.log('select db error');
            return;
        }

        if (0 == rows.length) {
            var res = { 'success': false };
            rsp.end(JSON.stringify(res));
            console.log('get product info failed.');
        }
        else {
            var res = { 'success': true, 'data': rows };
            rsp.end(JSON.stringify(res));
            console.log('get product info success.');
        }
    });

};
