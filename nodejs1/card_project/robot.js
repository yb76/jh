var _psql = require('./psql.js');

var _robots = {};
var index = 0;

var logger = require('./logger.js')();
function OuterLogger() { return logger; }

exports.createRobots = function() {
    _psql.connect(function(err, client, done){
        if(err){
            done();
            throw _ec.CgiError(_ec.UNKNOWN, 'connect to db error: ' + JSON.stringify(err));
        }
        client.query('select id, name from robot_info',
            [], function(err, result){
                done();

                if(err){
                    throw _ec.CgiError(_ec.UNKNOWN, 'select user_info error: ' + JSON.stringify(err));
                }
                var logger = OuterLogger();

                if(0 < result.rowCount){
                    var i= 0;
                    for (i=0; i<result.rowCount; i++)
                    {
                        _robots[result.rows[i].id.toString()] = {id:result.rows[i].id.toString(), name:result.rows[i].name, level:(i%5)};
                    }
                    logger.info('create ' + i.toString() + ' robots success.');
                }
                else{
                    logger.info('create robot failed.');
                }
            });
    });
}

exports.getOneRobot = function(){
    var ran = parseInt(Math.random()*10);
    var i = ran % 10 + 1;
    if (i.toString() in _robots)
    {
        return _robots[i.toString()];
    }
    return null;
}

exports.getRobot = function(id){
    if (id in _robots)
    {
        return _robots[id];
    }
    return null;
}

exports.isRobot = function(id)
{
    if (id in _robots)
        return true;
    else
        return false;
}