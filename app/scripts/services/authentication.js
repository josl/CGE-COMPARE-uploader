'use strict';

/**
 * @ngdoc service
 * @name cgeUploaderApp.authentication
 * @description
 * # authentication
 * Service in the cgeUploaderApp.
 */
angular.module('cgeUploaderApp')
    .service('AuthenticationService', [
        '$http',
        'API',
        '$cookies',
        function ($http, API, $cookies) {
            // AngularJS will instantiate a singleton by calling "new" on this function
            var content = 'application/x-www-form-urlencoded; charset=UTF-8';
            this.login = function Login(username, password, callbackSuccess,
                callbackError) {
                console.log(username, password);
                $http.post(API.url + 'login/', {
                        username: username,
                        password: password,
                        headers: {
                            'Content-Type': content
                        }
                    })
                    .success(function (data, status, headers, config) {
                        callbackSuccess(data, status, headers, config);
                    })
                    .error(function (data, status, headers, config) {
                        callbackError(data, status, headers, config);
                    });
            };
            this.refresh = function (callbackSuccess, callbackError){
                console.log($cookies.get('token'));
                $http.post(API.url + 'token/refresh/', {
                        token: $cookies.get('token'),
                        headers: {
                            'Content-Type': content
                        }
                    })
                    .success(function (data, status, headers, config) {
                        console.log($cookies.get('token'));
                        callbackSuccess(data, status, headers, config);
                        console.log($cookies.get('token'));
                    })
                    .error(function (data, status, headers, config) {
                        callbackError(data, status, headers, config);
                    });
            };
        }
    ]);
