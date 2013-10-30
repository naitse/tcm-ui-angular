'use strict';

var tcmModule = angular.module('tcm', ['ngRoute', 'ngCookies', 'ui.bootstrap', 'ngResource']).
    config(['$routeProvider', '$locationProvider', '$httpProvider',
        function($routeProvider, $locationProvider, $httpProvider ) {
            var access = routingConfig.accessLevels;

            $routeProvider.when('/manager',
                                {templateUrl: '/app/partials/manager.html',
                                    controller: 'ManagerCntl',
                                    access: access.user
                                }).when('/manager/:projectId',
                                {templateUrl: '/app/partials/manager.html',
                                 controller: 'ManagerCntl',
                                 access: access.user
                                }).when('/plugins/:projectId',
                                {templateUrl: '/app/partials/plugin_settings.html',
                                    controller: 'PluginsCntl',
                                    access: access.user
                                }).when('/project/:projectId',
                                {templateUrl: '/app/partials/project_settings.html',
                                    controller: 'ProjectSettingsCntl',
                                    access: access.user
                                }).when('/admin/:projectId',
                                {templateUrl: '/app/partials/tcm_settings.html',
                                    controller: 'TCMSettingsCntl',
                                    access: access.admin
                                }).when('/login',
                                {
                                    templateUrl: 'app/partials/login.html',
                                    controller: 'LoginCtrl',
                                    access: access.anon
                                }).otherwise({redirectTo:'/login'});

            var interceptor = ['$location', '$q', function($location, $q) {
                function success(response) {

                    return response;
                }

                function error(response) {

                    if(response.status === 401) {
                        $location.path('/login');
                        return $q.reject(response);
                    }
                    else {
                        return $q.reject(response);
                    }
                }

                return function(promise) {
                    return promise.then(success, error);
                }
            }];

            $httpProvider.responseInterceptors.push(interceptor);
            $httpProvider.defaults.withCredentials = true;

        }]).filter('range', function() {
        return function(input, total) {
            total = parseInt(total);
            for (var i=0; i<total; i++)
                input.push(i);
            return input;
        }
    });

tcmModule.directive('chosen',function(){
    var linker = function(scope,element,attrs) {
        var list = attrs['chosen'];

        scope.$watch(list, function(){
            element.trigger('liszt:updated');
        });

        element.chosen();
    };

    return {
        restrict:'A',
        link: linker
    }
});

tcmModule.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {

    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        $rootScope.error = null;

        if (next.bitMask != null && !Auth.authorize(next.access)) {
            if(Auth.isLoggedIn()) $location.path('/manager');
            else $location.path('/login');
        }
    });

}]);

tcmModule.directive('ngModelOnblur', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attr, ngModelCtrl) {

            if (attr.type === 'radio' || attr.type === 'checkbox') return;

            elm.unbind('input').unbind('keydown').unbind('change');

            //elm.bind("keydown keypress", function(event) {
            elm.bind("keydown", function(event) {
                if (event.which === 13) {
                    scope.$apply(function(){
                        scope.$eval(attr.ngModelOnblur);
                    });
                }
            });


        }
    };
});

tcmModule.directive('contentEditable', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            // view -> model
            elm.bind('blur', function() {
                scope.$apply(function() {
                    ctrl.$setViewValue(elm.html());
                });
            });

            // model -> view
            ctrl.$render = function() {
                elm.html(attrs.content);
            };

            // load init value from DOM
            //ctrl.$setViewValue(elm.html());
        }
    };
});