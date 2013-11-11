tcmModule.directive('ngFeature', function(){
   return {
       restrict: 'E',
       transclude: true,
       templateUrl: 'app/partials/feature.html',
       // scope:{ 
       //    tc: '='
       //  },
       controller: ["$scope", "$element", "$attrs", "$rootScope",'tcm_model', function($scope, element, $attrs, $rootScope, tcm_model){


            $scope.handleDrop = function(feature){
              $('.tcm-drag-helper').remove();

              var current = _.findWhere($rootScope.draggedObjects, {id: $rootScope.currentDragUUID})
              var dragSingle = _.findWhere(current.objects, {dragSingle: true})
              
              if(typeof dragSingle == 'undefined'){
                  $scope.manageDropObjects(feature, current, 'draggable');
              }else{
                  $scope.manageDropObjects(feature, current, 'dragSingle');
              }
            
            }

            $scope.manageDropObjects = function(feature, current, key){

              _.each(current.objects, function(object){
              // _.each($scope['testcases'], function(object){

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

            $scope.editFeature = function(feature){
                feature.editMode = true; 
                var temp = angular.copy(feature);
                feature.featureTemp = temp;
              }
              $scope.cancelEditFeature = function(feature){
                feature.editMode = false; 
                feature.featureName = feature.featureTemp.featureName
              }
              $scope.saveFeature = function(feature){
                feature.editMode = false;
                var temp = angular.copy(feature);
                feature.$update();
              }

              $scope.deleteFeature = function(feature){
                $scope.placeholders.feature.delete = "Deletting...";

                feature.$delete(function(){
                  $rootScope.$broadcast('featureDeleted', {featureId: feature.featureId});
                  $scope.placeholders.feature.delete = "Sure?";
                  $scope.featureSelected = false;
                })

              }


       }],

       link: function (scope) {
  
       }
   }
});