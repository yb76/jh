/**
 * Created by zham on 15-8-7.
 */
angular.module('demoApp').controller('indexCtrl', ['$window','$scope', '$state','dataService', '$rootScope', '$http',
    function($window,$scope, $state, dataService, $rootScope, $http) {

        $scope.logout = function(){
            $http.get('/payroll/api/user/logout.do').then(function(result) {
                console.log(JSON.stringify(result));
                $state.transitionTo('login');
            });
        }

    }])