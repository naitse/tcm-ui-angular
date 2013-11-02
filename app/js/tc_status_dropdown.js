tcmModule.directive('tcStatusDropdown', function(){
   return {
       restrict: 'E',
       transclude: true,
       templateUrl: 'app/partials/tc_status_dropdown.html',
       scope:{ 
          test: '='
        },
       controller: ["$scope", "$element", "$attrs", 'tcm_model', function($scope, element, $attrs, tcm_model){

        $scope.setDefaults = function(){
          $scope.dropDownClose = true;
          $scope.hovered = false
        }

        $scope.setDefaults();

        $scope.openDD = function(){
          $scope.dropDownClose = false
        }

        $scope.tryCloseDD = function(){

          if(!$scope.dropDownClose){
            setTimeout(function(){
              $scope.$apply(
                function(){
                  if(!$(element).find('.dropdown-menu').hasClass('hovered')){
                    console.log('cerrar')
                    $scope.setDefaults();
                  }
                }
              )
            }, 300);
          }

        }

        $scope.updateTCstatus = function(statusId){
          tcm_model.TestCasesUpdateStatus.update({tcId: $scope.test.tcId, statusId: statusId, actualResult:''}, function(data){
            $scope.test.statusName = data.name;
            $scope.setDefaults();
          })
        }  

       }],

       link: function (scope) {
  
       }
   }
});