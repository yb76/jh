/**
 * Created by john on 14-11-29.
 */
var queryString = function(paramObject){
    var result = [];
    angular.forEach(paramObject,function(val,key){
        this.push(encodeURIComponent(key) + '=' + encodeURIComponent(val));
    },result);
    return result.join('&');
}
var resolvedPromise=function($q,value){
    var deferred = $q.defer();
    deferred.resolve(value);
    return deferred.promise;
};
var myPost=function($q,$http,url,paramObj){
    return $http.post(url,paramObj).then(function(result){
        return resolvedPromise($q,result.data);
    },function(error){
        return resolvedPromise($q,{success:false,errCode:''+error.status,errMsg:error.statusText});
    });
};
var myGet=function($q,$http,url,paramObj){
    var urlQryStr = url + (paramObj==undefined||paramObj=={} ? '':('?'+queryString(paramObj)));
    return $http.get(urlQryStr).then(function(result){
        return resolvedPromise($q,result.data);
    },function(error){
        return resolvedPromise($q,{success:false,errCode:''+error.status,errMsg:error.statusText});
    });
}

function getCache($q,dataService,key,success,failed,$http,method,url,param){
    var data = dataService.getData[key];
    if(data){
        console.log('return '+key+' directly');
        return resolvedPromise($q,data);
    }else{
        console.log('return fetch '+key+' http request promise');
        return method.apply($http,[url,param]).then(function(result){
            console.log('fetch '+key+' done, resolving');
            return success(result);
        },failed);
    }
}

function convertUserinfo(dataService){
    return function (result){
        if(!result.data.success){
            return result.data;
        }
        return dataService.getData().userinfo = result.data.data;
    }
}

var httpFail = function(error){
    console.log(error.status);
    return {success:false,errCode:'NETWORK.'+error.status,errMsg:'network problem:'+error.status};
};


angular.module('cardApp', ['angular-md5', 'ui.router'])
	.config(['$httpProvider', function($httpProvider) {
	    // Intercept POST requests, convert to standard form encoding
	    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf8';
	    $httpProvider.defaults.transformRequest.unshift(function(paramObject/*, headersGetter*/) {
	        return queryString(paramObject);
	    });
	    var logsOutUserOn401 = ['$q', '$window', '$injector', 'dataService', function($q, $window, $injector, dataService) {
	        var success = function(response) {
	            return response;
	        };

	        var error = function(response) {
	            console.log('http error!' + response.status);
	            if (response.status === 401 || response.status === 403) {
	                //redirect them back to login page
	                console.log('redirect!');
	                dataService.clearData();
	                $injector.get('$state').transitionTo('index');
	                return $q.reject(response);
	            }
	            else {
	                return $q.reject(response);
	            }
	        };

	        return function(promise) {
	            return promise.then(success, error);
	        };
	    } ];

	    $httpProvider.responseInterceptors.push(logsOutUserOn401);
	} ])
/*
* below configs the view and controller relationship
*/
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        console.log('state....');
        // For any unmatched url, redirect to /index
        $urlRouterProvider.otherwise('/index');

        // Now set up the states
        $stateProvider
            .state('index', {
                url: '/index',
                templateUrl: 'template/index.html',
                controller: 'indexCtrl',
                resolve: {
                    userinfo: function($http, $q, $location, dataService) {
                        var para = $location.search();
                        var url = 'http://www.9ware.cn/api/json/getallinfo?id=' + para.id;
                        return getCache($q, dataService, 'userinfo', convertUserinfo(dataService), httpFail, $http, $http.get, url);
                    }
                }
            })
			.state('nineware', {
                url: '/nineware/:id',
                templateUrl: function(para) {
					var b = new Base64();
					var depara = JSON.parse(b.decode(para.id));
					console.log('template:'+depara.t);
					return 'template/'+depara.t+'.html';
				},
                controller: 'ninewareCtrl',
                resolve: {
                    userinfo: function($http, $q, $location, dataService) {
                        var url = $location.url();
						var paras = url.split('/');
						var para = paras[paras.length-1];
						var b = new Base64();
						var depara = JSON.parse(b.decode(para));
						console.log('resolve:'+depara);
                        var url = 'http://www.9ware.cn/api/json/getallinfo?id=' + depara.id;
                        return getCache($q, dataService, 'userinfo', convertUserinfo(dataService), httpFail, $http, $http.get, url);
                    }
                }
            })
			.state('nineware/product', {
                url: '/nineware/product/:id',
                templateUrl: 'template/product.html',
                controller: 'productCtrl',
				resolve: {
					userinfo: function($http, $q, $location, dataService) {
                        var url = $location.url();
						var paras = url.split('/');
						var para = paras[paras.length-1];
						var b = new Base64();
						var depara = JSON.parse(b.decode(para));
						console.log('resolve:'+depara);
                        var url = 'http://www.9ware.cn/api/json/getallinfo?id=' + depara.id;
                        return getCache($q, dataService, 'userinfo', convertUserinfo(dataService), httpFail, $http, $http.get, url);
                    },
                    products: function($http, $q, $location, dataService) {
						var url = $location.url();
						var paras = url.split('/');
						var para = paras[paras.length-1];
						var b = new Base64();
						var depara = JSON.parse(b.decode(para));
						console.log('resolve:'+depara);
                        var url = 'http://www.9ware.cn/api/json/getproductsinfo?id=' + depara.comId;;
                        return getCache($q, dataService, 'products', convertUserinfo(dataService), httpFail, $http, $http.get, url);
                    }
                }
            });
    } ])
    .service('dataService', function() {
        var service = { data: {} };
        return {
            getData: function() {
                return service.data;
            },
            clearData: function() {
                service.data = {};
            }
        }
    });
