'use strict';

/**
 * @ngdoc directive
 * @name cgeUploaderApp.directive:metadata
 * @description
 * # metadata
 */
angular.module('cgeUploaderApp')
    .directive('metadata', ['ValidateMetadata', function (ValidateMetadata) {
        return {
            templateUrl: 'templates/metadata.html',
            restrict: 'E',
            link: function postLink(scope, element, attrs) {
                scope.excelStatus = 'init';
                scope.gridOptions = {
                    showGridFooter: true,
                    enableSorting: true,
                    cellEditableCondition: true,
                };

                scope.visible = attrs.visible;
                scope.$watch('excelFile', function (newFile, oldFile) {
                    if (oldFile !== newFile && newFile !== null) {
                        console.log(newFile, oldFile);
                        scope.isolateFiles = [];
                        scope.gridOptions.data = [];
                        scope.gridOptions.columnDefs = [];
                        var reader = new FileReader();
                        reader.readAsBinaryString(newFile);
                        reader.onload = function (event) {
                            var workbook = XLSX.read(event.target.result, {
                                type: 'binary'
                            });
                            var sheetNameList = workbook.SheetNames;
                            var sheet = workbook.Sheets[sheetNameList[0]];
                            var metadata = XLSX.utils.sheet_to_json(sheet);
                            console.log(metadata);
                            //   Validation
                            if (metadata.length === 0) {
                                console.log('Metadata file is empty');
                                scope.excelStatus = 'error';
                                scope.message = 'Metadata file is empty!';
                            } else {
                                ValidateMetadata
                                .parse(metadata, attrs.file)
                                .then(function (validation) {
                                    angular.extend(scope, validation);
                                    angular.forEach(scope.columns, function(column){
                                        scope.gridOptions
                                             .columnDefs
                                             .push({field: column,
                                                    width: '20%'});
                                    });
                                    scope.gridOptions.data = validation.metadata;
                                });
                            }
                            //   Notifications
                            //
                        };
                    }
                });
            }
        };
    }]);
