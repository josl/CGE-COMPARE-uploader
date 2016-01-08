'use strict';

/**
 * @ngdoc function
 * @name cgeUploaderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cgeUploaderApp
 */
angular.module('cgeUploaderApp')
    .controller('MainCtrl', [
        '$scope',
        '$window',
        '$cookies',
        '$rootScope',
        'User',
        'SITE',
        function ($scope, $window, $cookies, $rootScope, User, SITE) {
            console.log(SITE);
            console.log($cookies.get('token'));
            $scope.loggedin = $cookies.get('token') || User.loggedIn ? true : false;
            $scope.active = $scope.loggedin ? 'upload' : 'login';
            console.log($cookies.get('token'));
            $scope.user = $cookies.get('user');
            console.log(User);
            console.log($scope.active, $scope.loggedin, $cookies.get('token') !== undefined);
            console.log(SITE.url);
            $scope.siteUrl = SITE.url;
            $scope.logout = function () {
                console.log('logging out');
                User.loggedIn = false;
                $scope.loggedin = false;
                $cookies.remove('token');
                $cookies.remove('user');
                $scope.user = '';
            };
            $scope.$on('nameUpdated', function () {
                $scope.user = User.name;
                $scope.loggedin = User.loggedIn;
                console.log($scope.user);
            });

            $scope.$on('newLogin', function () {
                $scope.user = '';
                $scope.loggedin = false;
                $cookies.remove('token');
                $cookies.remove('user');
                console.log($scope.user);
            });
        }
    ]);
