exports.BM_MAGIC = new Buffer([0x42, 0x4d]);
exports.GIF_MAGIC = new Buffer([0x47, 0x49, 0x46, 0x38]);
exports.PNG_MAGIC = new Buffer([0x89, 0x50, 0x4e, 0x47]);
exports.JPG_MAGIC = new Buffer([0xff, 0xd8, 0xff, 0xe0]);

exports.checkImg = function(img){
	if(0x42 === img[0] && 0x4d === img[1]) retrurn [true, 'bitmap'];
	else if(0x47 === img[0] && 0x49 === img[1] && 0x46 === img[2] && 0x38 === img[3]) return [true, 'gif'];
	else if(0x89 === img[0] && 0x50 === img[1] && 0x4e === img[2] && 0x47 === img[3]) return [true, 'png'];
	else if(0xff === img[0] && 0xd8 === img[1] && 0xff === img[2] && 0xe0 === img[3]) return [true, 'jpg'];

	return [false, 'unknown'];
};

exports.isStringMember = function(obj, member, min, max){
	if('object' === typeof(obj))
		if(member in obj)
			if('string' === typeof(obj[member]))
			{
				if('number' !== typeof(min)) return true;
				else if(obj[member].length >= min)
				{
					if('number' !== typeof(max)) return true;
					else if(obj[member].length <= max) return true;
				}
			}
	return false;
}

exports.isNumberMember = function(obj, member, min, max){
	if('object' === typeof(obj))
		if(member in obj)
			if('number' === typeof(obj[member]))
			{
				if('number' !== typeof(min)) return true;
				else if(obj[member] >= min)
				{
					if('number' !== typeof(max)) return true;
					else if(obj[member] <= max) return true;
				}
			}
	return false;
}

exports.isObjectMember = function(obj, member){
	if('object' === typeof(obj) && member in obj && 'object' === typeof(obj[member])) return true;
	return false;
}

exports.verifyLogin = function(cookie)
{
	var login = require('./login_session.js');
	var ec = require('./error_code.js');

	if(!('uid' in cookie) || !('usession' in cookie))
	{
		throw ec.CgiError(ec.NOT_LOGIN, 'no cookie uid or usession');
	}

	if(!require('./login_session.js').verifySession(cookie['uid'], cookie['usession']))
	{
		throw ec.CgiError(ec.NOT_LOGIN, 'invalid uid='+cookie['uid']
			 +', usession='+cookie['usession']);
	}
}

