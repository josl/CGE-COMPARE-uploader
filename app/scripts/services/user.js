'use strict';

/**
 * @ngdoc service
 * @name cgeUploaderApp.user
 * @description
 * # user
 * Factory in the cgeUploaderApp.
 */
angular.module('cgeUploaderApp')
  .factory('User', ['$rootScope', function ($rootScope) {

    // Public API here
    var service = {
        name: '',
        setName: function (name) {
            service.name = name;
            service.loggedIn = true;
            $rootScope.$broadcast('nameUpdated');
        },
        loggedIn: false
    };
    return service;
}]);
