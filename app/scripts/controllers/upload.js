'use strict';

/**
 * @ngdoc function
 * @name cgeUploaderApp.controller:UploadCtrl
 * @description
 * # UploadCtrl
 * Controller of the cgeUploaderApp
 */
angular.module('cgeUploaderApp')
  .controller('UploadCtrl', ['$scope', 'SITE', function ($scope, SITE) {
      $scope.isolateFiles = [];
      $scope.excelStatus = 'init';
      $scope.filesValid = true;
      $scope.tabs = [];
      $scope.messages = [];
      $scope.metadataActive = true;
      $scope.uploaderActive = false;
      $scope.columnsExample = [
          "sample_name",
          "file_names",
           "...",
          "sequencing_platform",
          "email_address",
          "Notes"
      ];
      $scope.valuesExample = [{
          "sample_name": "Sample_1",
          "file_names": "File_1.fastq File_2.fastq",
          "...": "...",
          "sequencing_platform": "Illumina",

          "email_address": "my@email.com",
          "Notes": "John Peters ; immuno_lab ; batch_63",
      }];
      $scope.site = SITE.name;
      $scope.metadataExampleCollapsed = true;
      $scope.stepActive = 'metadata';
      $scope.fileError = false;
      $scope.errorMessage = '';
      $scope.isCollapsed = true;
      $scope.paused = false;
      $scope.uploading = false;
      $scope.uploaded = false;
      $scope.filesUploaded = 0;
  }]);
