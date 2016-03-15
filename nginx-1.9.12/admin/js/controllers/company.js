angular.module('demoApp')
	.controller('companyCtrl', ['$scope', '$http', '$q', '$window', '$modal', function($scope, $http, $q, $window, $modal) {
		console.log('companyCtrl');
		$scope.list = [];
		$scope.pageNo = 0;
		$scope.rowCount = 20;


		$scope.getNext = function() {
			if ($scope.rowCount > $scope.list.length)
				return;
			$scope.pageNo++;
			$scope.getList();
		}

		$scope.getPrev = function() {
			if (0 === $scope.pageNo)
				return;
			$scope.pageNo--;
			$scope.getList();
		}

		$scope.getFirst = function() {
			if (0 === $scope.pageNo)
				return;
			$scope.pageNo = 0;
			$scope.getList();
		}

		$scope.getCompany = function() {
			var offset = $scope.pageNo * $scope.rowCount;
			var count = $scope.rowCount;
			myGet($q, $http, '/payroll/api/admin/listCompany.do',{
				offset: offset,
				count: count
			}).then(function(result) {
				if (result.success === true) {
					console.log(result);
					$scope.list = result.data;
				} else {
					alert(result.errMsg);
				}
			});
		}

		$scope.getCompany();

		$scope.registerCompany = function(param) {
			console.log('register param', param);
			myPost($q, $http, '/payroll/api/admin/registerCompany.do', param).then(function(result) {
				if (result.success === true) {
					console.log(result);
					$scope.refresh();
				} else {
					alert(result.errMsg);
				}
			});
		}

		$scope.refresh = function() {
			console.log('refresh');
			var offset = 0;
			var count = 20;
			myGet($q, $http, '/payroll/api/admin/listCompany.do',{
				offset: offset,
				count: count
			}).then(function(result) {
				if (result.success === true) {
					console.log(result);
					$scope.list = result.data;
				} else {
					alert(result.errMsg);
				}
			});
		}

		$scope.search = function() {
			console.log('search');
			myGet($q, $http, '/payroll/api/admin/search/company.do',{
				code: $scope.code,
				name: $scope.name
			}).then(function(result) {
				if (result.success === true) {
					console.log(result);
					$scope.list = result.data;
				} else {
					alert(result.errMsg);
				}
			});
		}

		$scope.openRegisterWin = function() {
			var modalInstance = $modal.open({
				templateUrl: 'template/registerCompany.html',
				controller: 'registerCompanyCtrl'
			});

			modalInstance.result.then(function(result) {
				$scope.registerCompany(result);
			}, function(reason) {
				console.log('Modal dismissed at: ' + new Date() + ' reason:' + reason);
			});
		}
	}])
	.controller('registerCompanyCtrl', ['$scope', '$modalInstance', function($scope, $modalInstance) {

		$scope.companyPhoneCountryCode = '+63';
		$scope.repPhoneCountryCode = '+63';
		$scope.creditLine = 0;

		$scope.isEmptyInput = function(val) {
			var fieldVal = $scope[val];
			if (undefined === fieldVal || null === fieldVal || '' === fieldVal) {
				$('[ng-model='+val+']').focus();
				return true;
			}
			return false;
		}
		$scope.ok = function() {
			console.log('register company ok()');

			if ($scope.isEmptyInput('companyName')) {
				return;
			}

			if ($scope.isEmptyInput('companyPhoneCountryCode')) {
				return;
			}

			if ($scope.isEmptyInput('companyPhoneNumber')) {
				return;
			}

			if ($scope.isEmptyInput('companyEmail')) {
				return;
			}

			if ($scope.isEmptyInput('repFirstName')) {
				return;
			}

			if ($scope.isEmptyInput('repLastName')) {
				return;
			}

			if ($scope.isEmptyInput('repPhoneCountryCode')) {
				return;
			}

			if ($scope.isEmptyInput('repMobile')) {
				return;
			}

			if ($scope.isEmptyInput('repEmail')) {
				return;
			}

			var param = {};
			param.companyName = $scope.companyName;
			param.companyPhoneCountryCode = $scope.companyPhoneCountryCode;
			param.companyPhoneNumber = $scope.companyPhoneNumber;
			param.companyEmail = $scope.companyEmail;
			param.repFirstName = $scope.repFirstName;
			if($scope.repMiddleName!=undefined) param.repMiddleName = $scope.repMiddleName;
			param.repLastName = $scope.repLastName;
			param.repPhoneCountryCode = $scope.repPhoneCountryCode;
			param.repMobile = $scope.repMobile;
			param.repEmail = $scope.repEmail;
			param.creditLine = $scope.creditLine;
			$modalInstance.close(param);
		};
		$scope.cancel = function() {
			console.log('register company cancel()');
			$modalInstance.dismiss('cancel');
		};
	}]);