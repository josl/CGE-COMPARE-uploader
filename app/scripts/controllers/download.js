'use strict';

/**
 * @ngdoc function
 * @name cgeUploaderApp.controller:DownloadCtrl
 * @description
 * # DownloadCtrl
 * Controller of the cgeUploaderApp
 */
angular.module('cgeUploaderApp')
    .controller('DownloadCtrl', [
        '$scope',
        '$http',
        '$httpParamSerializer',
        '$cookies',
        '$resource',
        '$window',
        '$location',
        'API',
        'FileMetadata',
        'AuthenticationService',
        'GridMetadata',
        'SITE',
        function ($scope, $http, $httpParamSerializer, $cookies, $resource,
                  $window, $location, API, FileMetadata, AuthenticationService,
                  GridMetadata, SITE) {
            var cellTemplate = '<a ng-hide=true id="{{row.entity.meta_id}}"></a>' +
                '<button ng-click="grid.appScope.downloadFile(row, row.entity.files[0]);"' +
                'class="btn file-download"><i class="mdi-file-file-download"></i></button>' +
                '<button ng-show="row.entity.n_files > 1" ng-click="grid.appScope.downloadFile(row, row.entity.files[1]);"' +
                'class="btn file-download"><i class="mdi-file-file-download"></i></button>'
            $scope.metadataExampleCollapsed = true;
            $scope.metadataActive = true;
            $scope.error = false;
            $scope.site = SITE.url;
            $scope.downloadFile = function (row, file_id) {
                console.log(row.entity.meta_id);
                var element = angular.element('#' + row.entity.meta_id);
                element.attr({
                    href: API.url + 'api/file?' + 'token=' +
                          $cookies.get('token') + '&file_id=' + file_id,
                    target: '_self',
                    download: 'file.data'
                })[0].click();
            };

            $scope.gridOptions = GridMetadata.options(cellTemplate);
            var parseFileData = function(response) {
                var rows = angular.fromJson(response.data);
                $scope.gridOptions.data = [];
                angular.forEach(rows, function (meta) {
                    console.log(meta);
                    $scope.gridOptions.data.push(meta.fields);
                });
            };
            var errorHandler = function(response) {
                console.log(response);
                var answer = response.data.detail ? response.data.detail : response.data;
                // $scope.errorMessage = 'Warning: ' + answer;
                // console.log($scope.errorMessage );
                if (answer === 'Authentication expired') {
                    $scope.error = true;
                    $scope.errorMessage = 'Error: Please login again';
                    console.log($scope.errorMessage );
                }
            };
            FileMetadata.get(parseFileData, errorHandler);
        }
    ]);
