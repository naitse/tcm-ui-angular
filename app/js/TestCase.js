tcmModule.directive('ngTestcase', function(){
   return {
      restrict: 'E',
      transclude: true,
       templateUrl: 'app/partials/testcase.html',
       controller: ["$scope", "$element", "$attrs", "$rootScope", 'tcm_model', function($scope, element, $attrs, $rootScope, tcm_model){

        $scope.deleteText = "Sure?";
        $scope.draggable = $scope.tc.draggable;
        var saveCallback = function(){};

        $scope.$watch('tc.checked', function(newValue, oldValue){
            if (newValue == oldValue) {
              return false;
            }
          if(newValue == true){
            $scope.tc.draggable = newValue;
            $scope.$parent.tcChecked()
          }else{
            $scope.$parent.tcUnchecked()
            if($scope.$parent.areTcsChecked()){
              $scope.draggable = $scope.tc.draggable;
            }else{
              $scope.draggable = true;
            }
          }
        })

        $scope.$watch('tc.draggable', function(newValue, oldValue){
            if (newValue == oldValue) {
              return false;
            }

            $scope.draggable = $scope.tc.draggable;
        })

        
        $scope.selectTc= function(){

          if($scope.checked == true){
            return false;
          }
          if($scope.tc.current == true){
            $scope.tc.current = false;
            return false;
          }
          $scope.$parent.$broadcast('tcSelected', {tc: $scope.tc});

        }

        $scope.editTC = function(tc){
          tc.editMode = true; 
          var temp = angular.copy(tc);
          tc.tcTemp = temp;
        }

        $scope.cancelEditTC = function(tc){
          tc.editMode = false; 
          tc.name = tc.tcTemp.name
          tc.description = tc.tcTemp.description
        }

        $scope.saveTC = function(tc){
          tc.editMode = false;
          var temp = angular.copy(tc);
          tc.$update();
        }

        $scope.deleteTC = function(){
          $scope.deleteText = "Deletting...";
          $scope.tc.delete = true;
          $scope.tc.$delete(function(){
              $scope.tcDeleted($scope.tc);
              $scope.$destroy()
          })
        }

        $scope.cloneTc = function(tc){
            var contraryPanel = _.without($rootScope.draggedObjects,_.findWhere($rootScope.draggedObjects,{id:$scope.$parent.uuid}))
            console.log($rootScope.draggedObjects, contraryPanel, $scope.$parent.uuid)
              var newTc = new tcm_model.TestCasesCloneTC({tcId:tc.tcId});
              newTc.featureId = $scope.$parent.requester.id;
              newTc.$save(function(data){
                $rootScope.$broadcast('tcStatusUpdated', {featureId: $scope.$parent.requester.id});
                $rootScope.$broadcast('featureCurrentTCadded', {tc: data, uuid: contraryPanel[0].id});
              })
        }

        $scope.updateTCStatusonDB = function(statusId, callback){
          tcm_model.TestCasesUpdateStatus.update({tcId: $scope.tc.tcId, statusId: statusId, actualResult:$scope.tc.actualResult}, function(data){
              callback(data);
              saveCallback()
          })
        }

        $scope.setActualResult = function(statusId, callback){
          saveCallback = callback;
          if($scope.tc.current != true){
            $scope.selectTc($scope.tc)
          }
          $scope.tc.editARMode = true;
        }

        $scope.saveRun = function(){
          $scope.updateTCStatusonDB($scope.tc.statusId,function(){
            $scope.tc.editARMode = false;
          })
        }

        $scope.undoRun = function(){
          $scope.tc.statusName = $scope.tc.statusNameTemp;
          $scope.tc.statusId = $scope.tc.statusIdTemp;
          $scope.tc.editARMode = false;
          saveCallback = function(){}
        }

        $scope.handleDragStart = function(){
          $scope.$parent.droppable = false;

          if($scope.$parent.areTcsChecked()){
            if($scope.$parent.tcCheckedCount() > 1){
              $scope.tc.dragSingle = false;
            }else{
              $scope.tc.dragSingle = true;
              $scope.$parent.updateGlobalDraggableArray();
            }
          }else{
              $scope.tc.dragSingle = true;
              $scope.$parent.updateGlobalDraggableArray();
          }
        }

        $scope.handleDragRevert = function(tc){
          $scope.$parent.droppable = true;
        }

       }],

       link: function (scope, element, attrs) {
              
       }
   }
});