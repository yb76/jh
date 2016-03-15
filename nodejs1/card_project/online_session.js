var _psql = require('./psql.js');
var _SESSION_TIMEOUT = 3*60*1000;

var _online_user = {};

var logger = require('./logger.js')();
function OuterLogger() { return logger; }

setInterval(function()
{
	var logger = OuterLogger();
	var i = 0;
	var now = new Date().getTime();
	for(id in _online_user)
	{
		i++;
		if(_online_user[id].t + _SESSION_TIMEOUT < now)
		{
			delete _online_user[id];
		}
	}
	//logger.info('online session:' + i.toString());
}, 60*1000);

exports.online = function(id, connection)
{
	if(id in _online_user)
	{
        var now = new Date().getTime();
		_online_user[id].t = now;
        _online_user[id].c = connection;
	}
    else
    {
        _psql.connect(function(err, client, done){
            if(err){
                done();
                throw _ec.CgiError(_ec.UNKNOWN, 'connect to db error: ' + JSON.stringify(err));
            }
            client.query('select name from user_info where id=$1', [id], function(err1, result){
                done();
                if(0 < result.rowCount){
                    var name = result.rows[0]['name'];
                    var now = new Date().getTime();
                    _online_user[id] = { n: name, t: now, c: connection };
                }
            });
        });
    }
}

exports.offline = function(id)
{
	if(id in _online_user)
	{
		delete _online_user[id];
	}
}

exports.getonlineuser = function(id)
{
	if(id in _online_user)
	{
		return _online_user[id];
	}
	return null;
}

exports.verifyonline = function(id)
{
	if(id in _online_user)
	{
		return true;
	}
	return false;
}
