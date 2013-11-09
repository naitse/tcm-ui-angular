tcmModule.directive('ngRightNavPanel', function() {
    return {
        restrict: 'E',
        transclude:false,
        scope:true,
        templateUrl: 'app/partials/rightnavpanel.html',
        controller: ["$scope", "$element", "$attrs", "$rootScope", 'tcm_model', function(scope, element, $attrs, $rootScope, tcm_model){
            
            scope.releases = [];
            scope.iterations = [];
            scope.features = [];

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


            scope.resetCurrentRequester = function(){
                scope.currentRequester = {
                    id:'none',
                    type:''
                };
            }

            scope.resetCurrentRequester();


            scope.back = {
                state:false,
                last:''
            }

            scope.loadSprint = function(){
                scope.sprintActiveClass = 'active'
                scope.suiteActiveClass = ''

                scope.releases =  tcm_model.Releases.query();

            }

            scope.getIterations = function(release){
                scope.release = release;
                tcm_model.Iterations.query({releaseId: scope.release.id}).$promise.then(function(data){
                    scope.iterations = data;
                    scope.showIterations();
                    scope.back.state = true;
                    scope.back.last = scope.hideIterations;
                })
            }

            scope.getFeatures = function(iteration){
                scope.iteration = iteration
                tcm_model.Features.query({iterationId:scope.iteration.IterId}, function(data){
                    scope.features = data;
                    scope.showFeatures();
                    scope.back.last = scope.hideFeatures;
                    // $scope.extendFeatures()
                })
            }

            scope.getTests = function(feature){
                scope.currentRequester.id = feature.featureId
                scope.currentRequester.type = "feature"
                scope.showTests();
                scope.back.last = scope.hideTests;
            }

            scope.loadSuites = function(){
                scope.sprintActiveClass = ''
                scope.suiteActiveClass = 'active'
            }


            scope.showIterations = function(){
                scope.hideIteration = false
                $('#iterations').stop(true,true).animate({left:0},function(){
                    scope.$apply(function(){
                        scope.hideRelease = false
                    })
                });
            }
            scope.hideIterations = function(){
                  scope.hideRelease = false  
                $('#iterations').stop(true,true).animate({left:400},function(){
                    scope.$apply(function(){
                      scope.hideIteration = true
                      scope.resetRelease();
                      scope.back.state = false
                    });
                });
            }

            scope.showFeatures = function(){
                scope.hideFeature = false
                $('#features').stop(true,true).animate({left:0},function(){
                    scope.$apply(function(){
                        scope.hideIteration = true
                    })
                });
            }

            scope.hideFeatures = function(){
                scope.hideIteration = false
                $('#features').stop(true,true).animate({left:400},function(){
                    scope.$apply(function(){
                            scope.hideFeature = true
                            scope.resetIteration();
                            scope.back.last = scope.hideIterations;
                        }
                    );
                });
            }

            scope.showTests = function(){
                scope.hideTest = false
                $('#testcases').stop(true,true).animate({left:0},function(){
                    scope.$apply(function(){
                        scope.hideFeature = true
                    })
                });
            }
            
            scope.hideTests = function(){
                scope.hideFeature = false
                $('#testcases').stop(true,true).animate({left:400},function(){
                    scope.$apply(function(){
                            scope.hideTest = true
                            // scope.resetIteration();
                            scope.back.last = scope.hideFeatures;
                        }
                    );
                });
            }
        }],
        link: function(scope, elm, attr, ngModelCtrl) {
        }
    };
});