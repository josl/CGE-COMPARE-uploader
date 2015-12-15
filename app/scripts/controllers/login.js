'use strict';

/**
 * @ngdoc function
 * @name cgeUploaderApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the cgeUploaderApp
 */
angular.module('cgeUploaderApp')
    .controller('LoginCtrl', [
        'AuthenticationService',
        '$scope',
        '$location',
        '$window',
        '$cookies',
        '$rootScope',
        'User',
        function (AuthenticationService, $scope, $location, $window, $cookies, $rootScope, User) {

            $scope.isAuthenticated = false;
            $scope.error = false;
            $scope.loginUser = function() {
                console.log('lala');
                $scope.dataLoading = true;
                AuthenticationService.login($scope.username, $scope.password,
                    function (data, status, headers, config) {
                        // $window.sessionStorage.token = data.token;
                        // $localStorage.token = data.token;
                        $cookies.put('token', data.token);
                        $cookies.put('user', $scope.username);
                        $scope.isAuthenticated = true;
                        console.log(data);
                        $location.path('/upload');
                        console.log($scope.username);
                        User.setName($scope.username);
                        // User.loggedIn = true;
                        console.log(User);
                        $rootScope.$emit('loggedIn');
                    },
                    function (data, status, headers, config) {
                        // Erase the token if the user fails to log in
                        // delete $window.sessionStorage.token;
                        // delete $localStorage.token
                        $scope.isAuthenticated = false;
                        $cookies.remove('token');
                        $cookies.remove('user');
                        // Handle login errors here
                        $scope.loginError = 'Error: Invalid user or password';
                        $scope.dataLoading = false;
                        $scope.error = true;
                    });
            };

           $scope.logout = function () {
               $scope.welcome = '';
               $scope.message = '';
               $scope.isAuthenticated = false;
               $scope.error = false;
               $cookies.remove('token');
               $cookies.remove('user');
          };

        }]);
