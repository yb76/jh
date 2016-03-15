var _psql = require('./psql.js');
var _ec = require('./error_code.js');

exports.run = function(message){
	var req = message['req'];
	var rsp = message['rsp'];

	_psql.connect(function(err, client, done){
		if(err){
			done();
			throw _ec.CgiError(_ec.UNKNOWN, 'connect to db error: ' + JSON.stringify(err));
		}
		client.query('update user_info set highestscore = $1, highestcombo = $2 where id = $3',
					 [req.data.highestscore, req.data.highestcombo, req.data.myid], function(err, result){
			done();

			if(err){
				throw _ec.CgiError(_ec.UNKNOWN, 'update user_info error: ' + JSON.stringify(err));
			}

			if(0 == result.rowCount){
				var res = {succeed: '0'};
				rsp.end(JSON.stringify(res));
				message.logger.info('update score failed.');
			}
			else{
				var res = {succeed: '1'};
				rsp.end(JSON.stringify(res));
				message.logger.info('update score success.');
			}			
		});
	});
};

