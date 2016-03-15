var _online_session = require('./online_session.js');
var _robot = require('./robot.js');

var _SESSION_TIMEOUT = 60*1000;

var _ready_users = {};
var _ready_responses = {};
var _finish_responses = {};


var logger = require('./logger.js')();
function OuterLogger() { return logger; }

setInterval(function()
{
	var logger = OuterLogger();
	var now = new Date().getTime();
	for(id in _ready_users)
	{
		if(_ready_users[id].t + _SESSION_TIMEOUT < now)
		{
			removeReadyUser(id);
			removeReadyResponse(id);
			removeFinishResponse(id);
		}
	}

    for(id in _ready_responses)
    {
        if(_ready_users[id].t + 10*1000 < now)
        {
            var robot = _robot.getOneRobot();
            if (robot != null) {
                makepairRobot({id:robot.id.toString(), name:robot.name});
            }
        }
        break;
    }

    for(id in _ready_users)
    {
        if (_robot.isRobot(id)) {
            var robot = _robot.getRobot(id);
            if (robot.level === 0) {
                _ready_users[id].c += 3;
                _ready_users[id].s += _ready_users[id].c * 6;
            }
            else if (robot.level === 1) {
                _ready_users[id].c += 3;
                _ready_users[id].s += _ready_users[id].c * 8;
            }
            else if (robot.level === 2) {
                _ready_users[id].c += 3;
                _ready_users[id].s += _ready_users[id].c * 10;
            }
            else if (robot.level === 3) {
                _ready_users[id].c += 3;
                _ready_users[id].s += _ready_users[id].c * 12;
            }
            else if (robot.level === 4) {
                _ready_users[id].c += 3;
                _ready_users[id].s += _ready_users[id].c * 14;
            }
        }
    }

}, 1*1000);

function newReadyUser(id, conn)
{
    var logger = OuterLogger();
    logger.info('id = ' + id.toString() + ' ready.');

	removeReadyUser(id);
	removeReadyResponse(id);
	var now = new Date().getTime();
	_ready_users[id] = { s:0, c:0, t:now };
	_ready_responses[id] = conn;
}

function makepairedUser(id1, id2)
{
	removeReadyUser(id1);
	removeReadyUser(id2);
	var now = new Date().getTime();
	_ready_users[id1] = { s:0, c:0, t:now };
	_ready_users[id2] = { s:0, c:0, t:now };
}

function getReadyUser(id)
{
	if(id in _ready_users)
	{
		return _ready_users[id];
	}
	return null;
}

function removeReadyUser(id)
{
	if(id in _ready_users)
	{
        var logger = OuterLogger();
        logger.info('id = ' + id.toString() + ' canceled from ready_users.');
		delete _ready_users[id];
	}
}

function removeReadyResponse(id)
{
	if(id in _ready_responses)
	{
        var logger = OuterLogger();
        logger.info('id = ' + id.toString() + ' canceled from ready responses.');
		delete _ready_responses[id];
	}
}

function removeFinishResponse(id)
{
	if(id in _finish_responses)
	{
		delete _finish_responses[id];
	}
}

function updateUserScore(id, score, combo)
{
	if(id in _ready_users)
	{
		_ready_users[id].s = score;
		_ready_users[id].c = combo;
	}
}

function makePair()
{
	var id1 = null;
	var id2 = null;
    var rsp1 = null;
    var rsp2 = null;
	var index = 0;
	for(id in _ready_responses)
	{
		if(index === 0)
		{
			id1 = id;
            rsp1 = _ready_responses[id];
			index = 1;
		}
		else if(index === 1)
		{
			id2 = id;
			rsp2 = _ready_responses[id];
			index = 0;
			var user1 = _online_session.getonlineuser(id1);
			var user2 = _online_session.getonlineuser(id2);
			var name1 = '';
			var name2 = '';
			if(rsp1 != null && rsp2 != null&& user1 != null && user2 != null) {
				name1 = user1.n;
				name2 = user2.n;

                var res1 = {type: 'makepair_ack', myid: id1, opid: id2, opname: name2};
                rsp1.sendUTF(JSON.stringify(res1));
                var res2 = {type: 'makepair_ack', myid: id2, opid: id1, opname: name1};
                rsp2.sendUTF(JSON.stringify(res2));

                delete _ready_responses[id1];
                delete _ready_responses[id2];

                var logger = OuterLogger();
                logger.info(id1.toString() + ' and ' + id2.toString() + ' makepaired.');
			}
		}
	}
}

function cancelReadyUser(id)
{
    removeReadyUser(id);
    removeReadyResponse(id);
}

function finishChallenge(myid, conn, opid)
{
    var logger = OuterLogger();
    logger.info('id = ' + myid.toString() + ' finish challenge.');
	var isFound = false;

    if(_robot.isRobot(opid))
    {
        var myuser = getReadyUser(myid);
        var opuser = getReadyUser(opid);
        var myres = {type: 'finish_ack', opscore: opuser.s.toString(), opcombo: opuser.c.toString()};
        conn.sendUTF(JSON.stringify(myres));
        removeReadyUser(myid);
        removeReadyUser(opid);
        return;
    }

	for(id in _finish_responses)
	{
		if(id === opid)
		{
			isFound = true;
			break;
		}
	}

	if(isFound)
	{
		var myuser = getReadyUser(myid);
		var opuser = getReadyUser(opid);
        if (myuser != null && opuser != null) {
            var myres = {type: 'finish_ack', opscore: opuser.s.toString(), opcombo: opuser.c.toString()};
            conn.sendUTF(JSON.stringify(myres));

            var opres = {type: 'finish_ack', opscore: myuser.s.toString(), opcombo: myuser.c.toString()};
            _finish_responses[opid].sendUTF(JSON.stringify(opres));

            delete _finish_responses[opid];
            removeReadyUser(myid);
            removeReadyUser(opid);
        }
	}
	else
	{
		_finish_responses[myid] = conn;
	}
}


function makepairRobot(robot)
{
    for(id in _ready_responses)
    {
        var id1 = id;
        var rsp1 = _ready_responses[id];
        var user1 = _online_session.getonlineuser(id1);
        var name1 = '';
        if(rsp1 != null && user1 != null) {
            name1 = user1.n;

            var now = new Date().getTime();
            var id2 = robot.id;
            var name2 = robot.name;
            _ready_users[id2] = { s:0, c:0, t:now };
            var res1 = {type: 'makepair_ack', myid: id1, opid: id2, opname: name2};
            rsp1.sendUTF(JSON.stringify(res1));
            delete _ready_responses[id1];

            var logger = OuterLogger();
            logger.info(name1.toString() + ' and ' + name2.toString() + ' id ' + id2.toString() + ' robot makepaired.');
        }
        break;
    }
}

exports.run = function(message){
	var req = message['req'];
	var rsp = message['rsp'];
	if(!('type' in req.data))
	{
		throw _ec.CgiError(_ec.PARAM_ERR, 'need fighting type');
	}

	if(req.data.type === 'makepair')
	{
		var myid = req.data.myid;
		rsp.setTimeout(15*1000, function() {
            var logger = OuterLogger();
            logger.info('id = ' + myid.toString() + ' ready response timeout.');
			removeReadyUser(myid);
			removeReadyResponse(myid);
		});
		newReadyUser(req.data.myid, rsp);
		makePair();
	}
	else if(req.data.type === 'cancel')
	{
		cancelReadyUser(req.data.myid);
		var res = {type: 'cancel'};
		rsp.end(JSON.stringify(res));
	}
	else if(req.data.type === 'updatescore')
	{
		updateUserScore(req.data.myid, req.data.myscore, req.data.mycombo);
		var opuser = getReadyUser(req.data.opid);
		if(opuser != null) {
			var opres = {type: 'updatescore', opscore: opuser.s.toString(), opcombo: opuser.c.toString()};
			rsp.end(JSON.stringify(opres));
		}
		else {
			rsp.end();
		}
	}
	else if(req.data.type === 'finish')
	{
		var myid = req.data.myid;
		rsp.setTimeout(5*1000, function() {
			removeFinishResponse(myid);
		});
		updateUserScore(req.data.myid, req.data.myscore, req.data.mycombo);
		finishChallenge(req.data.myid, req.data.opid, rsp);
	}
	else if(req.data.type === 'makepaired')
	{
		var myid = req.data.myid;
		var opid = req.data.opid;
		makepairedUser(req.data.myid, req.data.opid);
		var res = {type: 'makepaired'};
		rsp.end(JSON.stringify(res));
	}
};

exports.logout = function(id)
{
	removeReadyUser(id);
	removeReadyResponse(id);
	removeFinishResponse(id);
};

exports.us = function(id, score, combo)
{
    updateUserScore(id, score, combo);
};

exports.getUser = function(id)
{
    return getReadyUser(id);
};

exports.makepair = function(myid, conn)
{
    newReadyUser(myid, conn);
    makePair();
};

exports.finish = function(myid, conn, opid)
{
    finishChallenge(myid, conn, opid);
};
