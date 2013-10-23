tcmModule.controller('LoginCtrl',
    ['$rootScope', '$scope', '$location', '$window', 'Auth', '$cookieStore', 'tcm_model', function($rootScope, $scope, $location, $window, Auth, $cookieStore, tcm_model) {
        $scope.loginErrorMessage = "";
        $scope.alertClass = "login-alert hide";

        $scope.login = function() {
            Auth.login({
                    username: $scope.username,
                    password: $scope.password,
                    rememberme: $scope.rememberme,
                    role: Auth.userRoles.user
                },
                function(res) {

                    $cookieStore.put('user', res);

                    $scope.loginFormStyle = {height: "310"};
                    $scope.loginErrorMessage = 'User authenticated, Please select a project';
                    $scope.alertClass = 'login-alert alert-success';

                    if(Auth.isLoggedIn){
                        $location.path('/manager');
                    }

                },
                function(err) {
                    $scope.loginErrorMessage ='Authentication error';
                    $scope.alertClass = 'login-alert alert-danger';
                    $rootScope.error = "Failed to login";
                });
        };

    }]);