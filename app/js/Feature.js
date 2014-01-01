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

              DO.dropTestsOnFeature(feature)

            
            }

            $rootScope.$on('suiteDragStart', function(event, message){
               $scope.droppable = false;
            })
            $rootScope.$on('suiteDragRevert', function(event, message){
                $scope.droppable = true;
            })


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

                var obj = angular.copy(feature);

                var remove = new tcm_model.Features(feature);

                remove.$delete(function(){
                  $rootScope.$broadcast('featureDeleted', {featureId: feature.featureId, feature: obj});
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