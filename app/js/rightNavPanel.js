tcmModule.directive('ngRightNavPanel', function() {
    return {
        restrict: 'E',
        transclude:false,
        scope:true,
        templateUrl: 'app/partials/rightnavpanel.html',
        controller: ["$scope", "$element", "$attrs", "$rootScope", 'tcm_model', function(scope, element, $attrs, $rootScope, tcm_model){
            
            if(scope.containerType == 'sprint'){
                scope.$watch('sprintTestInactive', function(newVal, oldVal){
                    if(newVal == oldVal){
                        return false;
                    }

                    if(newVal == true){
                        scope.temptcsHidden = angular.copy(scope.tcsHidden)
                        scope.temptagsTcsHidden = angular.copy(scope.tagsTcsHidden)
                        scope.tcsHidden = true
                        scope.tagsTcsHidden = true
                    }else{
                        scope.tcsHidden = scope.temptcsHidden
                        scope.tagsTcsHidden = scope.temptagsTcsHidden
                    }

                })
            }else{
                scope.$watch('suiteTestInactive', function(newVal, oldVal){
                    if(newVal == oldVal){
                        return false;
                    }

                    if(newVal == true){
                        scope.temptcsHidden = angular.copy(scope.tcsHidden)
                        scope.temptagsTcsHidden = angular.copy(scope.tagsTcsHidden)
                        scope.tcsHidden = true
                        scope.tagsTcsHidden = true
                    }else{
                         scope.tcsHidden = scope.temptcsHidden
                        scope.tagsTcsHidden = scope.temptagsTcsHidden
                    }
                })
            }

            var duration = 200
            scope.releases = [];
            scope.iterations = [];
            scope.features = [];
            scope.tags = [];
            scope.featBtnConfig = {hideBar:false, hideFeatureActions:true, hideBtns:true, hideSearch:false}
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
                scope.tcsHidden = false
                scope.tagsTcsHidden = true
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
                
                $(element).find('#iterations').stop(true,true).animate({left:0},function(){});
            }
            scope.hideIterations = function(){
                  scope.iterations = [];
                  scope.loadSprint();
                $(element).find('#iterations').stop(true,true).animate({left:400}, duration, function(){
                    scope.$apply(function(){
                      scope.hideIteration = true
                      scope.resetRelease();
                      scope.back.state = false
                    });
                });
            }

            scope.showFeatures = function(){
                $(element).find('#features').css('height','100%').stop(true,true).animate({left:0},function(){});
            }

            scope.hideFeatures = function(){
                scope.hideIteration = false
                scope.features = [];
                scope.resetFeature();
                $(element).find('#features').css('height','94px').stop(true,true).animate({left:400}, duration, function(){
                    scope.$apply(function(){
                            scope.hideFeature = true
                            scope.resetIteration();
                            scope.back.last = scope.hideIterations;
                        }
                    );
                });
            }

            scope.tcsHidden = false
            scope.showTests = function(){
                scope.featBtnConfig.hideBar = true
                $(element).find('#testcases').stop(true,true).animate({left:0},function(){
                    scope.tcsHidden = false
                });
            }
            
            scope.hideTests = function(){
                scope.hideFeature = false
                scope.resetCurrentRequester();
                $(element).find('#testcases').stop(true,true).animate({left:400},function(){
                    scope.tcsHidden = true
                    scope.featBtnConfig.hideBar = false
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


            $rootScope.$on('tagCreated', function(event, message){
                var cTag = new tcm_model.Tags()
                cTag.name = message.tag.name
                cTag.id = message.tag.id
                cTag.hide = false;
                scope.tags.push(cTag)
            })

            scope.resetCurrentRequesterTags = function(){
                scope.currentRequesterTags.id = ''
                scope.currentRequesterTags.type = 'tag'
            };

            scope.loadTags = function(){
                scope.tcsHidden = true
                scope.tagsTcsHidden = false
                scope.sprintActiveClass = ''
                scope.suiteActiveClass = ''
                scope.tagActiveClass = 'active'
                tcm_model.Tags.query(function(res){
                    scope.tags = _.extend(res, {hide:false});
                })
            }

            scope.deleteTag = function(tag, deleteText){

                deleteText = 'Bye!'

                var tagId = angular.copy(tag.id);

                tag.$delete({tid:tag.id}, function(){
                    scope.tags = _.without(scope.tags, _.findWhere(scope.tags,{id:tagId}))
                    $rootScope.$broadcast('tagDeleted', {tagId: tagId});
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
                $(element).find('#tags').stop(true,true).animate({left:400},function(){
                });
            }

            scope.tagsTcsHidden = false
            scope.showTagTests = function(){
                scope.hideTags = true
                $(element).find('#tagstestcases').stop(true,true).animate({left:0},function(){
                    scope.tagsTcsHidden = false
                });
            }
            
            scope.hideTagTests = function(){
                scope.hideTags = false
                scope.resetCurrentRequesterTags();
                $(element).find('#tagstestcases').stop(true,true).animate({left:400},function(){
                    scope.tagsTcsHidden = true
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