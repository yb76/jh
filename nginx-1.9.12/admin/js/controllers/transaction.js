/**
 * Created by zham on 15-8-10.
 */
angular.module('demoApp').controller('transactionCtrl', ['$q','$window','$scope', '$state','dataService','md5', '$rootScope', '$http','ngDialog',
    function($q,$window,$scope, $state, dataService, md5,$rootScope, $http, ngDialog) {
        $scope.transactions  = [];
        $scope.companies = [];
        $scope.refNo = undefined;
        $scope.taskId = undefined;
        $scope.phoneNumber = undefined;
        $scope.partnerId = undefined;
        $scope.companyCode = undefined;
        var countPerPage = 10;
        var currentPage  = 1;

        var transactionUrl = "/payroll/api/admin/get/transaction.do";
        var getCompanyUrl = '/payroll/api/admin/get/company/code.do';

        var getCompanyCode = function(){
            myGet($q, $http, getCompanyUrl).then(function(result){
                if(result.success == true){
                    $scope.companies = result.data;
                    console.log("companies:", JSON.stringify($scope.companies));
                }else{
                    console.log(JSON.stringify(result));
                }
            });
        }

        var getTransaction = function(param){
            myGet($q, $http, transactionUrl, param).then(function(result){
               if (result.success == true){
                   console.log(JSON.stringify(result));
                   $scope.transactions = result.data;
                   for(var i = 0; i < $scope.transactions.length; i++){
                       $scope.transactions[i].showCreateTime = $scope.transactions[i].createTime;
                       $scope.transactions[i].transactionType = $scope.orgTypeDesc($scope.transactions[i].orgType);
                       $scope.transactions[i].partnerName = $scope.partnerDesc($scope.transactions[i].partnerId);
                       $scope.transactions[i].senderName = $scope.transactions[i].firstName +" " + $scope.transactions[i].middleName+ " " +$scope.transactions[i].lastName;
                       $scope.transactions[i].benefName = $scope.transactions[i].benefFirstName + " " + $scope.transactions[i].benefMiddleName + " " + $scope.transactions[i].benefLastName;
                       $scope.transactions[i].showStatus = $scope.statusDesc($scope.transactions[i].status);
                       $scope.transactions[i].benefPhone = $scope.transactions[i].benefPhoneCountryCode + $scope.transactions[i].benefPhoneNumber;

                   }
               }else{
                   console.log(JSON.stringify(result));
               }
            });
        }

        var searchTransaction = function(offset){
            var param = {};
            param.offset = offset;
            param.count = countPerPage;
            if($scope.refNo){
                param.refNo = $scope.refNo;
            }
            if($scope.phoneNumber){
                param.phoneCountryCode = "+63";
                param.phoneNumber = $scope.phoneNumber;
            }
            if($scope.taskId){
                param.taskId = $scope.taskId;
            }
            if($scope.partnerId){
                param.partnerId = $scope.partnerId;
            }
            if($scope.companyCode){
                param.code = $scope.companyCode;
            }
            console.log("param", JSON.stringify(param));
            getTransaction(param);
        }

        $scope.nextPage = function(){
            if(countPerPage > $scope.transactions.length){
                return;
            }
            var offset = (currentPage - 1) * countPerPage;
            currentPage += 1;
            searchTransaction(offset);
        }

        $scope.prevPage = function(){
            if(currentPage == 1)return;
            var offset = (currentPage - 1) * countPerPage;
            currentPage -= 1;
            searchTransaction(offset);
        }
        $scope.pageNo = function(){
            return currentPage;
        }
        $scope.firstPage = function(){
            currentPage = 1;
            searchTransaction(0);
        }
        $scope.statusDesc = function(status){
            switch (status) {
                case 1:
                    return 'processing';
                case 4:
                    return 'credited';
                case 5:
                    return 'failed';
                case 7:
                    return 'rejected';
                case 8:
                    return 'canceled';
                case 10:
                    return 'available for pickup';
                case 12:
                    return 'updating';
                case 13:
                    return 'canceling';
            }
            return status;
        }

        $scope.partnerDesc = function(partnerId){
            switch (partnerId) {
                case 1:
                    return 'Cashpinas';
                case 2:
                    return 'Security Bank';
                case 3:
                    return 'Transfast';
            }
            return partnerId;
        }
        $scope.orgTypeDesc = function(orgType){
            switch(orgType){
                case 0:
                    return 'bank';
                case 1:
                    return 'third';
                case 2:
                    return 'pick up';
                return orgType;
            }
        }
        $scope.search = function(){
            currentPage = 1;
            searchTransaction(0);
        }

        $scope.downloadCsv = function(){

        }

        $scope.getHeader = function(){
            return ['User ID', "Sender Name", "Task ID", "Transaction Amount(PHP)", "Service Fee","Reference No.",
             "Outlet Name",'Bank Account',"Transaction Type", "Status", "Partner Name", "Create Time", "Beneficiary Name",
            "Beneficiary Phone",];
        }
        $scope.getOrder = function(){
            return ['uid', "senderName", "taskId", "toAmount", 'fee','refNo', 'orgName', "bankAcct", 'transactionType', 'showStatus',
            'partnerName', 'showCreateTime','benefName', 'benefPhone'];
        }
        getCompanyCode();
        searchTransaction(0);
    }])