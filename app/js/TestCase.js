tcmModule.directive('ngTestcase', function(){
   return {
      restrict: 'E',
      transclude: false,
       templateUrl: 'app/partials/testcase.html',
       controller: ["$scope", "$element", "$attrs", "$rootScope", 'tcm_model', function($scope, element, $attrs, $rootScope, tcm_model){

        $scope.checked = false;

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
          var tcId = angular.copy(tc.tcId)
          var featureId = angular.copy(tc.featureId)
          tc.$delete(function(){
            $rootScope.$broadcast('tcDeleted', {tcId: tcId, featureId: featureId});
            $scope.placeholders.testcase.delete = "Sure?";
          })

        }


        $scope.handleDragStart = function(tc){
          $rootScope.dragedObjects.push(tc);
        }

        $scope.handleDragRevert = function(tc){
          $rootScope.dragedObjects = [];
        }

       }],

       link: function (scope, element, attrs) {
              
       }
   }
});