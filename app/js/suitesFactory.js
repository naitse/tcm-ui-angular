tcmModule.factory('suitesFactory', ['tcm_model', '$rootScope', function(tcm_model, $rootScope) {

    var DO = {
        draggedObjects: [],
        currentDragUUID:'',
        getObjects: function(){

           var objectsArray = []
               
            _.each(DO.draggedObjects, function(current){
                if(current.id == DO.currentDragUUID){

                    var singleObject = _.findWhere(current.objects, {dragSingle: true})

                    if(typeof singleObject != 'undefined'){
                        objectsArray.push(singleObject)
                    }else{
                        _.each(current.objects, function(object){
                            if(object.draggable == true){
                                objectsArray.push(object)
                            }
                        })
                    }

                    objectsArray.id = current.id
                }
            })

            return objectsArray
        },
        cleanDraggable: function(){
            _.each(DO.draggedObjects, function(current){
                _.each(current.objects, function(object){
                    object.dragSingle = false;
                })
            })
        },
        dropTestsOnTestsContainer:function(featureId){

            var dObjects = DO.getObjects()
          
          _.each(dObjects, function(object){
              if(object.type == 'test'){
                  var newTc = new tcm_model.TestCasesCloneTC({tcId:object.tcId});
                  newTc.featureId = featureId;
                  newTc.$save(function(data){
                    $rootScope.$broadcast('featureCurrentTCadded', {tc: data, uuid: dObjects.id});
                    $rootScope.$broadcast('tcStatusUpdated', {featureId: featureId});
              })
            }
          })

          DO.cleanDraggable();

        },
        dropTestsOnFeature: function(feature){
              
            var dObjects = DO.getObjects()

              _.each(dObjects, function(object){

                if(object.type == 'test'){
                  var newTc = new tcm_model.TestCasesCloneTC({tcId:object.tcId});
                  newTc.featureId = feature.featureId;
                  newTc.$save(function(data){
                    object.dragSingle = false;
                    $rootScope.$broadcast('tcStatusUpdated', {featureId: feature.featureId});
                    if(feature.current == true){
                      $rootScope.$broadcast('featureCurrentTCadded', {tc: data, uuid: dObjects.id});
                    }
                  })
                }

              })

              DO.cleanDraggable();

        },
        dropTestOnTagContainer:function(tag, testCases){

              var dObjects = DO.getObjects()

                _.each(dObjects ,function(tc){
                  var exists = _.findWhere(testCases, {tcId:tc.tcId})
                  if(typeof exists != 'undefined'){
                    dObjects = _.without(dObjects, _.findWhere(dObjects,{tcId:tc.tcId}))
                  }
                })

                var tagTc = new tcm_model.TagsTcs({tid:tag.id})
                tagTc.tid = tag.id;
                tagTc.testArray = angular.copy(dObjects)
                tagTc.$save(function(){
                  _.each(tagTc.testArray, function(data){
                    
                    $rootScope.$broadcast('tcTagged', {tc: data, tag:angular.copy(tag)});
                    // $rootScope.$broadcast('featureCurrentTCadded', {tc: data, uuid: DO.currentDragUUID});
                  })
                });

        },
        dropTestOnSuite:function(suite, scope){

              var dObjects = DO.getObjects()

              var temp = new tcm_model.SuiteTests()
              temp.sid = suite.id;
              temp.testArray = dObjects
              temp.$create(function(data){
                _.each(data.response,function(tc){
                  scope.updateTestCasesList(tc)
                  $rootScope.$broadcast('suiteTcStatusUpdated', {suiteId: suite.id});
                })
              })

        }

    };

    return DO;
}]);