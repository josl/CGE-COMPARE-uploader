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
        'ui.grid.exporter',
        'ui.bootstrap.collapse'
    ])
    .config(function ($routeProvider, $httpProvider) {

        $httpProvider.interceptors.push('AuthInterceptor');

        $routeProvider
            // .when('/about', {
            //     templateUrl: 'views/about.html',
            //     controller: 'AboutCtrl',
            //     controllerAs: 'about'
            // })
            // .when('/ringTrials', {
            //     templateUrl: 'views/ringtrials.html',
            //     controller: 'RingtrialsCtrl',
            //     controllerAs: 'ringTrials'
            // })
            // .when('/batchUpload', {
            //     templateUrl: 'views/batchupload.html',
            //     controller: 'BatchuploadCtrl',
            //     controllerAs: 'batchUpload'
            // })
            // .when('/batchUploader', {
            //     templateUrl: 'views/batchuploader.html',
            //     controller: 'BatchuploaderCtrl',
            //     controllerAs: 'batchUploader'
            // })
            // .when('/serviceUploader', {
            //     templateUrl: 'views/serviceuploader.html',
            //     controller: 'ServiceuploaderCtrl',
            //     controllerAs: 'serviceUploader'
            // })
            // .when('/about', {
            //     templateUrl: 'views/about.html',
            //     controller: 'AboutCtrl',
            //     controllerAs: 'about'
            // })
            // .when('/batchUploader2', {
            //     templateUrl: 'views/batchuploader2.html',
            //     controller: 'Batchuploader2Ctrl',
            //     controllerAs: 'batchUploader2'
            // })
            // .when('/file-sharing', {
            //     templateUrl: 'views/file-sharing.html',
            //     controller: 'FileSharingCtrl',
            //     controllerAs: 'fileSharing'
            // })
            .when('/upload', {
                templateUrl: 'views/upload.html',
                controller: 'UploadCtrl',
                controllerAs: 'upload'
            })
            .when('/download', {
                templateUrl: 'views/download.html',
                controller: 'DownloadCtrl',
                controllerAs: 'download'
            })
            .when('/login', {
              templateUrl: 'views/login.html',
              controller: 'LoginCtrl',
              controllerAs: 'login'
            })
            .otherwise({
                redirectTo: '/upload'
            });
        // Cross Site Request Forgery protection
        //   $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        //   $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
        //   $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    })
    .run(function ($rootScope, $location, $cookies, $http, $window) {
         // keep user logged in after page refresh
         $rootScope.$on('$locationChangeStart', function (event, next, current) {
            //  var token = $window.sessionStorage.token || null;
             var token = $cookies.get('token') || null;
             console.log(token);
             // redirect to login page if not logged in and trying to access a restricted page
             var restrictedPage = $.inArray($location.path(), ['/login']) === -1;
             var loggedIn = token;
             if (restrictedPage && (!loggedIn || loggedIn === 'undefined')) {
                 $location.path('/login');
             } else {
                 console.log('yuhu!');
             }
         });
    });
