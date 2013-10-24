tcmModule.controller('LoginCtrl',
    ['$rootScope', '$scope', '$location', '$window', 'Auth', '$cookieStore', 'tcm_model', function($rootScope, $scope, $location, $window, Auth, $cookieStore, tcm_model) {
        $scope.loginErrorMessage = "";

        $scope.login = function() {
            Auth.login({
                    username: $scope.username,
                    password: $scope.password,
                    rememberme: $scope.rememberme,
                    role: Auth.userRoles.user
                },
                function(res) {

                    $cookieStore.put('user', res);

                    if(Auth.isLoggedIn){
                        $location.path('/manager');
                    }

                },
                function(err) {
                    $scope.loginErrorMessage ='Authentication error';

                });
        };

    }]);