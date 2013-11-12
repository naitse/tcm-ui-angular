tcmModule.directive('ngLeftNavPanel', function() {
    return {
        restrict: 'E',
        transclude:false,
        scope:true,
        templateUrl: 'app/partials/leftnavpanel.html',
        controller: ["$scope", "$element", "$attrs", "$rootScope", 'tcm_model', function(scope, element, $attrs, $rootScope, tcm_model){
            
            scope.releases = [];
            scope.iterations = [];
            scope.features = [];
            scope.btnConfig = {hideBulk:true, hideStatus:true};
            releaseSelected = {};
            var duration = 200

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
                scope.sprintActiveClass = 'active'
                scope.suiteActiveClass = ''
                var releases = tcm_model.Releases.query();
                scope.releases =  _.extend(releases, {hide:false})

            }

            scope.loadSprint();

            scope.loadSuites = function(){
                scope.sprintActiveClass = ''
                scope.suiteActiveClass = 'active'
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
                
                $('.ng-left-nav-panel #iterations').stop(true,true).animate({left:0}, duration, function(){});
            }
            scope.hideIterations = function(){
                  scope.iterations = [];
                  scope.$parent.resetCurrentRequester();  
                  scope.loadSprint();
                $('.ng-left-nav-panel #iterations').stop(true,true).animate({left:400}, duration, function(){
                    scope.$apply(function(){
                      scope.hideIteration = true
                      scope.resetRelease();
                      scope.back.state = false
                    });
                });
            }

            scope.showFeatures = function(){
                $('.ng-left-nav-panel #features').stop(true,true).animate({left:0}, duration, function(){});
            }

            scope.hideFeatures = function(){
                scope.hideIteration = false
                scope.features = [];
                scope.resetFeature();
                $('.ng-left-nav-panel #features').stop(true,true).animate({left:400}, duration, function(){
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
                scope.hideFeatures();
                scope.hideIterations()
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
                scope.$parent.currentRequester.id = feature.featureId
                scope.$parent.currentRequester.type = "feature"
                scope.$parent.currentRequester.object = feature
            }

            scope.resetCurrentRequester = function(){
                scope.$parent.currentRequester.id = ''
                scope.$parent.currentRequester.type = ""
                scope.$parent.currentRequester = {}
            }

        }],
        link: function(scope, elm, attr, ngModelCtrl) {
        }
    };
});