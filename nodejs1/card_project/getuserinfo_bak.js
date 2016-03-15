var _psql = require('./psql.js');
var _ec = require('./error_code.js');

exports.run = function(message){
    var logger = message.logger;
    var req = message.req;
    var rsp = message.rsp;
    var cgi = message.cgi;
    rsp.setTimeout(10*1000, null);
    debugger;
    console.log(cgi);
    _psql.connect(function (err) {
		if(err){
			throw _ec.CgiError(_ec.UNKNOWN, 'connect to db error: ' + JSON.stringify(err));
		}

		var idInt = parseInt(cgi.para);
		console.log(idInt);
		_psql.query('select * from user_info where id='+idInt, function (err, rows, fields) {
                    console.log('select callback'+rows[0]+fields[0]);
                    if (err) {
                        throw _ec.CgiError(_ec.UNKNOWN, 'select user info error: ' + JSON.stringify(err));
                    }

                    if (0 == rows.count) {
                        var res = { abc: 'xyz' };
                        rsp.end(JSON.stringify(res));
                        message.logger.info('get user info failed.');
                    }
                    else {
                        var res = rows[0];
                        rsp.end(JSON.stringify(res));
                        message.logger.info('get user info success.');
                    }
                });

	});
};

