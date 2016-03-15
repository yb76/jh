var mysql = require('./psql.js');

exports.run = function(message) {
	console.log('add user.');
    var req = message.req;
    var rsp = message.rsp;
    var cgi = message.cgi;
	var param = message.param;
    rsp.setTimeout(30 * 1000, null);
	
	mysql.query('select id from user_info order by id desc limit 1', function(err, rows, fields) {
		if (err) {
            var res = { 'success': false };
            rsp.end(JSON.stringify(res));
            console.log('select the first 1 user error');
            return;
        }

        if (0 == rows.length) {
            var res = { 'success': false };
            rsp.end(JSON.stringify(res));
            console.log('select the first 1 user info failed.');
        }
        else {
            var maxId = rows[0].id;
			var curId = maxId+1;
            console.log('select the first 1 user info success.');
			insetUser(curId);
        }
	});
	
var insetUser = function(curId) {
	console.log('insert id: '+curId);
	mysql.queryByPara('insert into user_info (id,name,name_en,title_pos,title_pos_en,email,mobile,phone,fax,qq_no,wechat_no,template,com_id) values (?,?,?,?,?,?,?,?,?,?,?,?,?)',
	[curId, cgi.name, cgi.name_en, cgi.title_pos, cgi.title_pos_en, 
	cgi.email, cgi.mobile, cgi.phone, cgi.fax, cgi.qq, cgi.wechat, cgi.template, cgi.com_id], 
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
			console.log('insert user info failed.');
		}
		else {
			var res = { 'success': true, 'data': {'id':curId, 'template':cgi.template, 'mobile':cgi.mobile, 'phone':cgi.phone, 'email':cgi.email} };
			rsp.end(JSON.stringify(res));
			console.log('insert user info success.');
		}
	});
}
};


