/**
 * Created by zham on 15-8-10.
 */
angular.module('demoApp').controller('depositCtrl', ['$q','$window','$scope', '$state','dataService','md5', '$rootScope', '$http', 'ngDialog',
    function($q,$window,$scope, $state, dataService, md5,$rootScope, $http, ngDialog) {
        console.log('payrollDepositCtrl');
        $scope.list = [];
        $scope.pageNo = 0;
        $scope.rowCount = 20;

        $scope.getList = function() {
            console.log('getList!');
            var offset = $scope.pageNo * $scope.rowCount;
            var count = $scope.rowCount;
            myGet($q, $http, '/payroll/api/admin/get/deposit.do', {
                offset: offset,
                count: count
            }).then(function(result) {
                if (result.success === true) {
                    console.log(result.data);
                    $scope.list = result.data;
                } else {
                    console.log(result);
                }
            });
        };

        $scope.getList();

        $scope.nextPage = function() {
            if ($scope.rowCount > $scope.list.length)
                return;
            $scope.pageNo++;
            $scope.getList();
        }

        $scope.prevPage = function() {
            if (0 === $scope.pageNo)
                return;
            $scope.pageNo--;
            $scope.getList();
        }

        $scope.firstPage = function() {
            if (0 === $scope.pageNo)
                return;
            $scope.pageNo = 0;
            $scope.getList();
        }

        $scope.isEmptyInput = function(val) {
            var fieldVal = $scope[val];
            if (undefined === fieldVal || null === fieldVal || '' === fieldVal) {
                $('[ng-model='+val+']').focus();
                return true;
            }
            return false;
        }

        $scope.deposit = function() {
            console.log('deposit');

            if ($scope.isEmptyInput('code')) {
                console.log('code empty');
                return;
            }

            if ($scope.isEmptyInput('silvrrId')) {
                console.log('silvrrId empty');
                return;
            }

            if ($scope.isEmptyInput('amount')) {
                console.log('amount empty');
                return;
            }
            console.log('code='+$scope.code+", uid="+$scope.silvrrId+", amount="+$scope.amount);
            myPost($q,$http, '/payroll//api/admin/deposit/code.do',{
                code:$scope.code,
                uid:$scope.silvrrId,
                amount:$scope.amount
            }).then(function(result) {
                if (result.success === true) {
                    console.log(result.data);
                    $scope.getList();
                } else {
                    alertWithNgDialog(result.errMsg, ngDialog);
                }
            });
        }

    }])