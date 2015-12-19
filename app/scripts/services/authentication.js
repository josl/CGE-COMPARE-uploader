'use strict';

/**
 * @ngdoc service
 * @name cgeUploaderApp.authentication
 * @description
 * # authentication
 * Service in the cgeUploaderApp.
 */
angular.module('cgeUploaderApp')
  .service('AuthenticationService', ['$http', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.login = function Login(username, password, callbackSuccess, callbackError) {
        console.log(username, password);
        $http.post('http://compare.cbs.dtu.dk:8890/login/',
            {
                username: username,
                password: password ,
                headers :{
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }
        )
        .success(function (data, status, headers, config) {
            callbackSuccess(data, status, headers, config);
        })
        .error(function(data, status, headers, config){
            callbackError(data, status, headers, config);
        });
    };
}]);
