'use strict';
/* jshint -W083, unused: true, -W098 */

/**
 * @ngdoc directive
 * @name cgeUploaderApp.directive:submitUpload
 * @description
 * # submitUpload
 */
angular.module('cgeUploaderApp')
    .directive('submitUpload', [
        'Upload',
        '$timeout',
        'CalculateCheckSum',
        'UID',
        '$http',
        '$httpParamSerializer',
        '$cookies',
        'API',
        function (Upload, $timeout, CalculateCheckSum, UID, $http,
                  $httpParamSerializer, $cookies, API) {
            return {
                templateUrl: 'templates/submitUpload.html',
                restrict: 'E',
                link: function postLink(scope, element, attrs) {
                    var chunk_size = 1024 * 1024;
                    var currentMetaId = null;

                    function startUpload(file, chunk_size) {
                        var uid = UID.updateUID();
                        if (!file.formData) {
                            console.log('First time!');
                            file.formData = {
                                file: file,
                                test: "this is a test data",
                                token: $cookies.get('token'),
                                uid: uid,
                            };
                        } else {
                            console.log('I think we paused...', file.formData.upload_id);
                        }
                        return Upload.upload({
                            url: API.url + 'api/chunks',
                            data: file.formData,
                            sendFieldsAs: 'form',
                            transformResponse: function (data, headers) {
                                var answer = angular.fromJson(data);
                                console.log(answer);
                                file.formData.upload_id = answer.upload_id;
                                file.upload_id = file.formData.upload_id;
                                var new_chunk_size = chunk_size;
                                if (_.isEqual(_.keys(answer), ['token', 'expires', 'upload_id', 'user', 'offset'])) {
                                    console.log('second thing');
                                    if (answer.offset + chunk_size >= file.size) {
                                        new_chunk_size = file.size - answer.offset;
                                    }
                                    console.log($cookies.get('token'));
                                    $cookies.put('token', answer.token);
                                    var end = answer.offset + new_chunk_size - 1;
                                    // console.log(end);
                                    file.headers['Content-Range'] =
                                        'bytes ' + (answer.offset) +
                                        '-' + end +
                                        '/' + new_chunk_size;
                                    console.log('bytes ' + (answer.offset) +
                                        '-' + end +
                                        '/' + new_chunk_size);
                                    console.log(file.formData.upload_id);
                                } else {
                                    console.log(answer.detail);
                                    file.waiting = false;
                                    scope.fileError = file.pause ? scope.fileError : true;
                                    scope.uploading = false;
                                    scope.errorMessage = answer.detail? answer.detail : 'Error: Network connection';
                                    console.log(scope.errorMessage);
                                }
                            },
                            method: 'POST',
                            file: file,
                            resumeChunkSize: chunk_size,
                            headers: file.headers,
                            resumeSizeResponseReader: function (data) {
                                console.log(data.size, file);
                                file.resume = data.size;
                                var new_chunk_size = chunk_size;
                                if (file.resume + chunk_size >= file.size) {
                                    new_chunk_size = file.size - file.resume;
                                }
                                var end = file.resume + new_chunk_size - 1;
                                file.headers['Content-Range'] =
                                    'bytes ' + (file.resume) +
                                    '-' + end +
                                    '/' + new_chunk_size;
                                console.log('bytes ' + (file.resume) +
                                    '-' + end +
                                    '/' + new_chunk_size);
                                return data.size;
                            }, // reads the uploaded file size from resumeSizeUrl GET response
                            resumeSizeUrl: API.url + 'api/size?file=' +
                                encodeURIComponent(file.name) +
                                '&uid=' + (file.upload_id === undefined ? '' : file.upload_id) +
                                '&token=' + $cookies.get('token'),
                        });
                    }
                    scope.upload = function (file) {
                        var meta = file.meta;
                        var sampleFile = file.fileUploading;
                        var totalFiles = file.totalFiles;
                        file.upload = startUpload(file, chunk_size);
                        file.upload.then(function (response) {
                                $timeout(function () {
                                    console.log("Done", response);
                                    file.result = response.config.data;
                                    file.waiting = true;
                                    // Send "SAVE" request with chechsum
                                    CalculateCheckSum.md5(file, chunk_size)
                                        .then(function (hash) {
                                            console.log(hash, file.name, meta, sampleFile, totalFiles);
                                            $http({
                                                    url: API.url + 'api/save',
                                                    method: "POST",
                                                    data: $httpParamSerializer({
                                                        upload_id: file.result.upload_id,
                                                        'md5': hash,
                                                        'meta': meta,
                                                        'token': $cookies.get('token'),
                                                        'sample_file': sampleFile,
                                                        'total_file': totalFiles,
                                                        'meta_id': currentMetaId
                                                    }),
                                                    headers: {
                                                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                                                    },
                                                    transformResponse: function (data, headers) {
                                                        if (sampleFile - 1 < totalFiles) {
                                                            console.log('File #' + sampleFile);
                                                            var answer = angular.fromJson(data);
                                                            console.log(answer);
                                                            currentMetaId = answer.meta_id;
                                                        } else {
                                                            currentMetaId = null;
                                                        }
                                                    }
                                                })
                                                .then(function (response) {
                                                        // success
                                                        file.success = true;
                                                        file.waiting = false;
                                                        scope.paused = false;
                                                        // Get refreshed token
                                                        console.log(response);
                                                        // $cookies.put('token', )
                                                        scope.filesUploaded += 1;
                                                        if (scope.filesUploaded === scope.isolateFiles.length) {
                                                            scope.uploaded = true;
                                                            scope.uploading = false;
                                                        } else {
                                                            console.log('we keep going...');
                                                            scope.uploading = true;
                                                        }

                                                        console.log('DONE! sending SAVE META');
                                                        $http({
                                                                url: API.url + 'api/meta/save',
                                                                method: "POST",
                                                                data: $httpParamSerializer({
                                                                    upload_id: file.result.upload_id,
                                                                    'md5': hash,
                                                                    'meta': meta,
                                                                    'token': $cookies.get('token'),
                                                                    'meta_id': currentMetaId
                                                                }),
                                                                headers: {
                                                                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                                                                }
                                                            })
                                                            .then(function (response) {
                                                                console.log('Meta saved!');
                                                            });
                                                        file.paused = false;
                                                        file.uploading = false;
                                                        file.uploaded = true;
                                                        console.log(file.progress, response);
                                                    },
                                                    function (response) {
                                                        // failed
                                                        console.log(response);
                                                        file.error = true;
                                                        file.paused = true;
                                                        file.waiting = false;
                                                        var answer = response.data.detail ? response.data.detail : response.data;
                                                        scope.errorMessage = 'Error: ' + answer;
                                                    });
                                        });
                                });
                            }, function (response) {
                                console.log(scope.paused, file.pause);
                                scope.fileError = file.pause ? scope.fileError : true;
                                console.log(response.detail);
                                if (scope.errorMessage !== '') {
                                    scope.errorMessage = response.detail ? response.detail : 'Error: Network connection';
                                }
                            }, function (evt) {
                                file.progress = Math.min(
                                    100,
                                    parseInt(100.0 * evt.loaded / evt.total));
                            }

                        );
                    };
                    scope.uploadNGUpload = function () {
                        scope.uploading = true;
                        if (scope.isolateFiles && scope.isolateFiles.length) {
                            console.log(scope.metadata);
                            var index = 0;
                            var filesCounterInSample = 0;
                            angular.forEach(scope.isolateFiles, function (file) {
                                if (!file.$error) {
                                    file.totalFiles = scope.metadata[index].file_names.split(' ')
                                        .length;
                                    file.headers = {};
                                    filesCounterInSample += 1;
                                    file.meta = scope.metadata[index];
                                    file.fileUploading = filesCounterInSample;
                                    if (filesCounterInSample === file.totalFiles) {
                                        index += 1;
                                        filesCounterInSample = 0;
                                    }
                                }
                            });
                            angular.forEach(scope.isolateFiles, function (file) {
                                scope.upload(file);
                            });
                        }
                    };
                }
            };
        }
    ]);
