'use strict';

var tcmModule = angular.module('tcm', ["highcharts-ng", 'ngAnimate', 'ngRoute', 'ngCookies', 'ui.bootstrap', 'ngResource', 'ngTagsInput','pasvaz.bindonce']).
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
                                }).when('/metrics/plan/:projectId',
                                {templateUrl: '/app/partials/metrics_plan.html',
                                    controller: 'MetricsPlanCntl',
                                    access: access.user
                                }
                                ).when('/metrics/plan/:projectId/:iterationId',
                                    {templateUrl: '/app/partials/metrics_plan_hl.html',
                                        controller: 'MetricsPlanCntl',
                                        access: access.anon
                                    }
                                ).when('/metrics/release/:projectId',
                                    {templateUrl: '/app/partials/metrics_release.html',
                                        controller: 'MetricsReleaseCntl',
                                        access: access.user
                                    }
                                ).when('/metrics/release/:projectId/:releaseId',
                                    {templateUrl: '/app/partials/metrics_release_hl.html',
                                        controller: 'MetricsReleaseCntl',
                                        access: access.anon
                                    }
                                ).when('/metrics/iterations/:projectId',
                                    {templateUrl: '/app/partials/metrics_iteration.html',
                                        controller: 'MetricsIterationsCntl',
                                        access: access.anon
                                    }
                                ).when('/metrics/:projectId/sprint/:sprintId',
                                    {templateUrl: '/app/partials/metrics_sprint.html',
                                        controller: 'SprintReportCtrl',
                                        access: access.anon
                                    }
                                ).when('/reports/:projectId/sprint/:sprintId',
                                    {templateUrl: '/app/partials/reports/metrics_sprint.html',
                                        controller: 'ReportsSprintCtrl',
                                        access: access.anon
                                    }
                                ).when('/metrics/interop/:projectId',
                                    {templateUrl: '/app/partials/metrics_interop.html',
                                        controller: 'MetricsInteropCntl',
                                        access: access.user
                                    }
                                ).when('/metrics/interop/:projectId/:releaseId',
                                    {templateUrl: '/app/partials/metrics_interop_hl.html',
                                        controller: 'MetricsInteropCntl',
                                        access: access.anon
                                    }
                                ).when('/interop/:projectId/mailer',
                                    {templateUrl: '/app/partials/interop_report_mailer.html',
                                        controller: 'InteropReportMailer',
                                        access: access.mailer
                                    }//GeneratorCtrl
                                ).when('/automation/:projectId',
                                    {templateUrl: '/app/partials/automation.html',
                                        controller: 'GeneratorCtrl',
                                        access: access.user
                                    }
                                ).when('/login',
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

tcmModule.filter('trustAsResourceUrl', ['$sce', function($sce) {
    return function(val) {
        return $sce.trustAsResourceUrl(val);
    };
}]);

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

    $rootScope.draggedObjects = [];
    $rootScope.currentDragUUID = null;

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

tcmModule.directive('tcmDraggable', function($rootScope) {
    return{
    // transclude:true,
    controller: function(){

    },
    link: function(scope, element, attrs) {

            scope.$watch('draggable', function(val) {
                if (val == true) {
                    makeDraggable();
                    } else {
                    try{
                        $(element).draggable('destroy');
                    }catch(e){}
                }
            });
                
                function makeDraggable(){
                    $(element).draggable({
                        revert:function () {
                            scope.$apply(function(scope, attrs){
                                if ('undefined' !== typeof element.context.attributes.tcmDragRevert) {
                                  scope.$eval(element.context.attributes.tcmDragRevert.nodeValue);
                                }
                            });
                            return true;
                        },
                        handle: ".draggable-handle",
                        appendTo: 'html',
                        helper:function(){
                                return $('<div class="tcm-drag-helper"><span class="glyphicon glyphicon-file"></span></div>')
                        },
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
            }//function make draggable
            makeDraggable();
        }
    }
});

tcmModule.directive('tcmDroppable', function() {
    return{
    transclude:false,
    link: function(scope, element, attrs) {

            scope.$watch('droppable', function(val) {
                if (val == true) {
                    makeDroppable();
                    } else {
                    try{
                        $(element).droppable('destroy');
                    }catch(e){}
                }
            });

            function makeDroppable() {
                    $(element).droppable({
                        drop: function(evt, ui){
                            $(this).removeClass('draggable-over')
                            $(this).addClass('draggable-dropped')
                            // $(this).animate({
                            //     boxShadow: '0px 0px 11px -2px green'
                            // })
                            var that = this;
                            scope.$apply(function(scope, attrs){
                                var ble = setTimeout(function(){$(that).removeClass('draggable-dropped')},500)
                                if ('undefined' !== typeof element.context.attributes.tcmDrop) {
                                  scope.$eval(element.context.attributes.tcmDrop.nodeValue);
                                }
                            });
                        },
                        over: function(evt, ui){
                            $(this).addClass('draggable-over')
                            scope.$apply(function(scope, attrs){
                                if ('undefined' !== typeof element.context.attributes.tcmDropOver) {
                                  scope.$eval(element.context.attributes.tcmDropOver.nodeValue);
                                }
                            });
                        },
                        out: function(evt, ui){
                            $(this).removeClass('draggable-over')
                            scope.$apply(function(scope, attrs){
                                if ('undefined' !== typeof element.context.attributes.tcmDropOut) {
                                  scope.$eval(element.context.attributes.tcmDropOut.nodeValue);
                                }
                            });
                        }
                    })
            };
        }
    }
});


tcmModule.directive('tcmSuiteDraggable', function($rootScope) {
    return{
    // transclude:true,
    controller: function(){

    },
    link: function(scope, element, attrs) {
                
                    $(element).draggable({
                        revert:function () {
                            scope.$apply(function(scope, attrs){
                                if ('undefined' !== typeof element.context.attributes.tcmSuiteDragRevert) {
                                  scope.$eval(element.context.attributes.tcmSuiteDragRevert.nodeValue);
                                }
                            });
                            return true;
                        },
                        appendTo: 'html',
                        helper:'clone',
                        cursorAt: { left: 30 },
                        cursor: "pointer",
                        drag: function(evt, ui){
                            scope.$apply(function(scope, attrs){
                                if ('undefined' !== typeof element.context.attributes.tcmSuiteDrag) {
                                  scope.$eval(element.context.attributes.tcmSuiteDrag.nodeValue);
                                }
                            });
                        },
                        start: function(evt, ui){
                            scope.$apply(function(scope, attrs){
                                if ('undefined' !== typeof element.context.attributes.tcmSuiteDragStart) {
                                  scope.$eval(element.context.attributes.tcmSuiteDragStart.nodeValue);
                                }
                            });
                        },
                        stop: function(evt, ui){
                            scope.$apply(function(scope, attrs){
                                if ('undefined' !== typeof element.context.attributes.tcmSuiteDragStop) {
                                  scope.$eval(element.context.attributes.tcmSuiteDragStop.nodeValue);
                                }
                            });
                        }
                    })
        }
    }
});

tcmModule.directive('tcmSuiteDroppable', function() {
    return{
    transclude:false,
    link: function(scope, element, attrs) {

            scope.$watch('suiteDroppable', function(val) {
                if (val == true) {
                    makeDroppable();
                    } else {
                    try{
                        $(element).droppable('destroy');
                    }catch(e){}
                }
            });

            function makeDroppable() {
                    $(element).droppable({
                        drop: function(evt, ui){
                            $(this).removeClass('draggable-over')
                            $(this).addClass('draggable-dropped')
                            ui.helper.remove();
                            var that = this;
                            scope.$apply(function(scope, attrs){
                                var ble = setTimeout(function(){$(that).removeClass('draggable-dropped')},500)
                                if ('undefined' !== typeof element.context.attributes.tcmSuiteDrop) {
                                  scope.$eval(element.context.attributes.tcmSuiteDrop.nodeValue);
                                }
                            });
                        },
                        over: function(evt, ui){
                            $(this).addClass('draggable-over')
                            scope.$apply(function(scope, attrs){
                                if ('undefined' !== typeof element.context.attributes.tcmSuiteDropOver) {
                                  scope.$eval(element.context.attributes.tcmSuiteDropOver.nodeValue);
                                }
                            });
                        },
                        out: function(evt, ui){
                            $(this).removeClass('draggable-over')
                            scope.$apply(function(scope, attrs){
                                if ('undefined' !== typeof element.context.attributes.tcmSuiteDropOut) {
                                  scope.$eval(element.context.attributes.tcmSuiteDropOut.nodeValue);
                                }
                            });
                        }
                    })
            };
        }
    }
});

tcmModule.directive('ngEnter', function() {
        return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                scope.$apply(function(){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
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




