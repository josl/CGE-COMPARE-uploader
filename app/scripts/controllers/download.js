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
      '$scope', '$http', '$httpParamSerializer', '$cookies', '$resource',
      '$window', '$location',
      function ($scope, $http, $httpParamSerializer, $cookies, $resource, $window, $location) {
           $scope.metadataExampleCollapsed = true;
           $scope.metadataActive = true;
           $scope.downloadFile = function (row, file_id) {
                console.log(row.entity.meta_id);
                var element = angular.element('#' + row.entity.meta_id);
                   element.attr({
                      href: 'http://127.0.0.1:8000/api/file?' +'token=' + $cookies.get('token') + '&file_id='+file_id,
                      target: '_self',
                      download:'file.data'
                   })[0].click();
           };
          $scope.gridOptions = {
              showGridFooter: true,
              enableSorting: true,
              enableFiltering: true,
              cellEditableCondition: true,
              exporterMenuCsv: true,
              exporterMenuPdf: false,
              enableGridMenu: true,
              columnDefs: [
                  {field: "Download", width: '7%', displayName: '',
                        enableFiltering: false,
                        enableSorting: false,
                        enableHiding: false,
                        enableColumnMenu: false,
                        cellTemplate: '<a ng-hide=true id="{{row.entity.meta_id}}"></a>'+
                                      '<button ng-click="grid.appScope.downloadFile(row, row.entity.files[0]);"'+
                                      'class="btn file-download"><i class="mdi-file-file-download"></i></button>' +
                                      '<button ng-show="row.entity.n_files > 1" ng-click="grid.appScope.downloadFile(row, row.entity.files[1]);"'+
                                      'class="btn file-download"><i class="mdi-file-file-download"></i></button>',
                        cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                            return 'text-center';
                        },
                  },
                  {field: "sample_name", width: '15%'},
                  {field: "user", width: '8%', displayName: 'User'},
                  {field: "file_names", width: '20%', displayName: 'File Names'},
                  {field: "created_on", displayName: 'Uploaded on', width: '25%', cellFilter: 'date'},
                  {field: "sequencing_platform", width: '15%'},
                  {field: "sequencing_type", width: '15%'},
                  {field: "pre_assembled", width: '25%'},
                  {field: "sample_type", width: '25%'},
                  {field: "organism", width: '25%'},
                  {field: "strain", width: '25%'},
                  {field: "subtype", width: '25%'},
                  {field: "country", width: '25%'},
                  {field: "region", width: '25%'},
                  {field: "city", width: '25%'},
                  {field: "zip_code", width: '25%'},
                  {field: "longitude", width: '25%'},
                  {field: "latitude", width: '25%'},
                  {field: "location_note", width: '25%'},
                  {field: "isolation_source", width: '25%'},
                  {field: "source_note", width: '25%'},
                  {field: "pathogenic", width: '25%'},
                  {field: "pathogenicity_note", width: '25%'},
                  {field: "collection_date", width: '25%'},
                  {field: "collected_by", width: '25%'},
                  {field: "usage_restrictions", width: '25%'},
                  {field: "release_date", width: '25%'},
                  {field: "email_address", width: '25%'},
                  {field: "notes", width: '25%'},
              ],
          };

          $http({
              url: 'http://127.0.0.1:8000/api/data',
              method: 'GET',
              params: {'token': $cookies.get('token')},
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
              }
          })
          .then(function(response) {
              var rows = angular.fromJson(response.data);
              $scope.gridOptions.data = [];
              angular.forEach(rows, function (meta) {
                  console.log(meta);
                  $scope.gridOptions.data.push(meta.fields);
              });
          }, function(response) {
              // failed
              console.log(response);
              var answer = response.data.detail? response.data.detail : response.data;
              $scope.errorMessage = 'Error: ' + answer;
          });
  }]);
