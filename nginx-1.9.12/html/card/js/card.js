var parseSearch = function(sc) {
    var ret = {};
    if (sc.length > 0) { sc = sc.substring(1, sc.length); }
    if (sc.length > 0) {
	    var sps = sc.split('&');
	    for (var i=0; i<sps.length; i++) {
		    var kv = sps[i].split('=');
		    ret[kv[0]] = kv[1];
	    }
    }
    return ret;
}

var addImgeEventListender = function(fileId, imgId) {
    var fileInput= document.getElementById(fileId); 
    var fileImg=document.getElementById(imgId);

    if(typeof FileReader==='undefined'){ 
        fileInput.setAttribute('disabled','disabled'); 
    }else{ 
        fileInput.addEventListener('change',function(fileObj, imgObj){ readFile(fileInput, fileImg); },false);
    }
} 

var readFile = function(fileInputObj, fileImgObj) {
    var file = fileInputObj.files[0];
    if(!/image\/\w+/.test(file.type)){
        $('#remind').text("文件必须为图片！").fadeIn().delay(2000).fadeOut();
        return false; 
    }

    var reader = new FileReader(); 
    reader.readAsDataURL(file); 
    reader.onload = function(e){ 
        fileImgObj.src=this.result;
    } 
    console.log(fileImgObj.src);
    reader.onabort=function(){
        $('#remind').text("上传中断").fadeIn().delay(2000).fadeOut(); 
    }
    reader.onerror=function(){
        $('#remind').text("上传出错").fadeIn().delay(2000).fadeOut(); 
    }
}

var getLinkIcon = function(type) {
	switch(Number(type))
	{
		case 1:
			return '../img/link_mainpage.png';
			break;
		case 2:
			return '../img/link_product.png';
			break;
		case 3:
			return '../img/link_taobao.png';
			break;
		case 4:
			return '../img/link_jd.png';
			break;
		case 5:
			return '../img/link_alibaba.png';
			break;
		case 6:
			return '../img/link_tmall.png';
			break;
		case 7:
			return '../img/link_yihaodian.png';
			break;
		case 8:
			return '../img/link_yiwugou.png';
			break;
		case 9:
			return '../img/link_map.png';
			break;
		case 99:
			return '../img/link_default.png';
			break;
		default:
			break;
	}
	return '';
}


var qr = undefined;
var user = undefined;
var curUrl = window.location.href;
var weixinUrl = undefined;
var userInfo = undefined;

$(document).ready(function() {
	qr = new QRCode(document.getElementById("qrcode"), {
		width : 680,
		height : 680
	});
	$(".js-ewmClose").click(function(){$('#qrImageBlock').hide(); $('#myqrImage').hide();});
	$(".js-featureMore, .item-back, #bigmask").click(function(){$("html,body").toggleClass("oh");togglePage();sidenavtip();});
	
	var search = window.location.search;
	var perseRet = parseSearch(search);
	var para = perseRet['_'];
	
	var b = new Base64();
	var pd = b.decode(para);
	var depara = b.decode(para).split('_');
	var uid = parseInt(depara[0]);
	var temp = parseInt(depara[1]);
	var md5Temp = temp.toString().MD5();
	var index = curUrl.indexOf(md5Temp);
	if (index <= 0) return;
	//var urlStr = 'http://www.9ware.cn/api/json/getallinfo?id=' + uid;
	var urlStr = 'http://localhost/api/json/getallinfo?id=' + uid;
	$.ajax({
			type:'get',
			url:urlStr,
			cache:true,
			dataType:'json',
			success:function(data) {
				user = data.data;
	    		console.log(user);
				document.title = user.com_name;
				alert(user.bg_image1_url)
				$('#bgImage1').attr('src', user.bg_image1_url);
				$('#bgImage2').attr('src', user.bg_image2_url);
				$('#myqrImageImage').attr('src', user.wechat_qrcode_url);
				$('#comPubImage').attr('src', user.com_pub_qrImg_url);
				
				$('#link1Image').attr('src', getLinkIcon(user.link1_type));
				$('#link2Image').attr('src', getLinkIcon(user.link2_type));
				$('#link3Image').attr('src', getLinkIcon(user.link3_type));
				$('#link4Image').attr('src', getLinkIcon(user.link4_type));
				
				weixinUrl = "http://weixin.qq.com/r/EDpGXrHEk_zsrfU9928C";
				userInfo = 'BEGIN:VCARD'+'\n'+
							'N:'+user.name+'\n'+
							'TEL:'+user.mobile+'\n'+
							'ADR:'+user.com_addr+'\n'+
							'EMAIL:'+user.email+'\n'+
							'TITLE:'+user.title_pos+'\n'+
							'ORG:'+user.com_name+'\n'+
							'END:VCARD';
							
	    	},
	    	error:function(data) {
	        	console.log(url+" ajax error!");
	        }
	    });
});

var telClicked = function() {
	if (user)
	window.location.href = "tel://"+user.phone;
}

var qqClicked = function() {
	if (user)
	window.location.href = "http://wpa.qq.com/msgrd?v=1&uin="+user.qq_no;
}

var weixinClicked = function() {
	if (user)
	$('#myqrImage').show();
}

var mobileClicked = function() {
	if (user)
	window.location.href = "tel://"+user.mobile;
}

var link1Clicked = function() {
	if (user)
	window.location.href = user.link1_url;
}

var link2Clicked = function() {
	if (user)
	window.location.href = user.link2_url;
}

var link3Clicked = function() {
	if (user)
	window.location.href = user.link3_url;
}

var link4Clicked = function() {
	if (user)
	window.location.href = user.link4_url;
}


var ewmsm = function(aa){
	if(aa==1){
		//qr.makeCode($scope.weixinUrl);
		//qr.clear();
		$("#qrcode").hide();
		$("#comPubImage").show();
		$("#ewm_select1").removeClass("select_no").addClass("select_yes");
		$("#ewm_select2").removeClass("select_yes").addClass("select_no");
		$("#ewm_select3").removeClass("select_yes").addClass("select_no");
	}
	else if(aa==2) {
		qr.makeCode(curUrl);
		$("#qrcode").show();
		$("#comPubImage").hide();
		$("#ewm_select1").removeClass("select_yes").addClass("select_no");
		$("#ewm_select2").removeClass("select_no").addClass("select_yes");
		$("#ewm_select3").removeClass("select_yes").addClass("select_no");
	}
	else if(aa==3) {
		qr.makeCode(userInfo);
		$("#qrcode").show();
		$("#comPubImage").hide();
		$("#ewm_select1").removeClass("select_yes").addClass("select_no");
		$("#ewm_select2").removeClass("select_yes").addClass("select_no");
		$("#ewm_select3").removeClass("select_no").addClass("select_yes");
	}
}

var tmp_erm=1;
var ewm_hide = function(){
	$('#qrImageBlock').show();
	if(tmp_erm==1){
		tmp_erm=0;
		//qr.makeCode($scope.weixinUrl);
		$("#qrcode").hide();
		$("#comPubImage").show();
	}
}


		
		


