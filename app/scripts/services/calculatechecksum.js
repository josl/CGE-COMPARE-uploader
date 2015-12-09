'use strict';

/**
 * @ngdoc service
 * @name cgeUploaderApp.CalculateCheckSum
 * @description
 * # CalculateCheckSum
 * Service in the cgeUploaderApp.
 */
angular.module('cgeUploaderApp')
    .service('CalculateCheckSum', ['$q', function ($q) {
            // AngularJS will instantiate a singleton by calling "new" on this function


            this.md5 = function (file, chunk_size) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var blobSlice = File.prototype.slice ||
                                File.prototype.mozSlice ||
                                File.prototype.webkitSlice,
                    chunks = Math.ceil(file.size / chunk_size),
                    currentChunk = 0,
                    spark = new SparkMD5.ArrayBuffer(),
                    fileReader = new FileReader();

                fileReader.onload = function (e) {
                    // console.log('read chunk nr', currentChunk + 1, 'of', chunks);
                    spark.append(e.target.result); // Append array buffer
                    currentChunk++;

                    if (currentChunk < chunks) {
                        loadNext();
                    } else {
                        var hash = spark.end();
                        console.info('computed md5', hash); // Compute hash
                        deferred.resolve(hash);
                    }
                };

                fileReader.onerror = function () {
                    console.warn('oops, something went wrong.');
                };

                function loadNext() {
                    var start = currentChunk * chunk_size;
                    var end = ((start + chunk_size) >= file.size) ?
                                file.size :
                                start + chunk_size;

                    fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
                }
                console.log(file.name, chunk_size);
                loadNext();
                return promise;
            };

            this.hash = function (){
                return Math.random().toString(32).slice(2);
            };

            this.sha512 = function (file, chunk_size) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var blobSlice = File.prototype.slice ||
                                File.prototype.mozSlice ||
                                File.prototype.webkitSlice,
                    chunks = Math.ceil(file.size / chunk_size),
                    currentChunk = 0;
                    var shaObj = new jsSHA("SHA-512", "TEXT");
                    var text = "";
                    var fileReader = new FileReader();

                fileReader.onload = function (e) {
                    // console.log('read chunk nr', currentChunk + 1, 'of', chunks);
                    text.concat(e.target.result); // Append array buffer
                    currentChunk++;

                    if (currentChunk < chunks) {
                        loadNext();
                    } else {
                        var hash = shaObj.getHash("HEX");
                        // console.info('computed SHA-512', hash); // Compute hash
                        deferred.resolve(hash);
                    }
                };

                fileReader.onerror = function () {
                    console.warn('oops, something went wrong.');
                };

                function loadNext() {
                    var start = currentChunk * chunk_size;
                    var end = ((start + chunk_size) >= file.size) ?
                                file.size :
                                start + chunk_size;

                    fileReader.readAsText(blobSlice.call(file, start, end));
                }
                // console.log(file.name);
                loadNext();
                return promise;
            };
    }]);
