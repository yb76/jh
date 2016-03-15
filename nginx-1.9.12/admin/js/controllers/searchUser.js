/**
 * Created by zham on 15-8-7.
 */
angular.module('demoApp').controller('searchUserCtrl', ['$q','$window','$scope', '$state','dataService','md5', '$rootScope', '$http','ngDialog',
    function($q,$window,$scope, $state, dataService, md5,$rootScope, $http, ngDialog) {
		
		$scope.userList = [];
		$scope.searchContext = '';
		$scope.isEdit = false;
		$scope.isComEdit = false;

        $scope.searchEmp = function() {
            if($scope.searchContext == undefined){
                return;
            }
            var param = {'id':$scope.searchContext};
            var url = "/api/json/getallinfo";
            console.log("param",JSON.stringify(param));
            myGet($q,$http,url, param).then(function(result){
				console.log(JSON.stringify(result));
                if(result.success){
					$scope.userList.length = 0;
					var user = result.data;					
					user.encrypId = user.encode_url;
                    $scope.userList.push(result.data);
                }
            });
        }
		
		$scope.editUser = function() {
			$scope.isEdit = true;
		}
		
		$scope.cancelModify = function() {
			$scope.isEdit = false;
		}

		$scope.modifyUser = function() {
			var user = $scope.userList[0];
			if (user == undefined) {
				return;
			}
			var param = {'id':$scope.searchContext,
						'name':user.name,
						'name_en':user.name_en,
						'title_pos':user.title_pos,
						'title_pos_en':user.title_pos_en,
						'email':user.email,
						'mobile':user.mobile,
						'phone':user.phone,
						'fax':user.fax,
						'qq':user.qq_no,
						'wechat':user.wechat_no,
						'template':user.template,
						'link1_type':user.link1_type,
						'link1_url':user.link1_url,
						'link2_type':user.link2_type,
						'link2_url':user.link2_url,
						'link3_type':user.link3_type,
						'link3_url':user.link3_url,
						'link4_type':user.link4_type,
						'link4_url':user.link4_url,
						};
            var url = "/api/json/updateuserinfo";
			console.log("param",JSON.stringify(param));
			
			myGet($q,$http,url, param).then(function(result){
				console.log(JSON.stringify(result));
                if(result.success){
					$scope.isEdit = false;
					user.encrypId = result.data.encode_url;
                }
            });
		}
		
		$scope.modifyWeixinQrCodeImage = function() {
			var user = $scope.userList[0];
			if (user == undefined) return;
			
			var file = $('#weixinImage')[0].files[0];
			if (file == undefined) return;
			
			var d = new FormData();
			d.append('field', user.id);
			d.append('file', file);
			$.ajax({
				type:'post',
				url:"/api/json/uploadWeixinQrImage",
				data:d,
				cache:false,
				dataType:'json',
				contentType:false,
				processData:false,
				success:function(data) {
					console.log("post success, result="+data.data.wechat_qrcode_url);
					user.wechat_qrcode_url = data.data.wechat_qrcode_url;
					$scope.isEdit = false;
					alert("upload success");
	        	},
	        	error:function() {
		        	alert("error");
		        }
		    });
		}
		
		$scope.modifyBgImage1 = function() {
			var user = $scope.userList[0];
			if (user == undefined) return;
			
			var file = $('#mainBgImage1')[0].files[0];
			if (file == undefined) return;
			
			var d = new FormData();
			var para = {};
			para.uid = user.id;
			para.bg_url_key = 'bg_image1_url';
			d.append('field', JSON.stringify(para));
			d.append('file', file);
			$.ajax({
				type:'post',
				url:"/api/json/uploadMainbgImage",
				data:d,
				cache:false,
				dataType:'json',
				contentType:false,
				processData:false,
				success:function(data) {
					console.log("post success, result="+data.data.bg_image1_url);
					user.bg_image1_url = data.data.bg_image1_url;
					$scope.isEdit = false;
					alert("upload success");
	        	},
	        	error:function() {
		        	alert("error");
		        }
		    });
		}
		
		$scope.modifyBgImage2 = function() {
			var user = $scope.userList[0];
			if (user == undefined) return;
			
			var file = $('#mainBgImage2')[0].files[0];
			if (file == undefined) return;
			
			var d = new FormData();
			var para = {};
			para.uid = user.id;
			para.bg_url_key = 'bg_image2_url';
			d.append('field', JSON.stringify(para));
			d.append('file', file);
			$.ajax({
				type:'post',
				url:"/api/json/uploadMainbgImage",
				data:d,
				cache:false,
				dataType:'json',
				contentType:false,
				processData:false,
				success:function(data) {
					console.log("post success, result="+data.data.bg_image2_url);
					user.bg_image2_url = data.data.bg_image2_url;
					$scope.isEdit = false;
					alert("upload success");
	        	},
	        	error:function() {
		        	alert("error");
		        }
		    });
		}
		
    }]);