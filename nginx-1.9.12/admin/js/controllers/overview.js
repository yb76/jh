/**
 * Created by zham on 15-8-7.
 */
angular.module('demoApp').controller('overviewCtrl', ['$q','$window','$scope', '$state','dataService','md5', '$rootScope', '$http','ngDialog',
    function($q,$window,$scope, $state, dataService, md5,$rootScope, $http, ngDialog) {
		
		$scope.userList = [];
		$scope.searchContext = '';
		$scope.isEdit = false;

        $scope.searchEmp = function() {
            if($scope.searchContext == undefined){
                return;
            }
            var param = {'id':$scope.searchContext};
            var url = "/api/json/getuserinfo";
            console.log("param",JSON.stringify(param));
            myGet($q,$http,url, param).then(function(result){
				console.log(JSON.stringify(result));
                if(result.success){
					$scope.userList.length = 0;
					var user = result.data;
					
					var b = new Base64();
					var enStr = {};
					enStr.id = user.id;
					enStr.t = user.template;
					user.encrypId = b.encode(JSON.stringify(enStr));
					
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
						'site':user.com_site,
						'company':user.com_name,
						'company_en':user.com_name_en,
						'template':user.template,
						'company_address':user.com_address,
						'company_address_en':user.com_address_en,
						'description':user.com_desp,
						'description_en':user.com_desp_en
						};
            var url = "/api/json/updateuserinfo";
			console.log("param",JSON.stringify(param));
			
			myGet($q,$http,url, param).then(function(result){
				console.log(JSON.stringify(result));
                if(result.success){
					$scope.isEdit = false;
					
					var user = $scope.userList[0];
					var b = new Base64();
					var enStr = {};
					enStr.id = user.id;
					enStr.t = user.template;
					user.encrypId = b.encode(JSON.stringify(enStr));
                }
            });
		}
    }]);