var mysql = require('./psql.js');
var fs = require('fs');

exports.run = function(message) {
	console.log('update user.');
    var req = message.req;
    var rsp = message.rsp;
    var cgi = message.cgi;
	var param = message.param;
    rsp.setTimeout(30 * 1000, null);
	
	if (req.busboy) {
		var uid;
		req.busboy.on('field', function(key, value, keyTruncated, valueTruncated) {
			console.log('field value = ' + value);
			uid = value;
		});
		req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
			console.log('busboy file');
			if (uid == undefined) {
				var res = { 'success': false };
				rsp.end(JSON.stringify(res));
				console.log('undefined uid.');
				return;
			}
			
			var basePath = 'c:\\nginx\\html\\card\\user_img\\'+uid;
			var absolutePath = 'c:\\nginx\\html\\card\\user_img\\'+uid+'\\weixinQrImage';
			var relativePath = '\\card\\user_img\\'+uid+'\\weixinQrImage';
			if (!fs.existsSync(basePath)) {
				fs.mkdirSync(basePath);
			}

			var curTick = Date.now();
			file.pipe(fs.createWriteStream(absolutePath+curTick+'.png'));
			file.on('end',function(){
				mysql.queryByPara('update user_info set wechat_qrcode_url=? where id=?', 
				[relativePath+curTick+'.png', uid], function(err, rows, fields) {
					if (err) {
						var res = { 'success': false };
						rsp.end(JSON.stringify(res));
						console.log('update db error');
						return;
					}

					if (0 == rows.length) {
						var res = { 'success': false };
						rsp.end(JSON.stringify(res));
						console.log('update user weixin qr image failed.');
					}
					else {
						var res = { 'success': true, 'data': {'wechat_qrcode_url':relativePath+curTick+'.png'} };
						rsp.end(JSON.stringify(res));
						console.log('update user weixin qr image success.');
					}
				});
			});
		});
	}
	else {
		var res = { 'success': false };
        rsp.end(JSON.stringify(res));
        console.log('no image.');
        return;
	}
};
