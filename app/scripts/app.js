'use strict';

/**
 * @ngdoc overview
 * @name cgeUploaderApp
 * @description
 * # cgeUploaderApp
 *
 * Main module of the application.
 */
angular
  .module('cgeUploaderApp', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngFileUpload',
    'ui.bootstrap',
    'ui.grid',
    'ui.grid.resizeColumns',
    'ui.grid.autoResize',
    'ui.bootstrap.collapse'
  ])
  .config(function ($routeProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/ringTrials', {
        templateUrl: 'views/ringtrials.html',
        controller: 'RingtrialsCtrl',
        controllerAs: 'ringTrials'
      })
      .when('/batchUpload', {
        templateUrl: 'views/batchupload.html',
        controller: 'BatchuploadCtrl',
        controllerAs: 'batchUpload'
      })
      .when('/batchUploader', {
        templateUrl: 'views/batchuploader.html',
        controller: 'BatchuploaderCtrl',
        controllerAs: 'batchUploader'
      })
      .when('/serviceUploader', {
        templateUrl: 'views/serviceuploader.html',
        controller: 'ServiceuploaderCtrl',
        controllerAs: 'serviceUploader'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/batchUploader2', {
        templateUrl: 'views/batchuploader2.html',
        controller: 'Batchuploader2Ctrl',
        controllerAs: 'batchUploader2'
      })
      .when('/file-sharing', {
        templateUrl: 'views/file-sharing.html',
        controller: 'FileSharingCtrl',
        controllerAs: 'fileSharing'
      })
      .otherwise({
        redirectTo: '/'
      });
      // Cross Site Request Forgery protection
    //   $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    //   $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    //   $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  });
