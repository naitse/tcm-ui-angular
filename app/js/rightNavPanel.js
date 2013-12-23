tcmModule.directive('ngRightNavPanel', function() {
    return {
        restrict: 'E',
        transclude:false,
        scope:true,
        templateUrl: 'app/partials/rightnavpanel.html',
        controller: ["$scope", "$element", "$attrs", "$rootScope", 'tcm_model', '$q', function(scope, element, $attrs, $rootScope, tcm_model, $q){
            
            if(scope.containerType == 'sprint'){
                scope.$watch('sprintTestInactive', function(newVal, oldVal){
                    if(newVal == oldVal){
                        return false;
                    }
                    processTCcontainerState(newVal)
                })
            }else{
                scope.$watch('suiteTestInactive', function(newVal, oldVal){
                    processTCcontainerState(newVal)
                })
            }

            function processTCcontainerState(newVal){
                    if(newVal == true){
                        scope.temptcsHidden = angular.copy(scope.tcsHidden)
                        scope.temptagsTcsHidden = angular.copy(scope.tagsTcsHidden)
                        scope.tempsuiteTcsHidden = angular.copy(scope.suiteTcsHidden)
                        scope.tcsHidden = true
                        scope.tagsTcsHidden = true
                        scope.suiteTcsHidden = true
                    }else{
                        scope.tcsHidden = scope.temptcsHidden
                        scope.tagsTcsHidden = scope.temptagsTcsHidden
                        scope.suiteTcsHidden = scope.tempsuiteTcsHidden
                    }
            }

            var duration = 150
            scope.releases = [];
            scope.iterations = [];
            scope.features = [];
            scope.suites = [];
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

            scope.resetCsuiteR = function(){
                scope.currentRequesterSuite = {
                    id:'',
                    type:'',
                    object:{}
                }
            }

            scope.btnConfig = {hideBulk:true, hideStatus:true, hideDropdown:true};
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
                    type:'',
                    object:{}
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
                if(scope.releases.length !== 0){
                    return false;
                }
                var releases = tcm_model.Releases.query();
                scope.releases =  _.extend(releases, {hide:false})

            }

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
                
                $(element).find('#iterations').stop(true,true).animate({left:0},duration, function(){});
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
                $(element).find('#features').css('height','100%').stop(true,true).animate({left:0},duration, function(){});
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
                $(element).find('#testcases').stop(true,true).animate({left:0},duration, function(){
                    scope.tcsHidden = false
                });
            }
            
            scope.hideTests = function(){
                scope.hideFeature = false
                scope.resetCurrentRequester();
                $(element).find('#testcases').stop(true,true).animate({left:400},duration, function(){
                    scope.tcsHidden = true
                    scope.featBtnConfig.hideBar = false
                });
            }

            scope.backToReleases = function(){
                scope.resetRelease();
                scope.releases =[];
                scope.hideTests();
                scope.hideFeatures();
                scope.hideIterations()
                scope.loadSprint();
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

/////////////////////////SUITES


            scope.isEmpty = function(string){
             var result = /^\s*$/.test(string) || (string === null);
             return result;
            }

            $rootScope.$on('suiteAdded', function(event, message){
                if(typeof scope.currentRequesterSuite !== 'undefined' && scope.currentRequesterSuite.id != message.suite.id){
                    if(scope.suites.length > 0){
                        scope.suites.push(_.extend(angular.copy(message.suite), {hide:false}));
                    }
                }
              })

            $rootScope.$on('suiteRemoved', function(event, message){
                if(typeof scope.currentRequesterSuite !== 'undefined' && scope.currentRequesterSuite.id == message.suite.id){
                    scope.backToSuites()
                    return false;
                }
                scope.suites = _.without(scope.suites, _.findWhere(scope.suites, {id: message.suite.id}))
              })


            scope.loadSuites = function(){
                scope.sprintActiveClass = ''
                scope.suiteActiveClass = 'active'
                scope.tagActiveClass = ''
                if(scope.suites.length !== 0){
                    return false;
                }
                var suite = tcm_model.Suites.query();
                scope.suites =  _.extend(suite, {hide:false})
            }

            scope.getSuiteTestcases = function(suite){
                _.each(scope.suites,function(s){
                    s.active = false;
                })
                suite.active = true;
                scope.currentRequesterSuite = {
                     id:suite.id,
                     type:'suite',
                     object:suite
                };
                scope.hideSuitesContainer(suite);
                scope.showSuiteTests();
            }

            scope.showSuites = function(){
                scope.hideSuites = false
                scope.hideSuiteTests();
                $(element).find('#suites').stop(true,true).animate({left:0}, duration, function(){});
            }
            
            scope.hideSuitesContainer = function(suite){
                scope.hideSuites = true
                _.each(scope.suites, function(s){
                    s.hide = true
                })
                suite.hide = false
                // $(element).find('#suites').stop(true,true).animate({left:400},function(){
                // });
            }

            scope.suiteTcsHidden = false
            scope.showSuiteTests = function(){
                scope.hideSuites = true
                $(element).find('#suitetestcases').stop(true,true).animate({left:0},duration, function(){
                    scope.suiteTcsHidden = false
                });
            }
            
            scope.hideSuiteTests = function(){
                scope.hideSuites = false
                scope.resetCsuiteR();
                $(element).find('#suitetestcases').stop(true,true).animate({left:400},duration, function(){
                    scope.suiteTcsHidden = true
                });
            }

            scope.backToSuites = function(){
                scope.resetCsuiteR();
                scope.suites=[];
                scope.loadSuites();
                scope.hideSuiteTests();
                // scope.showSuites();
            }


/////////////////////////

            


            //////////////////////////TAGS

            scope.tagstringToFecthArray = [];
            scope.tagsToFecthArray = [];
            scope.tagInput =[];

            $rootScope.$on('tagCreated', function(event, message){
                var cTag = new tcm_model.Tags()
                cTag.name = message.tag.name
                cTag.id = message.tag.id
                cTag.hide = false;
                scope.tags.push(cTag)
            })

            scope.resetCurrentRequesterTags = function(){
                scope.currentRequesterTags.id = ''
                scope.currentRequesterTags.type = 'multitag'
                scope.currentRequesterTags.name = ''
                scope.currentRequesterTags.tagsArray = []
                scope.showTagTests();
            };

            scope.getTagInput = function(){
                var deferred = $q.defer();
                deferred.resolve(scope.tagInput)
                return deferred.promise;
            }

            scope.addTagToFetch = function(tag){
                scope.tagsToFecthArray.push(_.findWhere(scope.tags, {name:tag}))
                scope.setMultiTagReq();
            }

            scope.removeTagToFetch = function(tag){
                scope.tagsToFecthArray = _.without(scope.tagsToFecthArray, _.findWhere(scope.tagsToFecthArray, {name:tag}))
                scope.setMultiTagReq();
            }

            scope.setMultiTagReq = function(){
                scope.currentRequesterTags.id = Math.floor(Math.random()*9999)
                scope.currentRequesterTags.type = 'multitag'
                scope.currentRequesterTags.tagsArray = scope.tagsToFecthArray
            };

            scope.loadTags = function(){
                scope.setMultiTagReq()
                scope.tcsHidden = true
                scope.tagsTcsHidden = false
                scope.sprintActiveClass = ''
                scope.suiteActiveClass = ''
                scope.tagActiveClass = 'active'
                if(scope.tags.length !== 0){
                    return false;
                }
                tcm_model.Tags.query(function(res){
                    scope.tags = _.extend(res, {hide:false});
                    _.each(scope.tags, function(tag){
                        scope.tagInput.push(tag.name)
                    })
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
                scope.currentRequesterTags.name = tag.name
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
                $('.ng-right-nav-panel #tags').stop(true,true).animate({left:0},duration, function(){});
            }
            
            scope.hideTagsContainer = function(){
                scope.hideTags = true
                $(element).find('#tags').stop(true,true).animate({left:400},duration, function(){
                });
            }

            scope.tagsTcsHidden = false
            scope.showTagTests = function(){
                scope.hideTags = true
                $(element).find('#tagstestcases').stop(true,true).animate({left:0},duration, function(){
                    scope.tagsTcsHidden = false
                });
            }
            
            scope.hideTagTests = function(){
                scope.hideTags = false
                scope.resetCurrentRequesterTags();
                $(element).find('#tagstestcases').stop(true,true).animate({left:400},duration, function(){
                    scope.tagsTcsHidden = true
                });
            }

            scope.backToTags = function(){
                scope.tags = [];
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