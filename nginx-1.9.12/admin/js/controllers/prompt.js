/**
 * Created by john on 15-1-15.
 */
angular.module('demoApp').controller('promptCtrl', ['$scope','$http', '$q', '$stateParams', '$state','notice','time', function($scope,$http,$q,$stateParams,$state,notice,time) {
	console.log('promptCtrl');
	$scope.notice = notice;
    if(time != undefined){
        setTimeout(function(){
            $scope.closeThisDialog();
        }, time)
    }
}]);