var _psql = require('./psql.js');
var _ec = require('./error_code.js');
var _utils = require('./utils.js');

exports.run = function(message){
    var req = message.req;
    var rsp = message.rsp;
    var mp_parser = message.mp_parser;

    var imagename = 'default.png';
    mp_parser.on('error', function(err){
        var res = {succeed: '0', url: ''};
        rsp.end(JSON.stringify(res));
        return;
    }).on('file', function(fieldname, file, filename, encoding, mimetype){
            mp_parser.removeAllListeners('file');
            imagename = filename;
            var content = new Buffer('');
            var img = [false, 'unknown'];

            file.on('data', function(chunk){
                content = Buffer.concat([content, chunk]);
                if(1024*1024*5 < content.length){
                    file.removeAllListeners('data');
                    var res = {succeed: '0', url: ''};
                    rsp.end(JSON.stringify(res));
                    return;
                }else if(false === img[0]){
                    if(4 > content.length) return;
                    img = _utils.checkImg(content);
                    if(!img[0]){
                        file.removeAllListeners('data');
                        var res = {succeed: '0', url: ''};
                        rsp.end(JSON.stringify(res));
                        return;
                    }
                }
            }).on('end', function(){
                    if(4 > content.length) return end(_ec.INVALID_IMG, 'img is too small');

                    var img_conf = require('./configure.js').img;
                    require('fs').writeFile(img_conf.base_path + imagename, content, function(err){
                        if(err) {
                            var res = {succeed: '0', url: ''};
                            rsp.end(JSON.stringify(res));
                            return;
                        }
                        message.logger.info('new img. type='+img[1]+', size='+content.length+', path='+img_conf.base_path);
                        var res = {succeed: '1', url: 'http://'+img_conf.host+':'+img_conf.port};
                        rsp.end(JSON.stringify(res));
                        return;
                    });
                });
        });

    req.pipe(mp_parser);
};
