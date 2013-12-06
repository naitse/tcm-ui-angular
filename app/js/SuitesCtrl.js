tcmModule.directive('tcmSuitesModule', function() {
    return {
        restrict: 'E',
        transclude:false,
        scope:true,
        templateUrl: 'app/partials/suitesmodule.html',
        controller: ["$scope", "$element", "$attrs", "$rootScope", 'tcm_model', function(scope, element, $attrs, $rootScope, tcm_model){
            
            scope.suites = [];
            scope.iterations = [];
            scope.features = [];
            scope.btnConfig = {hideDropdown:true};
            releaseSelected = {};
            scope.containerType = 'suites'
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

            scope.loadSuites = function(){
                scope.sprintActiveClass = 'active'
                scope.suiteActiveClass = ''
                var suite = tcm_model.Suites.query();
                scope.suites =  _.extend(suite, {hide:false})
            }

            scope.loadSuites();


            scope.getSuiteTestcases = function(suite){
                console.log(suite)
                scope.currentRequester = {
                     id:suite.id,
                     type:'suite',
                     object:suite
                };
            }

/////////////////////////

            scope.getIterations = function(release){
                scope.release = release;
                _.each(scope.releases, function(rel){
                        rel.hide = true;
                })

                tcm_model.Iterations.query({releaseId: scope.release.id}).$promise.then(function(data){
                    scope.iterations = _.extend(data, {hide:false});
                    scope.showIterations();
                    scope.back.state = true;
                    scope.back.last = scope.hideIterations;
                })
            }

            scope.getFeatures = function(iteration){
                iteration.callback = function(){
                    scope.showFeatures();
                }
                scope.iteration = iteration
                // scope.$parent.iteration = scope.iteration

               _.each(scope.iterations, function(iter){
                        iter.hide = true;
                })

               // scope.showFeatures();
            }

            scope.showIterations = function(){
                
                $('#tcm-suites-module .lsprint-container #iterations').stop(true,true).animate({left:0}, duration, function(){});
            }
            scope.hideIterations = function(){
                  scope.iterations = [];
                  scope.resetIteration();
                  scope.resetCurrentRequester();  
                  scope.loadSprint();
                $('#tcm-suites-module .lsprint-container #iterations').stop(true,true).animate({left:400}, duration, function(){
                    scope.$apply(function(){
                      scope.hideIteration = true
                      scope.resetRelease();
                      scope.back.state = false
                    });
                });
            }

            scope.showFeatures = function(){
                $('#tcm-suites-module .lsprint-container #features').stop(true,true).animate({left:0}, duration, function(){});
            }

            scope.hideFeatures = function(){
                scope.hideIteration = false
                scope.features = [];
                scope.resetFeature();
                $('#tcm-suites-module .lsprint-container #features').stop(true,true).animate({left:400}, duration, function(){
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

            scope.showRight = true;
            scope.toggleIcon = (scope.showRight == true)?'right':'left';
            scope.panelExpanderRight = (scope.showRight == true)?334:0;

            scope.togglePanel = function(){
                scope.showRight = !scope.showRight
                scope.toggleIcon = (scope.showRight == true)?'right':'left';
                scope.panelExpanderRight = (scope.showRight == true)?334:0;
            }

            scope.middleWidth = {
                width: window.innerWidth - 325
            };


            scope.getWidth = function() {
                return window.innerWidth;
            };

            scope.$watch(scope.getWidth, function(newValue, oldValue) {
                newWidth = (scope.showRight == false)? newValue - 325: newValue - 661;
                scope.middleWidth = {
                    width: newWidth
                };
            });

            scope.$watch('showRight', function(value, old){
                if(value == old){
                    return false;
                }

                newWidth = (scope.showRight == false)? scope.getWidth() - 325: scope.getWidth() - 661;

                scope.middleWidth = {
                    width: newWidth
                };
                scope.$apply();

            })

            window.onresize = function(){
                scope.$apply();
            }

        }],
        link: function(scope, elm, attr, ngModelCtrl) {
        }
    };
});