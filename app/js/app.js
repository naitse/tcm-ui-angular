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
                                }).when('/jira/:projectId',
                                {templateUrl: '/app/partials/jira_sync.html',
                                    controller: 'JiraPluginCntl',
                                    access: access.user
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
/*
To add the disabled attribute on an element
*/
tcmModule.directive('ngDisabled', function() {
    return function(scope, element, attrs) {
        var expr = attrs.readonly;
        scope.$watch(expr, function(val) {
            if (val == true) {
                element.attr('disabled', 'disabled');
            } else {
                element.removeAttr('disabled');
            }
        });
    };
});

tcmModule.directive('tcmDraggable', function() {
    return{
    transclude:false,
    link: function(scope, element, attrs) {

            var draggable = attrs.drag;

            scope.$watch(draggable, function(val) {
                if (val == true) {
                    $(element).draggable({
                        revert:true,
                        helper:'clone',
                        drag: function(evt, ui){
                            scope.$apply(function(scope, attrs){
                                if ('undefined' !== typeof element.context.attributes.tcmDrag) {
                                  scope.$eval(element.context.attributes.tcmDrag.nodeValue);
                                }
                            });
                        },
                        start: function(evt, ui){
                            scope.$apply(function(scope, attrs){
                                if ('undefined' !== typeof element.context.attributes.tcmDragStart) {
                                  scope.$eval(element.context.attributes.tcmDragStart.nodeValue);
                                }
                            });
                        },
                        stop: function(evt, ui){
                            scope.$apply(function(scope, attrs){
                                if ('undefined' !== typeof element.context.attributes.tcmDragStop) {
                                  scope.$eval(element.context.attributes.tcmDragStop.nodeValue);
                                }
                            });
                        }
                    })
                } else {
                    $(element).draggable('disable')
                }
            });
        }
    }
});

tcmModule.directive('tcmDroppable', function() {
    return{
    transclude:false,
    link: function(scope, element, attrs) {

            var draggable = attrs.drop;

            scope.$watch(draggable, function(val) {
                if (val == true) {
                    $(element).droppable({
                        drop: function(evt, ui){
                            scope.$apply(function(scope, attrs){
                                if ('undefined' !== typeof element.context.attributes.tcmDrop) {
                                  scope.$eval(element.context.attributes.tcmDrop.nodeValue);
                                }
                            });
                        },
                        over: function(evt, ui){
                            scope.$apply(function(scope, attrs){
                                if ('undefined' !== typeof element.context.attributes.tcmDragStart) {
                                  scope.$eval(element.context.attributes.tcmDropOver.nodeValue);
                                }
                            });
                        },
                        out: function(evt, ui){
                            scope.$apply(function(scope, attrs){
                                if ('undefined' !== typeof element.context.attributes.tcmDragStop) {
                                  scope.$eval(element.context.attributes.tcmDropOut.nodeValue);
                                }
                            });
                        }
                    })
                } else {
                    $(element).droppable('disable')
                }
            });
        }
    }
});

/*
To autoresize textareas
*/
tcmModule.directive('textarea', function() {
    return {
        restrict: 'E',
        link: function( scope , element , attributes ) {

            var threshold    = 15,
                minHeight    = element[0].offsetHeight,
                paddingLeft  = element.css('paddingLeft'),
                paddingTop  = element.css('paddingTop'),
                paddingBottom  = element.css('paddingBottom'),
                paddingRight = element.css('paddingRight');

            var $shadow = angular.element('<div></div>').css({
                position:   'absolute',
                top:        -10000,
                left:       -10000,
                width:      element[0].offsetWidth - parseInt(paddingLeft || 0) - parseInt(paddingRight || 0),
                fontSize:   element.css('fontSize'),
                fontFamily: element.css('fontFamily'),
                lineHeight: element.css('lineHeight'),
                resize:     'none'
            });

            angular.element( document.body ).append( $shadow );

            var update = function() {

                var times = function(string, number) {
                    for (var i = 0, r = ''; i < number; i++) {
                        r += string;
                    }
                    return r;
                }

                var val = element.val().trim().replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/&/g, '&amp;')
                    .replace(/\n$/, '<br/>&nbsp;')
                    .replace(/\n/g, '<br/>')
                    .replace(/\s{2,}/g, function( space ) {
                        return times('&nbsp;', space.length - 1) + ' ';
                    });

                $shadow.html( val );

                var paddingTB = parseInt(paddingTop || 0) + parseInt(paddingBottom || 0)

                element.css( 'height' , Math.max( $shadow[0].offsetHeight + threshold, minHeight) );
            }

            scope.$on('$destroy', function() {
                $shadow.remove();
            });

            element.bind( 'keyup keydown keypress change' , update );
            update();
        }
    }
});