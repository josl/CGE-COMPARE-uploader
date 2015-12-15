'use strict';

/**
 * @ngdoc service
 * @name cgeUploaderApp.AuthInterceptor
 * @description
 * # AuthInterceptor
 * Factory in the cgeUploaderApp.
 */
angular.module('cgeUploaderApp')
  .factory('AuthInterceptor', ['$window', '$q', function ($window, $q) {
      return {
          request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
              config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
            }
            return config;
          },
          responseError: function (rejection) {
            if (rejection.status === 401) {
              // handle the case where the user is not authenticated
            }
            return $q.reject(rejection);
          }
        };
  }]);
