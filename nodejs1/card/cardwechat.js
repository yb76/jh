

exports.run = function(message) {
	console.log('wechat.');
    var req = message.req;
    var rsp = message.rsp;
    var cgi = message.cgi;
    rsp.setTimeout(30 * 1000, null);
	var wemsg = req.weixin;


    console.log(wemsg);
	if(wemsg.MsgType == 'event' && wemsg.Event == 'CLICK' ) {
		console.log(wemsg.EventKey);
		if (wemsg.EventKey === 'V1001_UPLOAD') {
			 rsp.reply({
              content: '请发送图片文件',
              type: 'text'
              });
		} else  {
            rsp.reply([{
              title: '名扬四海',
              description: '名片测试',
	          picurl: 'http://oi66.tinypic.com/119x8d0.jpg',
              url: 'http://www.9ware.cn/card/defde51cf91e1e03/card.html?_=MTAwMDAxXzEwMDE'
		     }]);
        }

	}
    else if (wemsg.Content === '1') {
     rsp.reply({
      content: 'got you',
      type: 'text'
      });
    } else {
        rsp.reply([{
        title: '名扬四海',
        description: '名片测试',
		picurl: 'http://oi66.tinypic.com/119x8d0.jpg',
        url: 'http://www.9ware.cn/card/defde51cf91e1e03/card.html?_=MTAwMDAxXzEwMDE'
		}]);
    }
};
