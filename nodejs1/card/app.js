var express = require('express');
var mysql = require('./psql.js');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true, limit: '4mb' }));
app.use(bodyParser.json({limit: '4mb'}));

var busboy = require('connect-busboy');
app.use(busboy({ immediate: true }));

var fs = require('fs');

app.get('/', function(req, rsp) {
	console.log(req.url);
	console.log(req.query);
    rsp.end('Hello, node');
});

app.get('/api/json/getallinfo', function(req, rsp) {
    console.log(req.url);
    console.log(req.query);
    var message = {};
    message["req"] = req;
    message["rsp"] = rsp;
    message["cgi"] = req.query;
    require('./getallinfo.js').run(message);
});

app.get('/api/json/getuserinfo', function(req, rsp) {
    console.log(req.url);
    console.log(req.query);
    var message = {};
    message["req"] = req;
    message["rsp"] = rsp;
    message["cgi"] = req.query;
    require('./getuserinfo.js').run(message);
});

app.get('/api/json/getcominfo', function(req, rsp) {
    console.log(req.url);
    console.log(req.query);
    var message = {};
    message["req"] = req;
    message["rsp"] = rsp;
    message["cgi"] = req.query;
    require('./getcominfo.js').run(message);
});

app.get('/api/json/gettotalcompany', function(req, rsp) {
    console.log(req.url);
    console.log(req.query);
    var message = {};
    message["req"] = req;
    message["rsp"] = rsp;
    message["cgi"] = req.query;
    require('./gettotalcompany.js').run(message);
});

app.get('/api/json/updateuserinfo', function(req, rsp) {
	console.log(req.url);
    console.log(req.query);
	
	var message = {};
	message["req"] = req;
	message["rsp"] = rsp;
	message["cgi"] = req.query;
	require('./updateuserinfo.js').run(message);
});

app.get('/api/json/updatecominfo', function(req, rsp) {
	console.log(req.url);
    console.log(req.query);
	
	var message = {};
	message["req"] = req;
	message["rsp"] = rsp;
	message["cgi"] = req.query;
	require('./updatecominfo.js').run(message);
});

app.get('/api/json/adduser', function(req, rsp) {
	console.log(req.url);
    console.log(req.query);
	
	var message = {};
	message["req"] = req;
	message["rsp"] = rsp;
	message["cgi"] = req.query;
	require('./adduser.js').run(message);
});

app.get('/api/json/addcom', function(req, rsp) {
	console.log(req.url);
    console.log(req.query);
	
	var message = {};
	message["req"] = req;
	message["rsp"] = rsp;
	message["cgi"] = req.query;
	require('./addcom.js').run(message);
});

app.post('/api/json/uploadHeadImage', function(req, rsp) {
	console.log(req.url);
    console.log(req.query);
	
	console.log(req.body);
	rsp.end('Hello, node');
});

/*
app.use(function(req, rsp) {
	console.log('busboy');
	if (req.busboy) {
		req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
			console.log('busboy file');
			rsp.end('Hello, node');
		});
		req.busboy.on('field', function(key, value, keyTruncated, valueTruncated) {
			console.log('busboy field');
		});
	}
});*/

/*
fs.writeFile('c:/a.png', file, function(err){
	if (err) {
		console.log('save error');
	}
	else {
		console.log('save success');
	}
});
*/

app.post('/api/json/uploadWeixinQrImage', function(req, rsp) {
	console.log(req.url);
	
	var message = {};
	message["req"] = req;
	message["rsp"] = rsp;
	message["cgi"] = req.query;
	require('./uploadWeixinQrImage.js').run(message);
});

app.post('/api/json/uploadMainbgImage', function(req, rsp) {
	console.log(req.url);
	
	var message = {};
	message["req"] = req;
	message["rsp"] = rsp;
	message["cgi"] = req.query;
	require('./uploadMainbgImage.js').run(message);
});

app.post('/api/json/uploadComPubQrImage', function(req, rsp) {
	console.log(req.url);
	
	var message = {};
	message["req"] = req;
	message["rsp"] = rsp;
	message["cgi"] = req.query;
	require('./uploadComPubQrImage.js').run(message);
});

app.get('/api/json/getproductsinfo', function(req, rsp) {
	console.log(req.url);
    console.log(req.query);
	
	var message = {};
	message["req"] = req;
	message["rsp"] = rsp;
	message["cgi"] = req.query;
	require('./getproductsinfo.js').run(message);
});

app.get('/api/json/modifyProductInfo', function(req, rsp) {
	console.log(req.url);
	
	var message = {};
	message["req"] = req;
	message["rsp"] = rsp;
	message["cgi"] = req.query;
	require('./modifyProductInfo.js').run(message);
});

app.get('/api/json/addProductInfo', function(req, rsp) {
	console.log(req.url);
	
	var message = {};
	message["req"] = req;
	message["rsp"] = rsp;
	message["cgi"] = req.query;
	require('./addProductInfo.js').run(message);
});

var wechat = require('wechat');
var config = {
  token: 'token9ware8ware',
  appid: 'wx7a12cef1adb45afa',
  encodingAESKey: 'NPfQUBpP2nX9RIEgfFzancjxLAoYKCp5JVLC8v1evx2'
};

app.use('/api/json/wechat', wechat(config, function (req, rsp, next) {
	console.log(req.url);
	
	var message = {};
	message["req"] = req;
	message["rsp"] = rsp;
	message["cgi"] = req.query;
	require('./cardwechat.js').run(message);
}));

app.get('/api/json/deleteProductInfo', function(req, rsp) {
	console.log(req.url);
	
	var message = {};
	message["req"] = req;
	message["rsp"] = rsp;
	message["cgi"] = req.query;
	require('./deleteProductInfo.js').run(message);
});

app.post('/api/json/uploadProductImage', function(req, rsp) {
	console.log(req.url);
	
	var message = {};
	message["req"] = req;
	message["rsp"] = rsp;
	message["cgi"] = req.query;
	require('./uploadProductImage.js').run(message);
});

app.use(busboy({
	highWaterMark: 2 * 1024 * 1024,
	limits: {
		fileSize: 4 * 1024 * 1024
	}
}));

app.listen(9001, function(postData) {
    console.log('Listening on port 9001');
	console.log('post data: ' + postData);
	console.log('current time: ' + Date.now());
});
