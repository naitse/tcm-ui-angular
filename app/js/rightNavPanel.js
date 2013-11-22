tcmModule.directive('ngRightNavPanel', function() {
    return {
        restrict: 'E',
        transclude:false,
        scope:true,
        templateUrl: 'app/partials/rightnavpanel.html',
        controller: ["$scope", "$element", "$attrs", "$rootScope", 'tcm_model', function(scope, element, $attrs, $rootScope, tcm_model){
            

            var duration = 200
            scope.releases = [];
            scope.iterations = [];
            scope.features = [];
            scope.tags = [];
            scope.featBtnConfig = {hideBar:true, hideFeatureActions:true}
            scope.currentRequester = {
                id:'',
                type:''
            }
            scope.currentRequesterTags = {
                id:'',
                type:''
            }
            scope.btnConfig = {hideBulk:true, hideStatus:true};
            releaseSelected = {};

            scope.resetRelease = function(){
                scope.release = {
                    releaseName:'',
                    id:''
                }
            }

            scope.resetRelease();

            scope.resetIteration = function(){
                scope.iteration = {
                    iterationName:'',
                    IterId:''
                }
            }

            scope.resetIteration();

            scope.resetFeature = function(){
                scope.feature = {
                    featureName:''
                }
            }

            scope.resetFeature();


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
                scope.tagActiveClass = ''
                var releases = tcm_model.Releases.query();
                scope.releases =  _.extend(releases, {hide:false})

            }

            scope.loadSuites = function(){
                scope.sprintActiveClass = ''
                scope.suiteActiveClass = 'active'
                scope.tagActiveClass = ''
            }



/////////////////////////

            scope.getIterations = function(release){
                scope.release = release;
                _.each(scope.releases, function(rel){
                    if(rel.id != release.id){
                        rel.hide = true;
                    }
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
                var clone = angular.copy(iteration)
                try{scope.$apply(scope.iteration.IterId = 'none')}catch(e){}
                scope.iteration = clone
               _.each(scope.iterations, function(iter){
                    if(iter.IterId != iteration.IterId){
                        iter.hide = true;
                    }
                })
            }

            scope.setCurrentRequester = function(feature){
                scope.getTests(feature)
            }

            scope.getTests = function(feature){
                scope.feature = feature;
               _.each(scope.features, function(feat){
                    if(feat.featureId != feature.featureId){
                        feat.hide = true;
                    }
                })
                scope.currentRequester.id = feature.featureId
                scope.currentRequester.type = "feature"
                scope.showTests();
                scope.back.last = scope.hideTests;
            }

            scope.showIterations = function(){
                
                $('.ng-right-nav-panel #iterations').stop(true,true).animate({left:0},function(){});
            }
            scope.hideIterations = function(){
                  scope.iterations = [];
                  scope.loadSprint();
                $('.ng-right-nav-panel #iterations').stop(true,true).animate({left:400}, duration, function(){
                    scope.$apply(function(){
                      scope.hideIteration = true
                      scope.resetRelease();
                      scope.back.state = false
                    });
                });
            }

            scope.showFeatures = function(){
                $('.ng-right-nav-panel #features').css('height','100%').stop(true,true).animate({left:0},function(){});
            }

            scope.hideFeatures = function(){
                scope.hideIteration = false
                scope.features = [];
                scope.resetFeature();
                $('.ng-right-nav-panel #features').css('height','94px').stop(true,true).animate({left:400}, duration, function(){
                    scope.$apply(function(){
                            scope.hideFeature = true
                            scope.resetIteration();
                            scope.back.last = scope.hideIterations;
                        }
                    );
                });
            }

            scope.showTests = function(){
                $('.ng-right-nav-panel #testcases').stop(true,true).animate({left:0},function(){});
            }
            
            scope.hideTests = function(){
                scope.hideFeature = false
                scope.resetCurrentRequester();
                $('.ng-right-nav-panel #testcases').stop(true,true).animate({left:400},function(){
                    // scope.$apply(function(){
                    //         scope.hideTest = true
                    //         // scope.resetIteration();
                    //         scope.back.last = scope.hideFeatures;
                    //     }
                    // );
                });
            }

            scope.backToReleases = function(){
                scope.resetRelease();
                scope.hideTests();
                scope.hideFeatures();
                scope.hideIterations()
            }

            scope.backToIterations = function(){
                scope.resetIteration();
                scope.getIterations(scope.release)
                scope.hideTests();
                scope.hideFeatures();
            }

            scope.backToFeatures = function(){
                scope.hideTests()
                scope.getFeatures(scope.iteration)
            }


            //////////////////////////TAGS


            scope.resetCurrentRequesterTags = function(){
                scope.currentRequesterTags.id = ''
                scope.currentRequesterTags.type = 'tag'
            };

            scope.loadTags = function(){
                scope.sprintActiveClass = ''
                scope.suiteActiveClass = ''
                scope.tagActiveClass = 'active'
                tcm_model.Tags.query(function(res){
                    scope.tags = _.extend(res, {hide:false});
                })
            }

            scope.loadTagTc = function(tag){
                scope.currentRequesterTags.id = tag.id
                scope.currentRequesterTags.type = 'tag'
                 _.each(scope.tags, function(tagEl){
                    if(tagEl.id != tag.id){
                        tagEl.hide = true;
                    }
                })
                scope.showTagTests();
            }

            scope.showTags = function(){
                scope.hideTags = false
                scope.hideTagTests();
                $('.ng-right-nav-panel #tags').stop(true,true).animate({left:0},function(){});
            }
            
            scope.hideTagsContainer = function(){
                scope.hideTags = true
                console.log('hidetags')
                $('.ng-right-nav-panel #tags').stop(true,true).animate({left:400},function(){
                });
            }


            scope.showTagTests = function(){
                scope.hideTags = true
                $('.ng-right-nav-panel #tagstestcases').stop(true,true).animate({left:0},function(){});
            }
            
            scope.hideTagTests = function(){
                scope.hideTags = false
                scope.resetCurrentRequesterTags();
                $('.ng-right-nav-panel #tagstestcases').stop(true,true).animate({left:400},function(){
                    // scope.$apply(function(){
                    //         scope.hideTest = true
                    //         // scope.resetIteration();
                    //         scope.back.last = scope.hideFeatures;
                    //     }
                    // );
                });
            }

            scope.backToTags = function(){
                scope.resetCurrentRequesterTags();
                scope.hideTagTests();
                scope.loadTags();
                scope.showTags();
            }



        }],
        link: function(scope, elm, attr, ngModelCtrl) {
        }
    };
});