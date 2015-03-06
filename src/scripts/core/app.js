'use strict';

var tcmModule = angular.module('tcm', ['ngRoute']).
    config(['$routeProvider',
        function($routeProvider ) {

            $routeProvider.when('/',
                {templateUrl: '/views/manager/manager.html',
                    controller: 'managerCtrl'
                }).otherwise({redirectTo:'/'});

    }]);




