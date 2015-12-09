'use strict';

/**
 * @ngdoc directive
 * @name cgeUploaderApp.directive:dropFilesButton
 * @description
 * # dropFilesButton
 */
angular.module('cgeUploaderApp')
    .directive('dropFilesButton', function () {
        return {
            templateUrl: 'templates/dropFilesButton.html',
            restrict: 'E',
            link: function postLink(scope, element, attrs) {
                scope.tabs = scope.$parent.tabs;
                scope.filesValid = false;
                scope.isService = attrs.isService;
                scope.errors = false;
                scope.uploaded = false;
                scope.validate = function ($file) {
                    if (scope.isService === 'false'){
                        return _.contains(scope.templateFiles, $file.name);
                    }else {
                        scope.templateFiles.push($file.name);
                        return true;
                    }
                };
            }
        };
    });
