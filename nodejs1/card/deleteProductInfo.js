var mysql = require('./psql.js');

exports.run = function(message) {
	console.log('delete product info.');
    var req = message.req;
    var rsp = message.rsp;
    var cgi = message.cgi;
	var param = message.param;
    rsp.setTimeout(30 * 1000, null);

    var idInt = parseInt(cgi.prod_id);
    if (idInt == undefined) {
        var res = { 'success': false };
        rsp.end(JSON.stringify(res));
        console.log('undefined prod id.');
        return;
    }
    mysql.queryByPara('delete from product_info where prod_id=?', 
	[cgi.prod_id], function(err, rows, fields) {
        if (err) {
            var res = { 'success': false };
            rsp.end(JSON.stringify(res));
            console.log('update db error');
            return;
        }

        if (0 == rows.length) {
            var res = { 'success': false };
            rsp.end(JSON.stringify(res));
            console.log('delete prod info failed.');
        }
        else {
            var res = { 'success': true, 'data': rows[0] };
            rsp.end(JSON.stringify(res));
            console.log('delete prod info success.');
        }
    });

};
