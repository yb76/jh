var http = require('http');

var conf = require('./configure.js');
var logger = require('./logger.js')();
var ec = require('./error_code.js');

logger.info("starting server. port="+conf.http.listen_port);

function OuterLogger() { return logger; }

function ParserUrl(urlPath)
{
    var temp = urlPath;
    if (temp[0] === '/') temp = temp.substring(1, temp.length);
    var index = temp.indexOf('/');
    if (index === -1) return {command:temp, para:''};
    else return {command:temp.substring(0, index), para:temp.substring(index+1, temp.length)};
}

var server = http.createServer(function(req, rsp) {
    var req_domain = require('domain').create();
    req_domain.add(req);
    req_domain.add(rsp);

    var logger = OuterLogger();
    req_domain.on('error', function(e) {
        logger.error(e);
        if ('function' === typeof e.callback) e.callback();
        if ('cgi 404' === e.code) {
            rsp.writeHead(404);
        } else if ('CGI_ERROR' === e.code) {
            rsp.writeHead(200);
        } else {
            rsp.writeHead(500);
        }
        if ('rsp' in e) rsp.end(e.rsp);
        else rsp.end();
    });

    req_domain.run(function() {
        var message = {};
        message["logger"] = logger;
        message["req"] = req;
        message["rsp"] = rsp;

        console.log(req.url);

        var cgi = ParserUrl(req.url);
        message["cgi"] = cgi;
        logger.info("method:" + cgi.command);

        if ('get' === req.method.toLowerCase()) {
            require('./' + cgi.command + '.js').run(message);
        } else if ('post' === req.method.toLowerCase()) {
            if ('image' === cgi.command) {
                var mp = require('busboy'); // multipart parser
                message.mp_parser = new mp({ headers: req.headers });
                require('./' + cgi.command + '.js').run(message);
            }
            else {
                req.on('readable', function() {
                    var chunk = req.read(parseInt(req.headers['content-length']));
                    if (null === chunk) return;
                    req.data = JSON.parse(chunk.toString());
                    require('./' + cgi.command + '.js').run(message);
                });
            }
        } else throw ec.CgiError(ec.UNKNOWN, 'unknown http method=' + req.method);
    });
});

server.listen(conf.http.listen_port);