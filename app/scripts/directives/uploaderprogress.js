'use strict';

/**
 * @ngdoc directive
 * @name cgeUploaderApp.directive:uploader
 * @description
 * # uploader
 */
angular.module('cgeUploaderApp')
    .directive('uploaderProgress', function () {
        return {
            templateUrl: 'templates/uploaderProgress.html',
            restrict: 'E',
            link: function postLink(scope, element, attrs) {
                scope.totalProgress = 0.0;
                scope.isService = attrs.isService;
            }
        };
    });
