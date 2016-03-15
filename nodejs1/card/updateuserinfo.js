require('./md5.js');
var base64 = require('./base64.js');
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
        console.log('undefined user id.');
        return;
    }
	
	var uidEncryp = base64.base64Encode(cgi.id+'_'+cgi.template);
	var tempEncryp = cgi.template.MD5();
	cgi.encode_url = 'http://www.9ware.cn/card/'+tempEncryp+'/card.html?_='+uidEncryp;
	console.log(cgi.encode_url);
	
    mysql.queryByPara('update user_info set name=?, name_en=?,title_pos=?,title_pos_en=?,email=?,mobile=?,phone=?,fax=?,qq_no=?,wechat_no=?,template=?,encode_url=?,'+
	'link1_type=?,link1_url=?,link2_type=?,link2_url=?,link3_type=?,link3_url=?,link4_type=?,link4_url=? where id=?', 
	[cgi.name, cgi.name_en, cgi.title_pos, cgi.title_pos_en, cgi.email, cgi.mobile, cgi.phone, cgi.fax, 
	cgi.qq, cgi.wechat, cgi.template, cgi.encode_url, cgi.link1_type, cgi.link1_url,cgi.link2_type, cgi.link2_url,
	cgi.link3_type, cgi.link3_url,cgi.link4_type, cgi.link4_url,cgi.id], function(err, rows, fields) {
        if (err) {
            var res = { 'success': false };
            rsp.end(JSON.stringify(res));
            console.log('update db error');
            return;
        }

        if (0 == rows.length) {
            var res = { 'success': false };
            rsp.end(JSON.stringify(res));
            console.log('update user info failed.');
        }
        else {
            var res = { 'success': true, 'data': {'encode_url':cgi.encode_url} };
            rsp.end(JSON.stringify(res));
            console.log('update user info success.');
        }
    });

};
