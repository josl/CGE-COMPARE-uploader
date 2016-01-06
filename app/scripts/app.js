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
        'ui.bootstrap.collapse',
        'cgeUploaderApp.config',
    ])
    .config(function ($routeProvider, $httpProvider, SITE) {

        $httpProvider.interceptors.push('AuthInterceptor');

        $routeProvider
            .when('/compareupload', {
                templateUrl: 'views/upload.html',
                controller: 'UploadCtrl',
                controllerAs: 'upload'
            })
            .when('/comparedownload', {
                templateUrl: 'views/download.html',
                controller: 'DownloadCtrl',
                controllerAs: 'download'
            })
            .when('/comparelogin', {
              templateUrl: 'views/login.html',
              controller: 'LoginCtrl',
              controllerAs: 'login'
            })
            .when('/engageupload', {
                templateUrl: 'views/upload.html',
                controller: 'UploadCtrl',
                controllerAs: 'upload'
            })
            .when('/engagedownload', {
                templateUrl: 'views/download.html',
                controller: 'DownloadCtrl',
                controllerAs: 'download'
            })
            .when('/engagelogin', {
              templateUrl: 'views/login.html',
              controller: 'LoginCtrl',
              controllerAs: 'login'
            })
            .otherwise({
                redirectTo: '/' + SITE.url + 'login'
            })
            ;
        // Cross Site Request Forgery protection
        //   $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        //   $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
        //   $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    })
    .run(function ($rootScope, $location, $cookies, $http, $window, AuthenticationService, SITE) {
         // keep user logged in after page refresh
         $rootScope.$on('$locationChangeStart', function (event, next, current) {
             console.log($cookies.get('token'));
             var token = $cookies.get('token') || false;
             console.log(token);
             // redirect to login page if not logged in and trying to access a restricted page
             var restrictedPage = $.inArray($location.path(), ['/' + SITE.url + 'login']) === -1;
             var loggedIn = token;
             console.log(restrictedPage, loggedIn);
             if (restrictedPage && !loggedIn) {
                 $cookies.remove('token');
                 $rootScope.$broadcast('newLogin');
                 $location.path('/' + SITE.url + 'login');
             } else {
                 console.log('Token exists!');
                 // Try to refresh token
                 if (token) {
                     AuthenticationService.refresh(
                         function (data, status, headers, config) {
                             console.log('token refreshed!', data);
                             $cookies.put('token', angular.fromJson(data).token);
                         },
                         function (data, status, headers, config) {
                             console.log('error');
                             $cookies.remove('token');
                             $rootScope.$broadcast('newLogin');
                             $location.path('/' + SITE.url + 'login');
                         }
                     );
                 }
             }
         });
    });
