/**
 * Created by zham on 15-8-7.
 */
function queryString(paramObject){
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

var myPostFormData = function($q, $http, url, formData) {
    var headers = {
        'Content-Type': 'application/json'
    };
    return $http.post(url, formData, {
        transformRequest: angular.identity,
        headers: headers
    }).then(function(result) {
            return resolvedPromise($q, result.data);
        }, function(error) {
            return resolvedPromise($q, {
                success: false,
                errCode: '' + error.status,
                errMsg: error.statusText
            });
        });
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

function getData(key,success,failed,$http,method,url,param){
    console.log('return fetch '+key+' http request promise');
    return method.apply($http,[url,param]).then(function(result){
        console.log('fetch '+key+' done, resolving');
        return success(result);
    },failed);
}

var httpFail = function(error){
    console.log(error.status);
    return {success:false,errCode:'NETWORK.'+error.status,errMsg:'network problem:'+error.status};
};
//ngSanitize ui.select for select2
angular.module('demoApp', [ 'angular-md5','ui.router','ui.bootstrap','ui.select','ngSanitize','angular-loading-bar','ngDialog','ngCsv'])
    .config(['$httpProvider', function ($httpProvider) {
        // Intercept POST requests, convert to standard form encoding
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        $httpProvider.defaults.transformRequest.unshift(function (paramObject/*, headersGetter*/) {
            return queryString(paramObject);
        });

        var logsOutUserOn401 = ['$q', '$window','$location', '$injector','dataService', function ($q, $window,$location, $injector, dataService) {
            var success = function (response) {
                return response;
            };
            var error = function (response) {
                console.log('http error!'+response.status);
                if (response.status === 401 || response.status === 403) {
                    //redirect them back to login page
                    console.log('redirect!');
                    dataService.clearData();
//                    $injector.get('$state').transitionTo('login');
                    var urlBase = $location.protocol() + "://" + $location.host() + ":"+$location.port();
                    var repLoginUrl = urlBase + "/adminConsole/admin.html#/login";
                    $window.location = repLoginUrl;
                    return $q.reject(response);
                }
                else {
                    return $q.reject(response);
                }
            };

            return function (promise) {
                return promise.then(success, error);
            };
        }];

        $httpProvider.responseInterceptors.push(logsOutUserOn401);
    }])
    /*
     * below configs the view and controller relationship
     */
    .config(['$stateProvider','$urlRouterProvider',function ($stateProvider, $urlRouterProvider) {
        // For any unmatched url, redirect to /index
        $urlRouterProvider.otherwise('/index');

        // Now set up the states
        $stateProvider
            .state('login', {
                url:'/login',
                templateUrl:'template/login.html',
                controller:'loginCtrl'
            })
            .state('index', {
                url: '/index',
                templateUrl: 'template/index.html',
                controller:'indexCtrl'
            })
            .state('index.searchUser',{
                url: '/searchUser',
                templateUrl: 'template/searchUser.html',
                controller:'searchUserCtrl'
            })
			.state('index.searchCom',{
                url: '/searchCompany',
                templateUrl: 'template/searchCom.html',
                controller:'searchComCtrl'
            })
			.state('index.addUser',{
                url: '/addUser',
                templateUrl: 'template/addUser.html',
                controller:'addUserCtrl',
				resolve: {
					companys: function($http, $q, $location, dataService) {
                        var url = '/api/json/gettotalcompany';
                        return getCache($q, dataService, 'userinfo', convertUserinfo(dataService), httpFail, $http, $http.get, url);
                    }
                }
            })
			.state('index.addCom',{
                url: '/addCompany',
                templateUrl: 'template/addCom.html',
                controller:'addComCtrl'
            })
			.state('index.overview',{
                url: '/overview',
                templateUrl: 'template/overview.html',
                controller:'overviewCtrl'
            })
            .state('index.company', {
                url:'/company',
                templateUrl:'template/company.html',
                controller:'companyCtrl'
            })

    }])
    .service('dataService', function(){
        var service={data:{}};
        return {
            getData:function(){
                return service.data;
            },
            clearData:function(){
                service.data={};
            }
        }
    })
    .directive('loadImage', [function(){
        return {
            restrict : 'A',
            link:function(scope, element, attrs){
                console.log("image:",attrs.loadImage)
                console.log("element",element)
                console.log("attrs", attrs)
                $(element).attr('src', attrs.loadImage);
            }

        }
    }])
    .controller("rejectReasonCtrl", ['$scope', function($scope){

        $scope.len = 0;
        $scope.notice = "";

        var msg = ['Please check your receive information.',
            'Please contact your accounting department for more details.',
            'An unexpected technical issue happened. Please try again.',
            '']

        $scope.msgTitleChanged = function(){
            $scope.message = msg[$scope.msgTitle];
            $scope.len = $scope.message.length
        }
        $scope.getLen = function(){
            $scope.len = $scope.message.length
        }
        $scope.done = function(){
            console.log($scope.len);
            if($scope.len == 0){$scope.notice="please fill this"; return;}
            $scope.confirm($scope.message);
        }
        $scope.cancel = function(){
            $scope.closeThisDialog('cancel');
        }
    }])
    .filter('propsFilter', function() {
        return function(items, props) {
            var out = [];

            if (angular.isArray(items)) {
                items.forEach(function(item) {
                    var itemMatches = false;

                    var keys = Object.keys(props);
                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        var text = props[prop].toLowerCase();
                        if (item[prop] && item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }

                    if (itemMatches) {
                        out.push(item);
                    }
                });
            } else {
                // Let the output be the input untouched
                out = items;
            }

            return out;
        }
    })
    .directive('pptImageButtonChange', [function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var n = attrs.pptImageButtonChange;
                $(element).click(function() {
                    var fileInput = $('<input>', {
                        type: 'file'
                    });
                    fileInput.change(function() {
                        if (0 === fileInput[0].files.length) {
                            return;
                        }
                        scope.$apply(function() {
                            scope[n].file = fileInput[0].files[0];
                            var fr = new FileReader();
                            fr.onload = function(event) {
                                scope.$apply(function() {
                                    scope[n].url = event.target.result;
                                });
                            }
                            fr.readAsDataURL(scope[n].file);
                        });
                    });
                    fileInput.click();
                });
            }
        };
    }])
    .directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function(){
                    scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);