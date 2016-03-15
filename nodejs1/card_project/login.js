var _psql = require('./psql.js');
var _ec = require('./error_code.js');

exports.run = function(message){
	var req = message['req'];
	var rsp = message['rsp'];
	rsp.setTimeout(10*1000, null);

	if(!('name' in req.data) || !('password' in req.data))
	{
		throw _ec.CgiError(_ec.PARAM_ERR, 'login need name & password');
	}

	_psql.connect(function(err, client, done){
		if(err){
			done();
			throw _ec.CgiError(_ec.UNKNOWN, 'connect to db error: ' + JSON.stringify(err));
		}
		client.query('select id from user_info where name = $1 and password = $2',
					 [req.data.name, req.data.password], function(err, result){
			done();

			if(err){
				throw _ec.CgiError(_ec.UNKNOWN, 'select user_info error: ' + JSON.stringify(err));
			}

			if(0 == result.rowCount){
				var res = {succeed: '0', uid: '0'};
				rsp.end(JSON.stringify(res));
				message.logger.info('login failed.');
			}
			else{
				var id = result.rows[0].id;
				var res = {succeed: '1', uid: id};
                //message.logger.info(res.toString());
				rsp.end(JSON.stringify(res));
				message.logger.info('user id='+ id +' login');
			}			
		});
	});
};

