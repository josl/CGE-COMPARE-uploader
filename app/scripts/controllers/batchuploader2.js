'use strict';

/**
 * @ngdoc function
 * @name cgeUploaderApp.controller:Batchuploader2Ctrl
 * @description
 * # Batchuploader2Ctrl
 * Controller of the cgeUploaderApp
 */
angular.module('cgeUploaderApp')
  .controller('Batchuploader2Ctrl', function ($scope) {
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
          "reference"
      ];
      $scope.valuesExample = [{
          "sample_name": "Sample_1",
          "user_name": "gmi_user",
          "file_names": "File_1.fastq File_2.fastq",
          "sequencing_platform": "Illumina",
          "sequencing_type": "paired",
          "email_address": "my@email.com",
          "reference": "CFSAN018751"
      }];
      $scope.metadataExampleCollapsed = true;
      $scope.stepActive = 'metadata';
      $scope.fileError = false;
      $scope.errorMessage = '';
      $scope.isCollapsed = true;
      $scope.paused = false;
      $scope.uploading = false;
      $scope.uploaded = false;
  });
