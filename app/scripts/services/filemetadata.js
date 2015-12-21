'use strict';

/**
 * @ngdoc service
 * @name cgeUploaderApp.getFiles
 * @description
 * # getFiles
 * Service in the cgeUploaderApp.
 */
angular.module('cgeUploaderApp')
  .service('FileMetadata', ['$http', 'API', '$cookies', function ($http, API, $cookies) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.get = function (callback, errorCallback) {
        $http({
                url: API.url + 'api/data',
                method: 'GET',
                params: {
                    'token': $cookies.get('token')
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            })
            .then(callback, errorCallback);
    };

  }]);
