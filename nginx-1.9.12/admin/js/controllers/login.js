angular.module('demoApp').controller('loginCtrl',['$window','$location','$scope','$http','md5','$state','dataService',function($window,$location,$scope,$http,md5,$state,dataService){
    console.log('loginCtrl');

    $scope.param={};
    $scope.msg="";
    $scope.submited=false;
    $scope.login=function() {
        if($scope.submited){
            console.log('wait for response');
            return;
        }

        if(!$scope.param.name||$scope.param.name.trim().length==0){
            $scope.msg='Please fill in EMAIL/MOBILE NO.';
            return;
        }

        if(!$scope.param.password||$scope.param.password.length==0){
            $scope.msg='Please fill in PASSWORD.';
            return;
        }

        var name = {}
        if(/^\d+$/g.test($scope.param.name)){
            name = "+63" + $scope.param.name;
        }else{
            name = $scope.param.name;
        }
        console.log('name', name);
        console.log('md5($scope.param.password)', md5.createHash($scope.param.password));

        $http.post('/payroll/api/admin/login.do',{password:md5.createHash($scope.param.password),name:name}).then(function(result){
            if(result.data!=undefined&&result.data.success==true){
                dataService.getData().user=result.data.data;
                console.log('login success,user role='+dataService.getData().user.role);
                $state.transitionTo('index.searchEmployee');
            }else{
                console.log('login failed:'+result.data.errMsg);
                $scope.msg = result.data.errMsg;
                $scope.submited=false;
            }
        });
        $scope.msg="";
        $scope.submited=true;
    };

    $scope.buttonColor={'background-color':'#15a4fa'};
    $scope.mouseDown=function(event){
        if(event.button==0&&event.buttons==1){
            $scope.buttonColor['background-color']='#1183c8';
        }
    }
    $scope.mouseUp=function(event){
        if(event.button==0&&event.buttons==0){
            $scope.buttonColor['background-color']='#15a4fa';
        }
    }

    function initPosition(){
        var signin = $("#signinpage");
        if(signin.length>0){
            var innerHeight = $(window).innerHeight();
            var signHeight = signin.height();
            if(innerHeight>signHeight){
                signin.css('margin-top',(innerHeight-signHeight)/2);
            }else{
                signin.css('margin-top',0);
            }
        }
    }

    initPosition();

    $scope.$watch('param', function(){
        if($scope.msg&&$scope.msg.trim().length>0)$scope.msg="";
    },true);
    
    $scope.toResetpwd = function(){
	    $state.transitionTo('login.resetpwd');
    }
}]);