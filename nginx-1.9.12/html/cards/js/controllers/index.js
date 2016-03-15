/**
 * Created by john on 15-1-15.
 */
angular.module('cardApp').controller('indexCtrl', ['$scope', '$state', '$location', 'dataService', '$rootScope', '$http', 'userinfo',
	function($scope, $state, $location, dataService, $rootScope, $http, userinfo) {
	    console.log('indexCtrl');
	    console.log(userinfo);
	    var temp = userinfo.template;
	    //var tempUrl = 'template.' + temp;
	    //$state.go(tempUrl);
	    var tempUrl = '/template/' + temp + '?id=' + userinfo.id;
	    $location.url(tempUrl);
	} ]);