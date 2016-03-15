var _psql = require('./psql.js');
var _ec = require('./error_code.js');
var _utils = require('./utils.js');

exports.run = function(message){
    var logger = message.logger;
    var req = message.req;
    var rsp = message.rsp;
    var cgi = message.cgi;

    var filename = cgi.para;
    if (filename.length === 0) {
        rsp.end();
        return;
    }
    var img_conf = require('./configure.js').img;
    var img = require('fs').createReadStream(img_conf.base_path + filename, 'r');
    img.on('error', function(err){
        debugger;
        //logger.error('img error: '+err);
        rsp.writeHead(404);
        rsp.end();
    });
    img.on('end', function(){
        debugger;
        rsp.end();
    });
    img.pipe(rsp);
};
