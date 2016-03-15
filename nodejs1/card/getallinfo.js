var mysql = require('./psql.js');

exports.run = function(message) {
	console.log('get user.');
    var req = message.req;
    var rsp = message.rsp;
    var cgi = message.cgi;
    rsp.setTimeout(30 * 1000, null);

    mysql.queryByPara('select * from user_info as a, com_info as b where (a.id=? or a.email like ? or a.phone like ? or a.mobile like ?) and (a.com_id = b.com_id)',
		[cgi.id, '%'+cgi.id+'%', '%'+cgi.id+'%', '%'+cgi.id+'%'],
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
            console.log('get all info failed.');
        }
        else {
            var res = { 'success': true, 'data': rows[0] };
            rsp.end(JSON.stringify(res));
            console.log('get all info success.');
        }
    });

};
