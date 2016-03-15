

$(function(){
	 var wechat_developer_reload = function(){
		$('body').append('<input type="button" value="refresh" onclick="window.location.reload();"/>');	 
	} 
	//wechat_developer_reload();
	
	if (window.console) {
		console.info(">>Join us? Email：developer@qietu.com");
	}		
	
	//页面不足一屏，铺满一屏
	$('.layout').css('min-height',$(window).height());

})

