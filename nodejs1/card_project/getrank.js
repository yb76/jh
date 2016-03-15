var _psql = require('./psql.js');
var _ec = require('./error_code.js');

exports.run = function(message){
    var logger = message.logger;
    var req = message.req;
    var rsp = message.rsp;
    var cgi = message.cgi;
    rsp.setTimeout(10*1000, null);

	_psql.connect(function(err, client, done){
		if(err){
			done();
			throw _ec.CgiError(_ec.UNKNOWN, 'connect to db error: ' + JSON.stringify(err));
		}
		client.query('select id,name,highestscore from user_info order by highestscore DESC limit 20',
					 null, function(err, result){
			done();

			if(err){
				throw _ec.CgiError(_ec.UNKNOWN, 'select highestscore error: ' + JSON.stringify(err));
			}

			if(0 == result.rowCount){
				rsp.end();
				message.logger.info('get highestscore failed.');
			}
			else{
                var res = {};
                for(var row in result.rows)
                {
                	var key = 'user' + row;
                    res[key] = {id:result.rows[row].id.toString(), name:result.rows[row].name.toString(), highestscore:result.rows[row].highestscore.toString()};
               	}

                rsp.end(JSON.stringify(res));
				message.logger.info('get highestscore success.');
			}
		});
	});
};

