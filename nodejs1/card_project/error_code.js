exports.UNKNOWN = '{"ec": 1, "msg": "unknown error"}';
exports.NOT_LOGIN = '{"ec": 2, "msg": "not login"}';
exports.INVALID_METHOD = '{"ec": 3, "msg": "invalid http method"}';
exports.PARAM_ERR = '{"ec": 4, "msg": "param err"}';
exports.EXISTS_VC = '{"ec": 5, "msg": "verify code exists"}';
exports.INVALID_VC = '{"ec": 6, "msg": "invalid verify code"}';
exports.REGISTERED = '{"ec": 7, "msg": "registered"}';
exports.AUTH_FAIL = '{"ec": 8, "msg": "user or password error"}';
exports.UNKNOWN_DATA = '{"ec": 9, "msg": "unknown data type"}';
exports.INVALID_IMG = '{"ec": 10, "msg": "invalid img type"}';
exports.IMG_TOO_BIG = '{"ec": 11, "msg": "img is too big"}';
exports.USER_NOT_EXISTS = '{"ec": 12, "msg": "user not exists"}';

exports.CgiError = function(rsp, msg, callback){
	var e = {};

	var stacklist = (new Error()).stack.split('\n').slice(2);
	var stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi;
	var stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi;
	var s = stacklist[0], sp = stackReg.exec(s) || stackReg2.exec(s);
	if(sp && sp.length === 5){
		e.src = require('path').basename(sp[2]) + ':' + sp[3];
	}

	e.code = 'CGI_ERROR';
	e.msg = msg;
	e.rsp = rsp;
	if('function' === typeof callback)
		e.callback = callback;
	return e;
};

