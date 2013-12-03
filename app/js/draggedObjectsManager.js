tcmModule.service('draggedObjects', ['tcm_model', '$rootScope', function(tcm_model, $rootScope) {

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

        }
    };

    return DO;
}]);