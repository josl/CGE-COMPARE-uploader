'use strict';

/**
 * @ngdoc function
 * @name cgeUploaderApp.controller:ServiceuploaderCtrl
 * @description
 * # ServiceuploaderCtrl
 * Controller of the cgeUploaderApp
 */
angular.module('cgeUploaderApp')
  .controller('ServiceuploaderCtrl', function ($scope) {
      $scope.isolateFiles = [];
      $scope.templateFiles = [1];
      $scope.excelStatus = 'valid';
      $scope.filesValid = true;
  });
