var mysql = require('./psql.js');
var fs = require('fs');

exports.run = function(message) {
	console.log('update product.');
    var req = message.req;
    var rsp = message.rsp;
    var cgi = message.cgi;
	var param = message.param;
    rsp.setTimeout(30 * 1000, null);
	
	if (req.busboy) {
		var com_id;
		var prod_id;
		req.busboy.on('field', function(key, value, keyTruncated, valueTruncated) {
			console.log('field value = ' + value);
			var para = JSON.parse(value);
			com_id = para.com_id;
			prod_id = para.prod_id;
		});
		
		req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
			console.log('busboy file');
			if (prod_id == undefined) {
				var res = { 'success': false };
				rsp.end(JSON.stringify(res));
				console.log('undefined prod id.');
				return;
			}
			
			var basePath = 'c:\\nginx\\html\\card\\com_img\\'+com_id;
			var absolutePath = 'c:\\nginx\\html\\card\\com_img\\'+com_id+'\\productImage';
			var relativePath = '\\card\\com_img\\'+com_id+'\\productImage';
			if (!fs.existsSync(basePath)) {
				fs.mkdirSync(basePath);
			}
			
			var curTick = Date.now();
			file.pipe(fs.createWriteStream(absolutePath+curTick+'.png'));
			file.on('end',function(){
				mysql.queryByPara('update product_info set prod_image_url=? where prod_id=?', 
				[relativePath+curTick+'.png', prod_id], function(err, rows, fields) {
					if (err) {
						var res = { 'success': false };
						rsp.end(JSON.stringify(res));
						console.log('update db error');
						return;
					}

					if (0 == rows.length) {
						var res = { 'success': false };
						rsp.end(JSON.stringify(res));
						console.log('update product qr image failed.');
					}
					else {
						var res = { 'success': true, 'data': {'prod_image_url':relativePath+curTick+'.png'} };
						rsp.end(JSON.stringify(res));
						console.log('update product image success.');
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
