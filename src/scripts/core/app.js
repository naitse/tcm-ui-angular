'use strict';

var tcmControllers = angular.module('controllers',[]);
var tcmModule = angular.module('tcm', [
    'ui.router',
    'controllers'
]);

tcmModule.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/2/designer');

    $stateProvider
        .state('manager', {
            url:'/:pid',
            templateUrl:'/views/manager/manager.html',
            controller:'managerCtrl'
        })
        .state('manager.designer', {
            url:'/designer',
            templateUrl:'/views/designer/designer.html',
            controller:'designerCtrl'
        });

});


