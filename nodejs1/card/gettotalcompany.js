var mysql = require('./psql.js');

exports.run = function(message) {
	console.log('get total company.');
    var req = message.req;
    var rsp = message.rsp;
    var cgi = message.cgi;
    rsp.setTimeout(30 * 1000, null);

    mysql.queryByPara('select com_id,com_name,com_name_en from com_info',
		[],
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
            console.log('get total com failed.');
        }
        else {
            var res = { 'success': true, 'data': rows };
            rsp.end(JSON.stringify(res));
            console.log('get total com success.');
        }
    });

};
