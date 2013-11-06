tcmModule.directive('ngTestcase', function(){
   return {
      restrict: 'E',
      transclude: true,
       templateUrl: 'app/partials/testcase.html',
       controller: ["$scope", "$element", "$attrs", "$rootScope", 'tcm_model', function($scope, element, $attrs, $rootScope, tcm_model){

        $scope.selectTc= function(tc){

          if($scope.checked == true){
            return false;
          }

          if(tc.current == true){
            tc.current = false;
            return false;
          }

          _.each($scope.testcases, function(obj){
            obj.current = false;
          })

          var setCurrent = _.findWhere($scope.testcases, {tcId: tc.tcId});
          setCurrent.current = true;
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

        $scope.deleteTC = function(tc){
          $scope.placeholders.testcase.delete = "Deletting...";
          var deletedTc = angular.copy(tc)
          tc.$delete(function(){
            $rootScope.$broadcast('tcDeleted', {tcId: deletedTc.tcId, featureId: deletedTc.featureId});
            $scope.placeholders.testcase.delete = "Sure?";
            if(deletedTc.checked = true){
              $scope.removeTcFromArrays(deletedTc)
            }
          })
        }


      $rootScope.$on('tcDeleteBulk', function(event, parameters){
        console.log($rootScope.tcsMultipleObjects)
        _.each($rootScope.tcsMultipleObjects, function(object){
            $scope.deleteTC(object)
        })
      });


        $scope.checked = false;
        $scope.draggable = false;

        $scope.checkTc = function(tc) {
          $scope.draggable = $scope.checked = ($scope.checked == true)?false:true;
          if($scope.checked == true){
            tc.checked = true;
            $rootScope.tcsMultipleObjects.push(tc)
            $rootScope.dragedObjects.push(tc)
            $rootScope.tcsMultipleObjects = angular.copy($rootScope.tcsMultipleObjects);
            $rootScope.dragedObjects = angular.copy($rootScope.dragedObjects);
          }else{
            tc.checked = false;
            $scope.removeTcFromArrays(tc)
          }

          $scope.draggable = $scope.checked
        }

        $scope.removeTcFromArrays = function(tc){
           $rootScope.tcsMultipleObjects = _.without( $rootScope.tcsMultipleObjects, _.findWhere( $rootScope.tcsMultipleObjects, {tcId: tc.tcId}));            
           $rootScope.dragedObjects = _.without( $rootScope.dragedObjects, _.findWhere( $rootScope.dragedObjects, {tcId: tc.tcId}));
        }


        $scope.handleDragStart = function(tc){
          if($rootScope.dragedObjects.length > 0){
              $rootScope.dragedObjects = $rootScope.tcsMultipleObjects
          } else {
            $rootScope.dragedObjects.push(tc)
            $rootScope.dragedObjects = angular.copy($rootScope.dragedObjects);
          }
        }

        $scope.handleDragRevert = function(tc){
          $rootScope.dragedObjects = _.without( $rootScope.dragedObjects, _.findWhere( $rootScope.dragedObjects, {tcId: tc.tcId}));
        }

       }],

       link: function (scope, element, attrs) {
              
       }
   }
});