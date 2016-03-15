var _psql = require('./psql.js');
var _ec = require('./error_code.js');

var create_user = function(message){
	var done = message['done'];
	var req = message['req'];

	var name = req.data['name'];
	var passwd = req.data['password'];

	var values = [];
    var id = 0;
    values.push(id);
	values.push(name);
	values.push(passwd);

    message.client.query('select id from user_info order by id DESC limit 1',
        null, function(err, result){
            done();

            if(err){
                throw _ec.CgiError(_ec.UNKNOWN, 'select id error: ' + JSON.stringify(err));
            }

            if(0 == result.rowCount){
                values[0] = 1000;
            }
            else{
                var id = parseInt(result.rows[0].id);
                if (id < 1000) values[0] = 1000;
                else values[0] = id + 1;
            }

            var sql = "insert into user_info(id, name, password, highestscore, highestcombo, word) values($1, $2, $3, 0, 0, '草泥马') returning id;"

            message.client.query(sql, values, function(err, result){
                done();
                if(err){
                    throw _ec.CgiError(_ec.UNKNOWN, 'insert user_info error: '+JSON.stringify(err));
                }
                if(0 == result.rowCount){
                    throw _ec.CgiError(_ec.UNKNOWN, 'insert user_info failed. name='+req.data['name']);
                }
                var id = result.rows[0]['id'];
                var res = {succeed: '1', uid: id};
                message.rsp.end(JSON.stringify(res));
                message.logger.info('new user id='+id);
            });
        });
};

var select_name = function(message){
	var done = message['done'];
	message.client.query('select id from user_info where name=$1', [message.req.data['name']], function(err, result){
			if(err){
				done();
				throw _ec.CgiError(_ec.UNKNOWN, 'check name in user_info error: ' + JSON.stringify(err));
			}
			if(0 < result.rowCount){
				done();
				var id = result.rows[0]['id'];
				var res = {succeed: '0', uid: id};
				message.rsp.end(JSON.stringify(res));
				message.logger.info('user has registered, id='+id);
			}
			else{
				create_user(message);
			}
	});
};

exports.run = function(message){
	var req = message.req;
	var rsp = message['rsp'];
	rsp.setTimeout(10*1000, null);
	if(!('name' in req.data) || !('password' in req.data))
	{
		throw _ec.CgiError(_ec.PARAM_ERR, 'register need name & password');
	}

	_psql.connect(function(err, client, done){
		message['client'] = client;
		message['done'] = done;
		if(err){
			done();
			throw _ec.CgiError(_ec.UNKNOWN, 'connect to db error: ' + JSON.stringify(err));
		}
		select_name(message);
	});
};

