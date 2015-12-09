'use strict';
/* jshint -W083, unused: true, -W098 */

/**
 * @ngdoc directive
 * @name cgeUploaderApp.directive:submitUpload
 * @description
 * # submitUpload
 */
angular.module('cgeUploaderApp')
    .directive('submitUpload', ['Upload', '$timeout', 'CalculateCheckSum', 'UID', '$http', '$httpParamSerializer',
        function (Upload, $timeout, CalculateCheckSum, UID, $http, $httpParamSerializer) {
            return {
                templateUrl: 'templates/submitUpload.html',
                restrict: 'E',
                // scope: true,
                link: function postLink(scope, element, attrs) {
                    var chunk_size = 1024*1024;

                    function startUpload(file, chunk_size) {
                        var uid = UID.updateUID();
                        if (!file.formData) {
                            console.log('First time!');
                            file.formData = {
                                file: file,
                                test: "this is a test data",
                                uid: uid,
                            };
                        }else {
                            console.log('I think we paused...', file.formData.upload_id);
                        }
                        return Upload.upload({
                            url: 'http://127.0.0.1:8000/api/chunks',
                            data: file.formData,
                            sendFieldsAs: 'form',
                            // transformRequest: function (request, headers) {
                            //     if (file.resume) {
                            //         console.log('we shouldn\'t go in here!');
                            //         var new_chunk_size = chunk_size;
                            //         if (file.resume + chunk_size >= file.size){
                            //             new_chunk_size = file.size - file.resume;
                            //         }
                            //         var end = file.resume + new_chunk_size - 1;
                            //         file.headers.CONTENT_RANGE =
                            //             'bytes ' + (file.resume) +
                            //             '-' + end +
                            //             '/' + new_chunk_size;
                            //         console.log('bytes ' + (file.resume) +
                            //         '-' + end +
                            //         '/' + new_chunk_size);
                            //         file.resume = false;
                            //     }
                            //     return request;
                            // },
                            transformResponse: function (data, headers) {
                                // console.log(data, headers());
                                var answer = angular.fromJson(data);
                                file.formData.upload_id = answer.upload_id;
                                file.upload_id = file.formData.upload_id;
                                var new_chunk_size = chunk_size;
                                if (_.isEqual(_.keys(answer), ['expires', 'upload_id', 'offset'])){
                                    console.log('second thing');
                                    if (answer.offset + chunk_size >= file.size){
                                        new_chunk_size = file.size - answer.offset;
                                    }
                                    // if (new_chunk_size < chunk_size) {
                                    //     file.upload.pause();
                                    // }
                                    var end = answer.offset + new_chunk_size - 1;
                                    // console.log(end);
                                    file.headers.CONTENT_RANGE =
                                        'bytes ' + (answer.offset) +
                                        '-' + end +
                                        '/' + new_chunk_size;
                                    console.log('bytes ' + (answer.offset) +
                                    '-' + end +
                                    '/' + new_chunk_size);
                                    console.log(file.formData.upload_id );
                                } else {
                                    console.log(answer.detail);
                                    scope.fileError = file.pause? scope.fileError: true;
                                    scope.errorMessage = answer.detail? answer.detail : 'Error: Network connection';
                                }
                            },
                            method: 'POST',
                            file: file,
                            resumeChunkSize: chunk_size,
                            headers: file.headers,
                            resumeSizeResponseReader: function(data) {
                                console.log(data.size, file);
                                file.resume = data.size;
                                var new_chunk_size = chunk_size;
                                if (file.resume + chunk_size >= file.size){
                                    new_chunk_size = file.size - file.resume;
                                }
                                var end = file.resume + new_chunk_size - 1;
                                file.headers.CONTENT_RANGE =
                                    'bytes ' + (file.resume) +
                                    '-' + end +
                                    '/' + new_chunk_size;
                                console.log('bytes ' + (file.resume) +
                                '-' + end +
                                '/' + new_chunk_size);
                                return data.size;
                            }, // reads the uploaded file size from resumeSizeUrl GET response
                            resumeSizeUrl:'http://127.0.0.1:8000/api/size?file=' +
                                        encodeURIComponent(file.name) + '&uid=' + (file.upload_id === undefined? '' : file.upload_id),
                        });
                    }
                    scope.upload = function (file) {
                        file.upload = startUpload(file, chunk_size);
                        file.upload.then(function (response) {
                            $timeout(function () {
                                console.log("Done", response);
                                file.result = response.config.data;
                                file.waiting = true;
                                // Send "SAVE" request with chechsum
                                CalculateCheckSum.md5(file, chunk_size).then(function(hash){
                                    console.log(hash, file.name);
                                    $http({
                                        url: 'http://127.0.0.1:8000/api/save',
                                        method: "POST",
                                        data: $httpParamSerializer({
                                            upload_id : file.result.upload_id,
                                            'md5': hash
                                        }),
                                        headers: {
                                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                                        }
                                    })
                                    .then(function(response) {
                                        // success
                                        file.success = true;
                                        file.waiting = false;
                                        scope.paused = false;
                                        scope.uploading = false;
                                        scope.uploaded = true;
                                        file.paused = false;
                                        file.uploading = false;
                                        file.uploaded = true;
                                        console.log(file.progress, response);
                                    },
                                    function(response) {
                                                // failed
                                        console.log(response);
                                        scope.fileError = true;
                                        file.waiting = false;
                                        scope.errorMessage = 'Error: ' + response.data.detail;
                                    });
                                    }
                                );
                            });
                        }, function (response) {
                            console.log(scope.paused, file.pause);
                            scope.fileError = file.pause? scope.fileError: true;
                            console.log(response.detail);
                            if (scope.errorMessage !== '') {
                                scope.errorMessage = response.detail? response.detail : 'Error: Network connection';
                            }
                        }, function (evt) {
                            // console.log(evt.type, evt.config.__XHR.response);
                            // if (evt.type === "load" && false &&
                            //     evt.config.__XHR.response !== ''){
                            //         // console.log(evt.config.__XHR.response);
                            //         // Empty response
                            //         var answer = angular.fromJson(evt.config.__XHR.response);
                            //         file.formData.upload_id = answer.upload_id;
                            //         // console.log(answer, _.keys(answer));
                            //         if (_.isEqual(_.keys(answer), ['expires', 'upload_id', 'offset'])){
                            //             // var end = 0;
                            //             // if (answer.offset + chunk_size >= file.size){
                            //             //     end = file.size -1;
                            //             // }else{
                            //             //     end = answer.offset + chunk_size - 1;
                            //             // }
                            //             var end = answer.offset + chunk_size - 1;
                            //             file.headers.CONTENT_RANGE =
                            //                 'bytes ' + (answer.offset) +
                            //                 '-' + end +
                            //                 '/' + chunk_size;
                            //             console.log('bytes ' + (answer.offset) +
                            //             '-' + end +
                            //             '/' + chunk_size);
                            //         } else {
                            //             console.log(answer);
                            //         }
                            // }
                                file.progress = Math.min(
                                    100,
                                    parseInt(100.0 * evt.loaded / evt.total));
                            }

                        );
                    };
                    scope.uploadNGUpload = function () {
                        scope.uploading = true;
                        if (scope.isolateFiles && scope.isolateFiles.length) {
                            angular.forEach(scope.isolateFiles, function(file) {
                                if (!file.$error) {
                                    file.headers = {};
                                    scope.upload(file);
                                    // file.upload = startDownload(file, chunk_size);
                                    // file.upload.then(function (response) {
                                    //     $timeout(function () {
                                    //         console.log("Done", response);
                                    //         file.result = response.config.data;
                                    //         file.waiting = true;
                                    //         // Send "SAVE" request with chechsum
                                    //         CalculateCheckSum.md5(file, chunk_size).then(function(hash){
                                    //             console.log(hash, file.name);
                                    //             $http({
                                    //                 url: 'http://127.0.0.1:8000/api/save',
                                    //                 method: "POST",
                                    //                 data: $httpParamSerializer({
                                    //                     upload_id : file.result.upload_id,
                                    //                     'md5': hash
                                    //                 }),
                                    //                 headers: {
                                    //                     'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                                    //                 }
                                    //             })
                                    //             .then(function(response) {
                                    //                 // success
                                    //                 file.success = true;
                                    //                 file.waiting = false;
                                    //                 console.log(file.progress, response);
                                    //             },
                                    //             function(response) {
                                    //                         // failed
                                    //                 console.log(response);
                                    //                 scope.fileError = true;
                                    //                 file.waiting = false;
                                    //                 scope.errorMessage = 'Error: ' + response.data.detail;
                                    //             });
                                    //             }
                                    //         );
                                    //     });
                                    // }, function (response) {
                                    //     scope.fileError = true;
                                    //     scope.errorMessage = 'Error: Network connection';
                                    // }, function (evt) {
                                    //     // console.log(evt.type, evt.config.__XHR.response);
                                    //     // if (evt.type === "load" && false &&
                                    //     //     evt.config.__XHR.response !== ''){
                                    //     //         // console.log(evt.config.__XHR.response);
                                    //     //         // Empty response
                                    //     //         var answer = angular.fromJson(evt.config.__XHR.response);
                                    //     //         file.formData.upload_id = answer.upload_id;
                                    //     //         // console.log(answer, _.keys(answer));
                                    //     //         if (_.isEqual(_.keys(answer), ['expires', 'upload_id', 'offset'])){
                                    //     //             // var end = 0;
                                    //     //             // if (answer.offset + chunk_size >= file.size){
                                    //     //             //     end = file.size -1;
                                    //     //             // }else{
                                    //     //             //     end = answer.offset + chunk_size - 1;
                                    //     //             // }
                                    //     //             var end = answer.offset + chunk_size - 1;
                                    //     //             file.headers.CONTENT_RANGE =
                                    //     //                 'bytes ' + (answer.offset) +
                                    //     //                 '-' + end +
                                    //     //                 '/' + chunk_size;
                                    //     //             console.log('bytes ' + (answer.offset) +
                                    //     //             '-' + end +
                                    //     //             '/' + chunk_size);
                                    //     //         } else {
                                    //     //             console.log(answer);
                                    //     //         }
                                    //     // }
                                    //     file.progress = Math.min(
                                    //         100,
                                    //         parseInt(100.0 * evt.loaded / evt.total));
                                    //     }
                                    // );
                                }
                            });

                        }
                    };
                }
            };
        }
    ]);
