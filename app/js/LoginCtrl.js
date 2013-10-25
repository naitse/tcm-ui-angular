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
                        tcm_model.getProjects(function(data){


                            for(var i = 0; i < data.length; i++){
                                if(data[i].active === '1'){
                                    $location.path('/manager/' + data[i].id);
                                }
                            }

                            $location.path('/manager/' + data[0].id);
                        });

                    }

                },
                function(err) {
                    $scope.loginErrorMessage ='Authentication error';

                });
        };

    }]);