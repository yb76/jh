var mysql = require('./psql.js');

exports.run = function(message) {
	console.log('update product info.');
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
    mysql.queryByPara('update product_info set prod_name=?,prod_price=? where prod_id=?', 
	[cgi.prod_name, cgi.prod_price, cgi.prod_id], function(err, rows, fields) {
        if (err) {
            var res = { 'success': false };
            rsp.end(JSON.stringify(res));
            console.log('update db error');
            return;
        }

        if (0 == rows.length) {
            var res = { 'success': false };
            rsp.end(JSON.stringify(res));
            console.log('update prod info failed.');
        }
        else {
            var res = { 'success': true, 'data': rows[0] };
            rsp.end(JSON.stringify(res));
            console.log('update prod info success.');
        }
    });

};
