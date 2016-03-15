var mysql = require('./psql.js');
var fs = require('fs');

exports.run = function(message) {
	console.log('update company.');
    var req = message.req;
    var rsp = message.rsp;
    var cgi = message.cgi;
	var param = message.param;
    rsp.setTimeout(30 * 1000, null);
	
	if (req.busboy) {
		var com_id;
		req.busboy.on('field', function(key, value, keyTruncated, valueTruncated) {
			console.log('field value = ' + value);
			com_id = value;
		});
		req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
			console.log('busboy file');
			if (com_id == undefined) {
				var res = { 'success': false };
				rsp.end(JSON.stringify(res));
				console.log('undefined com id.');
				return;
			}
			
			var basePath = 'c:\\nginx\\html\\card\\com_img\\'+com_id;
			var absolutePath = 'c:\\nginx\\html\\card\\com_img\\'+com_id+'\\companyPubImage';
			var relativePath = '\\card\\com_img\\'+com_id+'\\companyPubImage';
			if (!fs.existsSync(basePath)) {
				fs.mkdirSync(basePath);
			}
			
			var curTick = Date.now();
			file.pipe(fs.createWriteStream(absolutePath+curTick+'.png'));
			file.on('end',function(){
				mysql.queryByPara('update com_info set com_pub_qrImg_url=? where com_id=?', 
				[relativePath+curTick+'.png', com_id], function(err, rows, fields) {
					if (err) {
						var res = { 'success': false };
						rsp.end(JSON.stringify(res));
						console.log('update db error');
						return;
					}

					if (0 == rows.length) {
						var res = { 'success': false };
						rsp.end(JSON.stringify(res));
						console.log('update company pub qr image failed.');
					}
					else {
						var res = { 'success': true, 'data': {'com_pub_qrImg_url':relativePath+curTick+'.png'} };
						rsp.end(JSON.stringify(res));
						console.log('update company pub qr image success.');
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
