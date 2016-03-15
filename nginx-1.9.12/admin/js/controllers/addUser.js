/**
 * Created by zham on 15-8-7.
 */
angular.module('demoApp').controller('addUserCtrl', ['$q','$window','$scope', '$state','dataService','md5', '$rootScope', '$http','companys',
    function($q,$window,$scope, $state, dataService, md5,$rootScope, $http, companys) {
		console.log(companys);
		$scope.companys = companys;
		$scope.selectedCom = {};
		
		$scope.user = {};
		
		$scope.user.id = '';
		$scope.user.encrypId = '';
		
		$scope.user.name = '';
		$scope.user.name_en = '';
		$scope.user.title_pos = '';
		$scope.user.title_pos_en = '';
		$scope.user.email = '';
		$scope.user.mobile = '';
		$scope.user.phone = '';
		$scope.user.fax = '';
		$scope.user.qq_no = '';
		$scope.user.wechat_no = '';
		$scope.user.com_site = '';
		$scope.user.com_name = '';
		$scope.user.com_name_en = '';
		$scope.user.template = '';
		$scope.user.com_address = '';
		$scope.user.com_address_en = '';
		$scope.user.com_desp = '';
		$scope.user.com_desp_en= '';
						
		$scope.isEdit = true;
		
		$scope.newUser = function() {
			$scope.isEdit = true;
			$scope.cancelAdd();
		}
		
		$scope.comSelectChange = function() {
			console.log($scope.selectedCom);
		}
		
		$scope.cancelAdd = function() {
			$scope.user.id = '';
			$scope.user.encrypId = '';
			
			$scope.user.name = '';
			$scope.user.name_en = '';
			$scope.user.title_pos = '';
			$scope.user.title_pos_en = '';
			$scope.user.email = '';
			$scope.user.mobile = '';
			$scope.user.phone = '';
			$scope.user.fax = '';
			$scope.user.qq_no = '';
			$scope.user.wechat_no = '';
			$scope.user.template = '';
		}
		
		$scope.uploadHeadImage = function() {
			$.ajax({
				type:'post',
				url:"/api/json/uploadHeadImage",
				data:'',
				cache:false,
				dataType:'json',
				success:function(data) {
					console.log("post success");
	        	},
	        	error:function() {
		        	alert("error");
		        }
		    });
		}
		
		$scope.uploadWeixinQrImage = function() {
			$.ajax({
				type:'post',
				url:"/api/json/uploadWeixinQrImage",
				data:'',
				cache:false,
				dataType:'json',
				success:function(data) {
					console.log("post success");
	        	},
	        	error:function() {
		        	alert("error");
		        }
		    });
		}
		
		$scope.addUser = function() {
			var com_id = $scope.selectedCom.com_id;
			if (!com_id) {
				alert('please select a company!');
				return;
			}
			var user = $scope.user;
			var param = {'name':user.name,
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
						'com_id':$scope.selectedCom.com_id
						};
            var url = "/api/json/adduser";
			var paraStr = JSON.stringify(param);
			console.log("param", JSON.stringify(param));
			
			myGet($q,$http,url, param).then(function(result){
				console.log(JSON.stringify(result));
                if(result.success){
					$scope.isEdit = false;
					
					var user = result.data;
					var b = new Base64();
					var enStr = {};
					enStr.id = user.id;
					enStr.t = user.template;
					$scope.user.encrypId = b.encode(JSON.stringify(enStr));
					$scope.user.id = user.id;
					
					alert('add new user success!');
                }
				else {
					alert('add new user failed!');
				}
            });
		}
    }]);