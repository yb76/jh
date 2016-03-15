/**
 * Created by john on 15-1-15.
 */
angular.module('cardApp').controller('productCtrl', ['$scope', '$state', '$location', 'dataService', '$rootScope', '$http', 'userinfo', 'products',
	function($scope, $state, $location, dataService, $rootScope, $http, userinfo, products) {
	    console.log('productCtrl');
		console.log(userinfo);
		console.log(products);
		$scope.products = products;
		
		$scope.id = userinfo.id;
		$scope.email = userinfo.email;
	    $scope.phone = userinfo.phone;
	    $scope.mobile = userinfo.mobile;
	    $scope.name = userinfo.name;
		$scope.name_en = userinfo.name_en;
	    $scope.title_pos = userinfo.title_pos;
		$scope.title_pos_en = userinfo.title_pos_en;
	    $scope.fax = userinfo.fax;
	    $scope.qq_no = userinfo.qq_no;
	    $scope.wechat_no = userinfo.wechat_no;
		$scope.wechat_qrcode_url = userinfo.wechat_qrcode_url;
		$scope.com_id = userinfo.com_id;
	    $scope.com_site = userinfo.com_site;
		$scope.com_name = userinfo.com_name;
		$scope.com_name_en = userinfo.com_name_en;
		$scope.com_addr = userinfo.com_address;
		$scope.com_addr_en = userinfo.com_address_en;
		$scope.com_pub_qrImg_url = userinfo.com_pub_qrImg_url;
		$scope.desc = userinfo.com_desp;
		$scope.desc_en = userinfo.com_desp_en;

		$scope.curUrl = $location.$$absUrl;
		$scope.weixinUrl = "http://weixin.qq.com/r/EDpGXrHEk_zsrfU9928C";
		$scope.userInfo = 'BEGIN:VCARD'+'\n'+
							'N:'+$scope.name+'\n'+
							'TEL:'+$scope.mobile+'\n'+
							'ADR:'+$scope.com_addr+'\n'+
							'EMAIL:'+$scope.email+'\n'+
							'TITLE:'+$scope.title_pos+'\n'+
							'ORG:'+$scope.com_name+'\n'+
							'END:VCARD';
		
		$scope.selHint = "手机打开扫描二维码分享给好友,可印在纸质名片和宣传单上";
		
		document.title = $scope.com_name;
		
		var qr = new QRCode(document.getElementById("qrcode"), {
			width : 480,
			height : 480
		});
		
		//var qr1 = new QRCode(document.getElementById("wechatqrcode"), {
			//width : 480,
			//height : 480
		//});

		$scope.ewmsm = function(aa){
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
				qr.makeCode($scope.curUrl);
				$("#qrcode").show();
				$("#comPubImage").hide();
				$("#ewm_select1").removeClass("select_yes").addClass("select_no");
				$("#ewm_select2").removeClass("select_no").addClass("select_yes");
				$("#ewm_select3").removeClass("select_yes").addClass("select_no");
			}
			else if(aa==3) {
				qr.makeCode($scope.userInfo);
				$("#qrcode").show();
				$("#comPubImage").hide();
				$("#ewm_select1").removeClass("select_yes").addClass("select_no");
				$("#ewm_select2").removeClass("select_yes").addClass("select_no");
				$("#ewm_select3").removeClass("select_no").addClass("select_yes");
			}
		}
	
		var tmp_erm=1;
		$scope.ewm_hide = function(){
			$('#qrImageBlock').show();
			if(tmp_erm==1){
				tmp_erm=0;
				//qr.makeCode($scope.weixinUrl);
				$("#qrcode").hide();
				$("#comPubImage").show();
			}
		}
		$scope.show_wechat = function(){
			$('#myqrImage').show();
			//if(tmp_erm==1){
				//tmp_erm=0;
				//qr1.makeCode($scope.wechat_no);
			//}
		}
		$(".js-ewmClose").click(function(){$('#qrImageBlock').hide(); $('#myqrImage').hide();});
		$(".js-featureMore, .item-back, #bigmask").click(function(){$("html,body").toggleClass("oh");togglePage();sidenavtip();});
		
	} ]);