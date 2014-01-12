tcmModule.directive('ngRightNavPanel', function() {
    return {
        restrict: 'E',
        transclude:false,
        scope:true,
        templateUrl: 'app/partials/rightnavpanel.html',
        controller: ["$scope", "$element", "$attrs", "$rootScope", 'tcm_model', '$q','draggedObjects', function(scope, element, $attrs, $rootScope, tcm_model, $q, DO){
            
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
            scope.loading = false;
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
                scope.loading = true;
                scope.tcsHidden = false
                scope.tagsTcsHidden = true
                scope.sprintActiveClass = 'active'
                scope.suiteActiveClass = ''
                scope.tagActiveClass = ''
                if(scope.releases.length !== 0){
                    scope.loading = false;
                    return false;
                }
                var releases = tcm_model.Releases.query(function(){
                    scope.loading = false;
                });
                scope.releases =  _.extend(releases, {hide:false})

            }

            scope.getIterations = function(release){
                scope.loading = true;
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
                    scope.loading = false;
                })
            }

            scope.getFeatures = function(iteration){
                scope.loading = true;
                iteration.callback = function(){
                    scope.showFeatures();
                    scope.loading = false;
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
                var suite = tcm_model.Suites.query(function(){
                    scope.loading = false;
                    scope.suites =  _.extend(suite, {hide:false})
                });
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

            scope.uuid = Math.floor(Math.random()*10000001);

            scope.draggedSuites = {
              id: scope.uuid,
              link: false, 
              objects:[],
              sc:scope,
              type:'suite'
            }

            DO.draggedObjects.push(scope.draggedSuites)

            scope.handleSuiteDragStart = function(suite){
                
                $rootScope.$broadcast('suiteDragStart', {suite: suite});

              _.each(DO.draggedObjects, function(objectArray){
                if(objectArray.id == scope.uuid){
                  objectArray.objects = [_.extend(suite, {dragSingle:true})]
                }
              })
              DO.currentDragUUID = scope.uuid
            }

            scope.handleSuiteDragRevert = function(suite){
                $rootScope.$broadcast('suiteDragRevert', {suite: suite});
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

            scope.getTagInputDeferred = null;

            scope.getTagInput = function(){

                if(scope.getTagInputDeferred){scope.getTagInputDeferred.resolve([])}

                scope.getTagInputDeferred = $q.defer();

                scope.tagInput = [];
                scope.tags =[];

                tcm_model.Tags.query(function(res){
                    scope.tags = _.extend(res, {hide:false});
                    _.each(res, function(tag){
                        scope.tagInput.push(tag.name)
                    })
                   scope.getTagInputDeferred.resolve(scope.tagInput)
                })
                return scope.getTagInputDeferred.promise;

                // return scope.tagInput;
            }

            scope.addTagToFetch = function(tag){
                if(!tagExists(tag)){
                    removeStringFromArray(scope.tagstringToFecthArray, tag)
                    return false;
                }
                scope.tagsToFecthArray.push(_.findWhere(scope.tags, {name:tag}))
                scope.setMultiTagReq();
            }

            function tagExists(tagName){
                if(_.findWhere(scope.tags,{name:tagName}) == null){
                    return false;
                }
                return true
            }

            function removeStringFromArray(arr, str){
                    var index = $.inArray(str, arr);
                    if (index>=0) arr.splice(index, 1);
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

                var tagCopy = angular.copy(tag);


                tag.$delete({tid:tag.id}, function(){
                    scope.tags = _.without(scope.tags, _.findWhere(scope.tags,{id:tagCopy.id}))
                    scope.mtags = _.without(scope.mtags, _.findWhere(scope.mtags,{id:tagCopy.id}))
                    var index = $.inArray(tagCopy.name, scope.tagInput);
                    if (index>=0) scope.tagInput.splice(index, 1);
                    $rootScope.$broadcast('tagDeleted', {tagId: tagCopy.id, tagName:tagCopy.name});
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

            scope.mtags = [];
            scope.manageTagsActive = false

            scope.showManage = function(){
                scope.tagsTcsHidden = true
                $(element).find('#tags-manage').stop(true,true).animate({left:0},duration, function(){
                    scope.hideManage = false
                });
            }
            
            scope.hideManageTags = function(callback){
                scope.tagsTcsHidden = false
                $(element).find('#tags-manage').stop(true,true).animate({left:400},duration, function(){
                    scope.hideManage = true
                });
            }

            scope.manageTags = function(){

                if(scope.manageTagsActive == true){
                    scope.manageTagsActive = false
                    scope.hideManageTags()
                    scope.showTagTests()
                    return false;
                }

                scope.manageTagsActive = true

                scope.hideTags = false
                $(element).find('#tagstestcases').stop(true,true).animate({left:400},duration, function(){
                    scope.tagsTcsHidden = true
                });


               scope.showManage()
                tcm_model.Tags.query(function(res){
                    scope.mtags = _.extend(res, {hide:false});
                })
            }




        }],
        link: function(scope, elm, attr, ngModelCtrl) {
        }
    };
});