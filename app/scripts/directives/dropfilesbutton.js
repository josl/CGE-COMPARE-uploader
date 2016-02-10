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
                        // Append metadata to file
                        var meta = _.find(scope.metadata, function(meta){
                            return _.contains(meta.file_names.split(' '), $file.name);
                        });
                        console.log($file.name, meta.file_names);
                        $file.meta = meta;
                        return _.contains(scope.templateFiles, $file.name);
                    }else {
                        scope.templateFiles.push($file.name);
                        return true;
                    }
                };
            }
        };
    });
