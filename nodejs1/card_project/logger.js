var conf = require('./configure.js');

module.exports = (function(){
	var ext_info = '';
	if(0 < arguments.length && 'object' === typeof(arguments[0]))
	{
		var info = arguments[0];
		if('url' in info) ext_info = 'url=' + info.url;
		if('uid' in info) ext_info += ', uid=' + info.uid;
	}
	if(0 < ext_info.length) ext_info = "[" + ext_info + "]";

	var fmt = "{{timestamp}}<{{title}}-{{file}}:{{line}}>" + ext_info + " {{message}}";

	var logger = new require('tracer')[conf.log_function]({
		level: conf.log_level,
		root: conf.log_path,
		dateformat: "yyyy-mm-dd HH:MM:ss.l",
		format: fmt,
	});
	return logger;
});
