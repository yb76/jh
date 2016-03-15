var _challenge_session = require('./challenge.js');
var _online_session = require('./online_session.js');

exports.run = function(message){
	var req = message['req'];
	var rsp = message['rsp'];
	_challenge_session.logout(req.data.myid);
	_online_session.offline(req.data.myid);
	rsp.end();
};

