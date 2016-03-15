var mysql = require('./psql.js');

exports.run = function(message) {
	console.log('update user.');
    var req = message.req;
    var rsp = message.rsp;
    var cgi = message.cgi;
	var param = message.param;
    rsp.setTimeout(30 * 1000, null);

    var idInt = parseInt(cgi.id);
    if (idInt == undefined) {
        var res = { 'success': false };
        rsp.end(JSON.stringify(res));
        console.log('undefined com id.');
        return;
    }
    mysql.queryByPara('update com_info set com_site=?,com_name=?,com_name_en=?,com_address=?,com_address_en=?,com_desp=?,com_desp_en=? where com_id=?', 
	[cgi.company_site, cgi.company, cgi.company_en, cgi.company_address, cgi.company_address_en, 
	cgi.description, cgi.description_en, cgi.id], function(err, rows, fields) {
        if (err) {
            var res = { 'success': false };
            rsp.end(JSON.stringify(res));
            console.log('update db error');
            return;
        }

        if (0 == rows.length) {
            var res = { 'success': false };
            rsp.end(JSON.stringify(res));
            console.log('update com info failed.');
        }
        else {
            var res = { 'success': true, 'data': rows[0] };
            rsp.end(JSON.stringify(res));
            console.log('update com info success.');
        }
    });

};
