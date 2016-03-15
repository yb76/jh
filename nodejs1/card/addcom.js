var mysql = require('./psql.js');

exports.run = function(message) {
	console.log('add user.');
    var req = message.req;
    var rsp = message.rsp;
    var cgi = message.cgi;
	var param = message.param;
    rsp.setTimeout(30 * 1000, null);
	
	mysql.query('select com_id from com_info order by com_id desc limit 1', function(err, rows, fields) {
		if (err) {
            var res = { 'success': false };
            rsp.end(JSON.stringify(res));
            console.log('select the first 1 com error');
            return;
        }

        if (0 == rows.length) {
            var res = { 'success': false };
            rsp.end(JSON.stringify(res));
            console.log('select the first 1 com info failed.');
        }
        else {
            var maxId = rows[0].com_id;
			var curId = maxId+1;
            console.log('select the first 1 com info success.');
			insertCom(curId);
        }
	});
	
var insertCom = function(curId) {
	console.log('insert id: '+curId);
	mysql.queryByPara('insert into com_info (com_id,com_site,com_name,com_name_en,com_address,com_address_en,com_desp,com_desp_en) values (?,?,?,?,?,?,?,?)',
	[curId, cgi.company_site, cgi.company, cgi.company_en, cgi.company_address, cgi.company_address_en, cgi.description, cgi.description_en], 
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
			console.log('insert com info failed.');
		}
		else {
			var res = { 'success': true, 'data': {'id':curId} };
			rsp.end(JSON.stringify(res));
			console.log('insert com info success.');
		}
	});
}
};


