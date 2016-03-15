var _psql = require('./psql.js');
var _ec = require('./error_code.js');

exports.run = function(message){
    var req = message['req'];
    var rsp = message['rsp'];
debugger;
    _psql.connect(function(err, client, done){
        if(err){
            done();
            throw _ec.CgiError(_ec.UNKNOWN, 'connect to db error: ' + JSON.stringify(err));
        }
        client.query('update user_info set word = $1 where id = $2',
            [req.data.word, req.data.myid], function(err, result){
                done();
debugger;
                if(err){
                    throw _ec.CgiError(_ec.UNKNOWN, 'update user_info error: ' + JSON.stringify(err));
                }

                if(0 == result.rowCount){
                    var res = {succeed: '0'};
                    rsp.end(JSON.stringify(res));
                    message.logger.info('update word failed.');
                }
                else{
                    var res = {succeed: '1'};
                    rsp.end(JSON.stringify(res));
                    message.logger.info('update word success.');
                }
            });

        client.query('select count from hotword_count where word = $1',
            [req.data.word], function(err, result){
                done();
debugger;
                if(err){
                    throw _ec.CgiError(_ec.UNKNOWN, 'select hotword_count error: ' + JSON.stringify(err));
                }
                if(0 == result.rowCount){
                    client.query('insert into hotword_count (word, count) values ($1, 1);',
                        [req.data.word], function(err, result){
                            done();
                        });
                }
                else{
                    var cnt = result.rows[0].count+1;
                    client.query('update hotword_count set count = $1 where word = $2',
                        [cnt, req.data.word], function(err, result){
                            done();
                        });
                }
            });
    });
};
