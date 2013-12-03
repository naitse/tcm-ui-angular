tcmModule.service('draggedObjects', [function() {

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
        }
    };

    return DO;
}]);