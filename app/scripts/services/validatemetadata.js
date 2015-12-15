'use strict';

/**
 * @ngdoc service
 * @name cgeUploaderApp.ValidateMetadata
 * @description
 * # ValidateMetadata
 * Service in the cgeUploaderApp.
 */
angular.module('cgeUploaderApp')
  .service('ValidateMetadata', ['LoadMetadata', '$q', 'UID',
  function (LoadMetadata, $q, UID) {
    // AngularJS will instantiate a singleton by calling 'new' on this function
    this.parse = function (metadata, file){
        var deferred = $q.defer();
        var promise = deferred.promise;
        var answer = {
            message: '',
            excelStatus: 'init',
            errorMessages: [],
            columns: [],
            values: [],
            templateFiles: [],
            warning: false,
            warningMessages: []
        };
        console.log('starting...', metadata, file);
        // Read metadata file
        LoadMetadata.source(file).getJSON(function(template){
            // Remove $$ properties from $resource
            template = angular.fromJson(angular.toJson(template));
            var templateKeys = _.keys(template.columns);
            var files = [];
            var line = 1;
            angular.forEach(metadata, function(isolateMetadata){
                var column = 0;
                var metadataKeys = _.keys(isolateMetadata);
                // Extended metadata keys
                var difference = _.difference(templateKeys, metadataKeys);
                var emptyIsolate = _.object(
                    difference,
                    _.map(difference, function(){ return ''; })
                );
                _.extendOwn(isolateMetadata, emptyIsolate);
                isolateMetadata.meta_uid = UID.updateUID();
                // Validate mandatory fields
                angular.forEach(template.mandatory, function(key){
                    var allowedValues = template.columns[key];
                    // Checking for allowed values
                    if (typeof(allowedValues) === typeof([])){
                        if (!_.contains(allowedValues, isolateMetadata[key].trim())){
                            answer.errorMessages.push('[Line ' + line.toString() + '] ' + key + ' ' +
                            isolateMetadata[key] + ' is not a valid option');
                            console.log(
                                '[Line ' + line.toString() + '] ' + key + ' ' +
                                isolateMetadata[key] + ' is not a valid option'
                            );
                            answer.excelStatus = 'error';
                        }
                    }else{
                        // Checking for non-empty values
                        if (isolateMetadata[key].trim() === ""){
                            console.log(
                                '[Line ' + line.toString() + '] ' +
                                'Missing value for ' + key + ' '
                            );
                            answer.errorMessages.push('[Line ' + line.toString() + '] ' +
                            'Missing value for ' + key + ' ');
                            answer.excelStatus = 'error';
                        }
                        if (key === 'file_names'){
                            var isolateFiles = isolateMetadata[key].split(' ');
                            isolateFiles.forEach(function(fileName){
                                if (fileName === ''){
                                    var str = '[Line ' + line.toString() +
                                              '] ' + 'File missing';
                                    answer.errorMessages.push(str);
                                    answer.excelStatus = 'error';
                                }else{
                                    files.push(fileName);
                                }
                            });
                        }else if (key === 'collection_date') {
                            var date = moment(isolateMetadata[key],
                                              ['YYYY-MM-DD', 'YYYY-MM', 'YYYY'],
                                              true);
                            if (!date.isValid()) {
                                console.log('error in date');
                                var str = '[Line ' + line.toString() +
                                          '] ' + 'Date has a wrong format';
                                answer.errorMessages.push(str);
                                answer.excelStatus = 'error';
                            }
                           }
                        }
                        column += 1;
                    });

                // Validate values
                line += 1;
            });
            answer.columns = _.keys(metadata[0]);
            answer.metadata = metadata;
            answer.excelStatus = answer.excelStatus !== 'error'? 'valid': 'error';
            if (answer.excelStatus === 'error') {
                answer.message = 'Metadata is invalid';
            }
            answer.templateFiles = files;
            // Catch later by then. TODO: implement deferred.reject for errors
            deferred.resolve(answer);
        });

        return promise;
      };
}]);
