'use strict';

/**
 * @ngdoc service
 * @name cgeUploaderApp.LoadMetadata
 * @description
 * # LoadMetadata
 * Factory in the cgeUploaderApp.
 */
angular.module('cgeUploaderApp')
  .factory('LoadMetadata', ['$resource', function ($resource) {
    // Public API here
    return {
      source: function (file) {
          console.log(file);
          var promise = $resource(
              'metadata/'+file+'.json',
              {},
              {getJSON: {method:'GET'}
          });
          return promise;
      }
    };
}]);
