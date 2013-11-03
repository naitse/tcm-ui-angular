tcmModule.directive('ngTestcase', function(){
   return {
       restrict: 'E',
       transclude: true,
       templateUrl: 'app/partials/testcase.html',
       // scope:{ 
       //    tc: '='
       //  },
       controller: ["$scope", "$element", "$attrs", "$rootScope",'tcm_model', function($scope, element, $attrs, $rootScope, tcm_model){


        $scope.selectTc= function(tc){
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
          tc.$delete(function(){
            $scope.testcases = _.without($scope.testcases, _.findWhere($scope.testcases, {tcId: tc.tcId}));
            $scope.placeholders.testcase.delete = "Sure?";
          })

        }

       }],

       link: function (scope) {
  
       }
   }
});