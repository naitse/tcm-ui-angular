tcmModule.directive('tcmSprintModule', function() {
    return {
        restrict: 'E',
        transclude:false,
        scope:true,
        templateUrl: 'app/partials/sprintsmodule.html',
        controller: ["$scope", "$element", "$attrs", "$rootScope", 'tcm_model', '$timeout', function(scope, element, $attrs, $rootScope, tcm_model,$timeout){
            
            scope.releases = [];
            scope.iterations = [];
            scope.features = [];
            scope.btnConfig = {hideBulk:true, hideStatus:true};
            releaseSelected = {};
            scope.loading = false;
            scope.containerType = 'sprint'
            var duration = 200

            $("#accordion").collapse()

            scope.resetCurrentRequester = function(){
             scope.currentRequester = {
                 id:'',
                 type:'',
                 object:{}
             };
            }

            scope.resetCurrentRequester();

            scope.isEmpty = function(string){
             var result = /^\s*$/.test(string) || (string === null);
             return result;
            }

            scope.resetRelease = function(){
                scope.release = {
                    releaseName:'',
                    id:''
                }
            }

            scope.resetRelease();

            scope.resetIteration = function(){
                scope.iteration = {
                    iterationName:''
                }
            }

            scope.resetIteration();

            scope.resetFeature = function(){
                scope.feature = {
                    featureName:''
                }
            }

            scope.resetFeature();

            scope.back = {
                state:false,
                last:''
            }

            scope.loadSprint = function(){
                scope.loading = true;
                scope.sprintActiveClass = 'active'
                scope.suiteActiveClass = ''
                var releases = tcm_model.Releases.query(function(){
                    scope.loading = false;
                });
                scope.releases =  _.extend(releases, {hide:false})
            }

            scope.loadSprint();

/////////////////////////

            scope.getIterations = function(release){
                scope.release = release;
                _.each(scope.releases, function(rel){
                        rel.hide = true;
                })
                scope.loading = true;
                tcm_model.Iterations.query({releaseId: scope.release.id}).$promise.then(function(data){
                    scope.loading = false;
                    scope.iterations = _.extend(data, {hide:false});
                    scope.showIterations();
                    scope.back.state = true;
                    scope.back.last = scope.hideIterations;
                })
            }

            scope.getFeatures = function(iteration){
                scope.loading = true;
                iteration.callback = function(){
                    scope.showFeatures();
                    scope.loading = false;
                }
                scope.iteration = iteration
                // scope.$parent.iteration = scope.iteration

               _.each(scope.iterations, function(iter){
                        iter.hide = true;
                })

               // scope.showFeatures();
            }

            scope.showIterations = function(){
                
                $('#tcm-sprint-module .lsprint-container #iterations').stop(true,true).animate({left:0}, duration, function(){});
            }
            scope.hideIterations = function(){
                  scope.iterations = [];
                  scope.resetIteration();
                  scope.resetCurrentRequester();  
                  scope.loadSprint();
                $('#tcm-sprint-module .lsprint-container #iterations').stop(true,true).animate({left:400}, duration, function(){
                    scope.$apply(function(){
                      scope.hideIteration = true
                      scope.resetRelease();
                      scope.back.state = false
                    });
                });
            }

            scope.showFeatures = function(){
                $('#tcm-sprint-module .lsprint-container #features').stop(true,true).animate({left:0}, duration, function(){});
            }

            scope.hideFeatures = function(){
                scope.hideIteration = false
                scope.features = [];
                scope.resetFeature();
                $('#tcm-sprint-module .lsprint-container #features').stop(true,true).animate({left:400}, duration, function(){
                    scope.$apply(function(){
                            scope.hideFeature = true
                            scope.resetIteration();
                            scope.back.last = scope.hideIterations;
                        }
                    );
                });
            }

            scope.backToReleases = function(){
                scope.resetCurrentRequester();
                scope.resetRelease();
                scope.loadSprint();
                scope.hideFeatures();
                scope.hideIterations();
            }
            scope.backToIterations = function(){
                scope.resetCurrentRequester();
                scope.resetIteration();
                scope.getIterations(scope.release)
                scope.hideFeatures();
            }

            scope.backToFeatures = function(){
                scope.getFeatures(scope.iteration)
            }

            scope.setCurrentRequester = function(feature){
                scope.currentRequester.id = feature.featureId
                scope.currentRequester.type = "feature"
                scope.currentRequester.object = feature
            }

            scope.resetCurrentRequester = function(){
                scope.currentRequester.id = ''
                scope.currentRequester.type = ""
                scope.currentRequester.object = {}
            }

/////////////////////////

            scope.showRight = false;
            scope.toggleIcon = (scope.showRight == true)?'right':'left';
            scope.panelExpanderRight = (scope.showRight == true)?334:0;

            scope.togglePanel = function(){
                scope.showRight = !scope.showRight
                scope.toggleIcon = (scope.showRight == true)?'right':'left';
                scope.panelExpanderRight = (scope.showRight == true)?334:0;
            }

            scope.middleWidth = {
                width: 1350 - 325
            };


            // scope.getWidth = function() {
            //     return 1350;
            // };

            // scope.$watch(scope.getWidth, function(newValue, oldValue) {
            //     newWidth = (scope.showRight == false)? newValue - 325: newValue - 661;
            //     scope.middleWidth = {
            //         width: newWidth
            //     };
            // });

            scope.$watch('showRight', function(value, old){
                if(value == old){
                    return false;
                }

                newWidth = (scope.showRight == false)? 1350 - 325: 1350 - 661;

                scope.middleWidth = {
                    width: newWidth
                };

            })

            // window.onresize = function(){
            //     scope.$apply();
            // }

        }],
        link: function(scope, elm, attr, ngModelCtrl) {
        }
    };
});