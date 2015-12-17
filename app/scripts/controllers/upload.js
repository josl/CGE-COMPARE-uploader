'use strict';

/**
 * @ngdoc function
 * @name cgeUploaderApp.controller:UploadCtrl
 * @description
 * # UploadCtrl
 * Controller of the cgeUploaderApp
 */
angular.module('cgeUploaderApp')
  .controller('UploadCtrl', function ($scope) {
      $scope.isolateFiles = [];
      $scope.excelStatus = 'init';
      $scope.filesValid = true;
      $scope.tabs = [];
      $scope.messages = [];
      $scope.metadataActive = true;
      $scope.uploaderActive = false;
      $scope.columnsExample = [
          "sample_name",
          "user_name",
          "file_names",
          "sequencing_platform",
          "sequencing_type",
          "email_address",
      ];
      $scope.valuesExample = [{
          "sample_name": "Sample_1",
          "user_name": "gmi_user",
          "file_names": "File_1.fastq File_2.fastq",
          "sequencing_platform": "Illumina",
          "sequencing_type": "paired",
          "email_address": "my@email.com",
      }];
      $scope.metadataExampleCollapsed = true;
      $scope.stepActive = 'metadata';
      $scope.fileError = false;
      $scope.errorMessage = '';
      $scope.isCollapsed = true;
      $scope.paused = false;
      $scope.uploading = false;
      $scope.uploaded = false;
      $scope.filesUploaded = 0;
  });
