tcmModule.directive('ngFeature', function(){
   return {
       restrict: 'E',
       transclude: true,
       templateUrl: 'app/partials/feature.html',
       // scope:{ 
       //    tc: '='
       //  },
       controller: ["$scope", "$element", "$attrs", "$rootScope",'tcm_model', 'draggedObjects', function($scope, element, $attrs, $rootScope, tcm_model, DO){

          $scope.droppable = $scope.$parent.droppable || true;
            $scope.handleDrop = function(feature){
              $('.tcm-drag-helper').remove();

              var current =  DO.getObjects()
              var dragSingle = DO.getDragSingleObject()
              
              if(dragSingle == false){
                  $scope.manageDropObjects(feature, current, 'draggable');
              }else{
                  $scope.manageDropObjects(feature, current, 'dragSingle');
              }
            
            }

            $scope.manageDropObjects = function(feature, current, key){

              _.each(dObjects, function(object){

                if(object.type == 'test' && object[key]){

                  var newTc = new tcm_model.TestCasesCloneTC({tcId:object.tcId});
                  newTc.featureId = feature.featureId;
                  newTc.$save(function(data){
                    object.dragSingle = false;
                    $rootScope.$broadcast('tcStatusUpdated', {featureId: feature.featureId});
                    if(feature.current == true){
                      $rootScope.$broadcast('featureCurrentTCadded', {tc: data, uuid: current.id});
                    }
                  })
                }

              })
            }

            $scope.clone = function(){
              feat = {
                featureName:$scope.feature.featureName,
                jiraKey:$scope.feature.jiraKey,
                featureDescription:$scope.feature.featureDescription,
                featureType:$scope.feature.featureType,
                iterationId: $scope.feature.iterationId,
                fId: $scope.feature.featureId
              }
              $scope.$parent.cloneFeature(feat)
            }

            $scope.editFeature = function(feature){
                feature.editMode = true; 
                var temp = angular.copy(feature);
                feature.featureTemp = temp;
              }
              $scope.cancelEditFeature = function(feature){
                feature.editMode = false; 
                feature.featureName = feature.featureTemp.featureName
                feature.jiraKey = feature.featureTemp.jiraKey
              }
              $scope.saveFeature = function(feature){
                feature.editMode = false;
                var temp = angular.copy(feature);
                feature.$update();
              }

              $scope.deleteFeature = function(feature){
                $scope.placeholders.feature.delete = "OMG!";

                feature.$delete(function(){
                  $rootScope.$broadcast('featureDeleted', {featureId: feature.featureId});
                  $scope.placeholders.feature.delete = "Delete?";
                  $scope.featureSelected = false;
                })

              }

            ///////////////DD actions

              $scope.setDdDefaults = function(){
                $scope.dropDownClose = true;
                $scope.hovered = false
              }

              $scope.setDdDefaults();

              $scope.openDD = function(){
                $scope.dropDownClose = false
              }

              $scope.tryCloseDD = function(){

                if(!$scope.dropDownClose){
                  setTimeout(function(){
                    $scope.$apply(
                      function(){
                        if(!$(element).find('.dropdown-menu').hasClass('hovered')){
                          $scope.setDdDefaults();
                        }
                      }
                    )
                  }, 300);
                }

              }


       }],

       link: function (scope) {
  
       }
   }
});