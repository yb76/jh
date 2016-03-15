exports.run = function(message){
    var logger = message.logger;
    var req = message.req;
    var rsp = message.rsp;
    var cgi = message.cgi;
    rsp.setTimeout(10*1000, null);
    debugger;
    console.log(cgi);
    var res = { abc: 'xyz' };
    rsp.end(JSON.stringify(res));
    message.logger.info('get user info failed.');
};

