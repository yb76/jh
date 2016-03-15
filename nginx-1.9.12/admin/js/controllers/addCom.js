/**
 * Created by zham on 15-8-7.
 */
angular.module('demoApp').controller('addComCtrl', ['$q','$window','$scope', '$state','dataService','md5', '$rootScope', '$http','ngDialog',
    function($q,$window,$scope, $state, dataService, md5,$rootScope, $http, ngDialog) {
		$scope.user = {};
		
		$scope.user.com_id = '';
		
		$scope.user.com_site = '';
		$scope.user.com_name = '';
		$scope.user.com_name_en = '';
		$scope.user.com_address = '';
		$scope.user.com_address_en = '';
		$scope.user.com_desp = '';
		$scope.user.com_desp_en= '';
						
		$scope.isEdit = true;
		
		$scope.newCom = function() {
			$scope.isEdit = true;
			$scope.cancelAdd();
		}
		
		$scope.cancelAdd = function() {
			$scope.user.com_id = '';
			
			$scope.user.com_site = '';
			$scope.user.com_name = '';
			$scope.user.com_name_en = '';
			$scope.user.com_address = '';
			$scope.user.com_address_en = '';
			$scope.user.com_desp = '';
			$scope.user.com_desp_en= '';
		}
		
		$scope.addCom = function() {
			var user = $scope.user;
			var param = {'company_site':user.com_site,
						'company':user.com_name,
						'company_en':user.com_name_en,
						'company_address':user.com_address,
						'company_address_en':user.com_address_en,
						'description':user.com_desp,
						'description_en':user.com_desp_en
						};
            var url = "/api/json/addcom";
			var paraStr = JSON.stringify(param);
			console.log("param", JSON.stringify(param));
			
			myGet($q,$http,url, param).then(function(result){
				console.log(JSON.stringify(result));
                if(result.success){
					$scope.isEdit = false;
					$scope.user.com_id = result.data.id;
					alert('add new company success!');
                }
				else {
					alert('add new company failed!');
				}
            });
		}
    }]);