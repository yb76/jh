/**
 * ��Ƭ����JS
 */
//�Ƿ��ֻ���
function isMobile(){
	var flag = null;
	var ua = navigator.userAgent.toLowerCase();
	if(ua.indexOf("mobile")>-1){
		flag = true;
	}else{
		flag = false; 
	}
	return flag;
}
//�Ƿ�΢��
function isWeixin(){
	var flag = null;
	var ua = navigator.userAgent.toLowerCase();
	if(ua.indexOf("micromessenger")>-1){
		flag = true;
	}else{
		flag = false; 
	}
	return flag;
}

//��ά��
function ajaxGetQr(openId,isCOM,callback) {
	var picUrl = null;
	$.ajax({
		type : "post",
		url : "/app/bizcard/ajaxQrCode.do",
		data : {"openId":openId, "com": isCOM},
		dataType:"json",
		success : function(datas) {
			if(datas.success == true){
				picUrl = datas.data;
				callback(picUrl);
			}else{
				$.flytip("������ʲô���Ծ�Ŷ��");
			}
		}
	});
}

//like
function likeAction(data) {
	var likeObj = $("#jsClickLike").find(".info-number");
	if(data == true) {
		likeObj.html(parseInt(likeObj.html()) + 1);
		$.vConfirm({
			"msg" : "�ð�ร����޳ɹ�^_^",
			"tit" : "��ʾ",
			"titLine" : true,
			"width": "90%",
			"okBtnText" : "�����ղ�",
			"closeBtnText" : "�� ��",
			"ok" : {
				"callback" : function(){
					$(".js-collect").click();
				},
				"isClose" : true
			}
		});
	} else if(data == false){
		$.flytip("ͬһ�������ֻ�ܵ���һ��");
	}
}

function ajaxUserAction(friendId, type, isCOM, callBack){
	$.ajax({
		async : true,
		type : "post",
		url : "/app/bizcard/ajaxUserAction.do",
		data : {"friendId":friendId, "type":type, "com":isCOM},
		error: function(){
			$.flytip("������ʲô���Ծ�Ŷ��");
		},
		success : function(data) {
			if(callBack){
				callBack(data);
			}
		}
	});
}


//�����������ʾ
function sideNavTip(){
	if(!$.readCookie("sideNavTip")){
		$.writeCookie("sideNavTip","1","4800h");
		var $sideNavTip = $("#sideNavTip");
		$sideNavTip
		.show()
		.click(function(){
			$(this).hide();
		});
	}
}

//�������ʾ
function togglePage(){
	$(".js-moreList,.item-back").toggleClass("more-list-sh");
	//$(".namecard-page-relative, .js-sharebox").toggleClass("toggle-page");
	$("#superMask").toggleClass("show");
}

//��˽���ã��绰���ܲ�����ʾ
function forbiddenTell(){
	$.flytip("�Է���������˽���������ܲ���绰");
}

//-----------���ɲ�����ά��-------------
function createSence(id,type){
	$.ajax({
		type : "post",
		url : "/sence/tempticket.do",
		data : {"id":id,type:type},
		error: function(){
			$.flytip("������ʲô���Ծ�Ŷ��");
		},
		success : function(data) {
			if(data && data.success){
				var ticket = data.data;
				$.vAlert({
					"msg" : "<img width=210 height=210 src='https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket="+ticket+"'><br>��ʱ��ά�룬��Ҫ����ӡˢ",
					"tit" : "΢��ɨ���ղ��ҵ���Ƭ",
					"width": "320px",
					"okBtnText" : "�� ��"
				});
			}else{
				$.flytip("������ʲô���Ծ�Ŷ��");
			}
		}
	});
}

//���ű�������
function playBgMusic(){
	
	if($("#musicBox").length > 0){
		var musicPlayer = document.getElementById("musicPlayer");
		var tsflag = true;
		
		function mstop(){
			musicPlayer.pause();
			$("#musicBox").addClass("stop").removeClass("play");
		}
		
		if($.readCookie("musicState")){
			mstop();
		}else{
			$("body").on("touchstart",function(){
				if(tsflag){
					musicPlayer.play();
					tsflag = false;
				}
			});
		}

		$("#musicBox").click(function() {
			var $this = $(this);
			if ($this.hasClass("play")) {
				mstop();
				$.writeCookie("musicState","1","4800h");
			} else {
				musicPlayer.play();
				$this.addClass("play").removeClass("stop");
				$.writeCookie("musicState","");
			}
		});
	}
}

//IM
function dialogNum(){
	$.ajax({
		type : "post",
		url : "/app/chat/unReadNum.do",
		dataType: "text",
		success : function(data) {
			var $dialogNum = $(".dialogNum");
			var num = Number(data);
			if(num>0){
				$dialogNum.text(num).show();
			}
		}
	});
}

//����΢�Ŷ�ά��
function showWxQrcode(){
	var $showWxQrcode = $("#showWxQrcode");
	var $wxewm = $(".js-wxewm");
	var $thumbnail = $wxewm.find(".wxewm-thumbnail");
	$showWxQrcode.click(function(){
		$thumbnail.attr("src",$thumbnail.data("src"));
		$wxewm.show();
	});
	$(".js-wxewmClose").click(function(){
		$wxewm.hide();
	});
	var $noWxQrcode = $("#noWxQrcode");
	$noWxQrcode.click(function(){
		$.flytip("TA��û�ϴ�΢�Ŷ�ά��Ŷ~");
	});
}
function wxQrcodeTip(){
	var isSelf = $("#isSelf").val();
	if(!$.readCookie("wxQrcodeTipMe") && isSelf == "true" ){
		var $wxQrcodeTipMe = $("#wxQrcodeTipMe");
		$wxQrcodeTipMe.show();
		$wxQrcodeTipMe.click(function(){
			$(this).hide();
			$.writeCookie("wxQrcodeTipMe","1","4800h");
		});
	}
	if(!$.readCookie("wxQrcodeTipTa") && isSelf == "false" ){
		var $wxQrcodeTipTa = $("#wxQrcodeTipTa");
		$wxQrcodeTipTa.show();
		$wxQrcodeTipTa.click(function(){
			$(this).hide();
			$.writeCookie("wxQrcodeTipTa","1","4800h");
		});
	}
}

function nearbyFocus(){
	BeaconAddContactJsBridge.ready(function(){
		//�ж��Ƿ��ע
		BeaconAddContactJsBridge.invoke('checkAddContactStatus',{} ,function(apiResult){
			if(apiResult.err_code == 0){
				var status = apiResult.data;
				if(status == 1){
					window.location=window.location;
				}else{
				  //��ת����עҳ
				  BeaconAddContactJsBridge.invoke('jumpAddContact');
				}
			}else{
				$.flytip(apiResult.err_msg);
			}
		});
 	});
}
$(function (){
	//input val
	var hasCollect = $("#hasCollect"),
		isFocus = $("#isFocus"),
		isFocusVal = isFocus.val(),
		personId = $("#personId").val(),
		openId = $("#openId").val(),
		fromUrl = $("#fromUrl").val(), //out
		isFirst = $("#isFirst").val(),
		showTip = $("#showTip").val(),
		notWeixin = $("#notWeixin").val(),
		fromScan = $("#fromScan").val(),
		isCom = $("#isCom").val(),
		bizCardId = $("#bizCardId").val();
	
	//��ʾ��
	var $sharetip = $(".sharetip"),
		$tipCfriend = $(".js-sharetip-cfriend"), //�����������ʾ
		$tipCollect = $(".js-sharetip-collect"); //�ղ���ʾ

	$(".js-cfriend").click(function(){
		$tipCfriend.show();
	});

	$sharetip.click(function(){
		$sharetip.hide();
	});
	
	//��ɫС�ֹ�עҳ��
	var focusUrl = "http://mp.weixin.qq.com/s?__biz=MzI0NTA1NDY2Mg==&mid=211308575&idx=1&sn=d69e6d10f1d9a3096db2c0ae5a117183#rd";
	
	function focusUsFunc(){
		//var uagent = window.navigator.userAgent.toLowerCase();
		if(fromUrl == "nearby"){
			nearbyFocus();
		}else{
			$.flytip({
				"msg": "����û�й�ע�����ĺ�������Ƭ��<br>������ת����עҳ��",
				"callback": function(){
					window.location.href=focusUrl;
				}
			});
		}
	}
	
	//��һ�ν�����ʾ��
	if(isFirst=="true"){
		$tipCfriend.show()
		.click(function(){
			$.flytip("����ֱ�ӵ����Ŀ�༭����");
		});
	}
	if(showTip=="true"){
		$tipCfriend.show();
	}
	
	//��ע�ж� ��ҲҪ
	var $focusUsLink = $(".focus-us");
	if(isFocusVal=="false" && $focusUsLink.length>0){
		$focusUsLink.attr("href","javascript:").click(function(){
			//���ֻ���
			if(!isMobile()){
				$.vAlert({
					"msg" : "<img width=210 height=210 src='/app_static/app/cardtemplate/images/qx-qrcode.jpg'>",
					"tit" : "΢��ɨ���ע���������΢��Ƭ",
					"width": "320px",
					"okBtnText" : "�� ��"
				});
				return false;
			}else{
				if(!isWeixin()){
					window.location.href="http://res2.eqianxian.com/collect/want-step.html";
				}
			}
			//�ֻ���
			$.get("/app/bizcard/tryCard.do");//�ȷ������󵽺�̨
			focusUsFunc();
		});
	}
	
	//����ղذ�ť
	$(".js-collect").click(function(){
		if(!isMobile()){//���ֻ���
			createSence(personId,"SCANCARD");
			return false;
		}
		if(!isWeixin() && isMobile()){//�ֻ��ϣ�΢����
			window.location.href="http://res2.eqianxian.com/collect/collect.html?url="+window.location.href; 
		}
		
		if(isFocusVal && isFocusVal !== "false"){
			if(hasCollect.val() && hasCollect.val() !== "false"){
				$.flytip("���Ѿ��ղع���");
			}else{
				$.ajax({
					"type": "post",
					"url": "/app/bizcard/collect.do",
					"data": {"openId": openId, "com": isCom},
					"dataType": "json",
					"error": function(){
						$.flytip("������ʲô���Ծ�Ŷ��");
					},
					"success": function(data){
						if(data.success){
							$.flytip({
								"msg": "�ղسɹ�",
								"callback": function(){
									if(data.data=='/app/bizcard/collectList.do'){
										window.location.href= window.location.href;
									}else{
										window.location.href= data.data;
									}
									
								}
							});
							hasCollect.val("true");
						}else{
							$.vAlert(data.desc);
						}
						
					}
				});
			}
		}else{
			$.ajax({
				"type": "post",
				"url": "/app/bizcard/tryCollect.do?openId="+openId,
				"dataType": "json",
				"error":function(){
					$.flytip("������ʲô���Ծ�Ŷ��");
				},
				"success": function(){
					focusUsFunc();
				}
			});
			
		}
	});
	
	//ȡ���ղ�
	$(".js-cancel").click(function(){
		$.ajax({
			"type": "post",
			"url": "/app/bizcard/uncollect.do?openId="+openId,
			"dataType": "json",
			"error": function(){
				$.flytip("������ʲô���Ծ�Ŷ��");
			},
			"success": function(data){
				if(data.success){
					$.flytip({
						"msg": "ȡ���ɹ�",
						"callback": function(){
							window.location.href= window.location;
						}
					});
				}else{
					$.vAlert(data.desc);
				}
				
			}
		});
	});
	
	//��ӡ�ȡ���Ǳ�
	$(".js-star").click(function(){
		var $this = $(this);
		var $itemtx = $this.find(".more-item-tx");
		var openId = $("#openId").val();
		
		if(!$this.hasClass("hasStar")){//���Ǳ�
			$.ajax({
				"type": "post",
				"url": "/app/bizcard/markStar.do",
				"data": {openId:openId},
				"dataType": "json",
				"error": function(){
					$.flytip("������ʲô���Ծ�Ŷ��");
				},
				"success": function(data){
					if(data && data.success){
						$this.addClass("hasStar");
						$itemtx.text("ȡ���Ǳ�");
						$.flytip("���ǳɹ�");
					}else{
						$.flytip(data.desc);
					}
				}
			});
		}else{//ȡ���Ǳ�
			$.ajax({
				"type": "post",
				"url": "/app/bizcard/cancelStar.do",
				"data": {openId:openId},
				"dataType": "json",
				"error": function(){
					$.flytip("������ʲô���Ծ�Ŷ��");
				},
				"success": function(data){
					if(data && data.success){
						$this.removeClass("hasStar");
						$itemtx.text("�����Ǳ�");
						$.flytip("ȡ���ɹ�");
					}else{
						$.flytip(data.desc);
					}
				}
			});
		}
	});
	
	//��ʾ���ز����
	$(".js-featureMore, .item-back, #superMask").click(function(){
		$("html,body").toggleClass("oh");
		togglePage();
		sideNavTip();
	});
	
	//���˶�ά��
	var $ewmThumbnail = $('#ewmThumbnail');
	var ewmThumbnailSrc = $ewmThumbnail.data("src");
	var $ewmform = $(".js-ewmform");
	var ewmformLoaded = true;
	$(".js-ewm").click(function(){
		if(ewmformLoaded){
			if(ewmThumbnailSrc){
				$ewmThumbnail.attr("src",ewmThumbnailSrc);
			}else{
				ajaxGetQr(openId,isCom,function(data){
					$ewmThumbnail.attr("src",data);
				});
			}
		}
		$ewmform.fadeIn();
		ewmformLoaded = false;
	});
	$(".js-ewmClose").click(function(){
		$ewmform.fadeOut();
	});
	
	//like
	$("#jsClickLike").on("click",function() {
		if(notWeixin!="true"){
			ajaxUserAction(openId, 'LIKE', isCom, likeAction);
		}else{
			$.flytip("΢����򿪲��ܵ���");
		}
	});
	
	//ͷ��ת��
	setTimeout(function(){
		$(".avatarPic").addClass("rolling");
	},500);
	
	//����ͼƬ�����Ƿ�ɹ���
	setTimeout(function(){
		$(".vcardBg").each(function(){
			var $this = $(this);
			var errFlag = false;
			if(!this.complete){
				errFlag = true;
			}
			if(typeof this.naturalWidth != "undefined" && this.naturalWidth == 0) {
				errFlag = true;
	        }
			if(errFlag){
				var timeStamp = (new Date).getTime();
				var bg = $this.data("bg");
				if(bg.indexOf("?") > -1){
					bg = bg.split("?")[0];
				}
				var bgPath = bg+"?t="+timeStamp;
				$.vConfirm({
					"msg" : "����ͼƬ��ʾ��������<br>��ȷ�������¼���",
					"tit" : "��ʾ",
					"titLine" : true,
					"width": "300px",
					"okBtnText" : "ȷ ��",
					"closeBtnText" : "ȡ ��",
					"ok" : {
						"callback" : function(){
							//����ҳ�汳����ַ
							$this.attr("src",$this.attr("src")+"?t="+timeStamp);
							//���浽���ݿ�
							$.ajax({
								"type": "post",
								"url": "/app/bizcard/updateCardBg.do",
								"data": {"isCom": isCom, "bizCardId": bizCardId},
								"success": function(data){
									//$.flytip("���³ɹ�");
								}
							});
						},
						"isClose" : true
					}
				});
			}
		});
	},10000);
	
	
	playBgMusic();
	
	//Im
	dialogNum();
	
	//΢�Ŷ�ά��
	showWxQrcode();
	//��ʾ��ʾ��
	if(isMobile()){
		wxQrcodeTip();
	}

});
