var mysql = require('./psql.js');

exports.run = function(message) {
	console.log('get company info.');
    var req = message.req;
    var rsp = message.rsp;
    var cgi = message.cgi;
    rsp.setTimeout(30 * 1000, null);

    mysql.queryByPara('select * from com_info where com_id=? or com_name like ? or com_name_en like ? or com_name_short like ? or com_name_short_en like ?',
		[cgi.id, '%'+cgi.id+'%', '%'+cgi.id+'%', '%'+cgi.id+'%', '%'+cgi.id+'%'],
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
            console.log('get com info failed.');
        }
        else {
            var res = { 'success': true, 'data': rows[0] };
            rsp.end(JSON.stringify(res));
            console.log('get com info success.');
        }
    });

};
