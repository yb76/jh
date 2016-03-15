var mysql = require('./psql.js');

exports.run = function(message) {
	console.log('add product.');
    var req = message.req;
    var rsp = message.rsp;
    var cgi = message.cgi;
	var param = message.param;
    rsp.setTimeout(30 * 1000, null);
	
	mysql.query('select prod_id from product_info order by prod_id desc limit 1', function(err, rows, fields) {
		if (err) {
            var res = { 'success': false };
            rsp.end(JSON.stringify(res));
            console.log('select the first 1 product error');
            return;
        }

        if (0 == rows.length) {
			var maxId = 0;
			var curId = maxId+1;
            console.log('select the first 1 product info failed.');
			insertProduct(curId);
        }
        else {
            var maxId = rows[0].prod_id;
			var curId = maxId+1;
            console.log('select the first 1 product info success.');
			insertProduct(curId);
        }
	});
	
var insertProduct = function(curId) {
	console.log('insert id: '+curId);
	mysql.queryByPara('insert into product_info (prod_id,com_id,prod_name,prod_price) values (?,?,?,?)',
	[curId, cgi.com_id, cgi.prod_name, cgi.prod_price], 
	function(err, rows, fields) {
		if (err) {
			var res = { 'success': false };
			rsp.end(JSON.stringify(res));
			console.log('insert db error');
			console.log(err);
			return;
		}

		if (0 == rows.length) {
			var res = { 'success': false };
			rsp.end(JSON.stringify(res));
			console.log('insert product info failed.');
		}
		else {
			var res = { 'success': true, 'data': {'prod_id':curId, 'com_id':cgi.com_id, 'prod_name':cgi.prod_name, 'prod_price':cgi.prod_price}};
			rsp.end(JSON.stringify(res));
			console.log('insert product info success.');
		}
	});
}
};

