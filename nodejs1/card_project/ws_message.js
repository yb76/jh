var _psql = require('./psql.js');
var _challenge_session = require('./challenge.js');
var _online_session = require('./online_session.js');

exports.run = function(message, connection){
	var msg = JSON.parse(message.utf8Data.toString());
	if(!('type' in msg))
	{
		throw _ec.CgiError(_ec.PARAM_ERR, 'websocket message need a type');
	}

	if (msg.type === 'online')
	{
		_online_session.online(msg.myid, connection);
		connection.sendUTF("online ack");
	}
	else if (msg.type === 'offline')
	{
		_online_session.offline(msg.myid);
		connection.sendUTF("offline ack");
	}
	else if (msg.type === 'challenge')
	{
		_psql.connect(function(err, client, done){
			if(err){
				done();
				throw _ec.CgiError(_ec.UNKNOWN, 'connect to db error: ' + JSON.stringify(err));
			}
			client.query('select id from user_info where name=$1', [msg.opname], function(err1, result){
				done();
				if(0 < result.rowCount){
					var opid = result.rows[0]['id'];
					if (_online_session.verifyonline(opid))
					{
						var opuser = _online_session.getonlineuser(opid);
						var res = {type: 'challenge_notify', opid: msg.myid, opname: msg.myname};
						opuser.c.sendUTF(JSON.stringify(res));
						var res1 = {type: 'challenge_ack', succeed: '1'};
						connection.sendUTF(JSON.stringify(res1));
					}
					else
					{
						var res1 = {type: 'challenge_ack', succeed: '0'};
						connection.sendUTF(JSON.stringify(res1));
					}
				}
				else {
					var res1 = {type: 'challenge_ack', succeed: '0'};
					connection.sendUTF(JSON.stringify(res1));
				}
			});
		});
	}
	else if (msg.type === 'challenge_accept')
	{
		if (_online_session.verifyonline(msg.opid))
		{
			var opuser = _online_session.getonlineuser(msg.opid);
			var res = {type: 'challenge_accept', opid: msg.myid, opname: msg.myname};
			opuser.c.sendUTF(JSON.stringify(res));
		}
	}
	else if (msg.type === 'challenge_refuse')
	{
		if (_online_session.verifyonline(msg.opid))
		{
			var opuser = _online_session.getonlineuser(msg.opid);
			var res = {type: 'challenge_refuse', opid: msg.myid, opname: msg.myname};
			opuser.c.sendUTF(JSON.stringify(res));
		}
	}
	else if (msg.type === 'close')
	{
		_online_session.offline(msg.myid);
		_challenge_session.logout(msg.myid);
	}
    else if (msg.type === 'makepair_ready')
    {
        _challenge_session.makepair(msg.myid, connection);
    }
    else if (msg.type === 'updatescore')
    {
        _challenge_session.us(msg.myid, msg.myscore, msg.mycombo);
        var opuser = _challenge_session.getUser(msg.opid);
        if (opuser != null)
        {
            var opres = {type: 'updatescore', opscore: opuser.s.toString(), opcombo: opuser.c.toString()};
            connection.sendUTF(JSON.stringify(opres));
        }
    }
    else if (msg.type === 'finish_ready')
    {
        _challenge_session.us(msg.myid, msg.myscore, msg.mycombo);
        _challenge_session.finish(msg.myid, connection, msg.opid);
    }
    else if (msg.type === 'makepair_cancel')
    {
        _challenge_session.logout(msg.myid);
    }
};





