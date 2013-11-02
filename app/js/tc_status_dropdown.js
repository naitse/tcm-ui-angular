tcmModule.directive('tcStatusDropdown', function(){
   return {
       restrict: 'E',
       transclude: true,
       templateUrl: 'app/partials/tc_status_dropdown.html',
       scope:{ 
          test: '='
        },
       controller: ["$scope", "$element", "$attrs", "$rootScope",'tcm_model', function($scope, element, $attrs, $rootScope, tcm_model){

        $scope.buttonSatusClass = 'default';

        $scope.setDefaults = function(){
          $scope.dropDownClose = true;
          $scope.hovered = false
        }

        $scope.setButtonColor = function(statusId){
          switch(statusId){
              case 0:
                $scope.buttonSatusClass = 'default'
                break;
              case 1:
                $scope.buttonSatusClass = 'info'
                break;
              case 2:
                $scope.buttonSatusClass = 'warning'
                break;
              case 3:
                $scope.buttonSatusClass = 'danger'
                break;
              case 4:
                $scope.buttonSatusClass = 'success'
                break;
            }
        }

        $scope.setDefaults();
        $scope.setButtonColor($scope.test.statusId);

        $scope.openDD = function(){
          $scope.dropDownClose = false
        }

        $scope.tryCloseDD = function(){

          if(!$scope.dropDownClose){
            setTimeout(function(){
              $scope.$apply(
                function(){
                  if(!$(element).find('.dropdown-menu').hasClass('hovered')){
                    $scope.setDefaults();
                  }
                }
              )
            }, 300);
          }

        }

        $scope.updateTCstatus = function(statusId){
          tcm_model.TestCasesUpdateStatus.update({tcId: $scope.test.tcId, statusId: statusId, actualResult:''}, function(data){
            $rootScope.$broadcast('tcStatusUpdated', {featureId: $scope.test.featureId});
            $scope.test.statusName = data.name;
            $scope.setButtonColor(data.statusId);
            $scope.setDefaults();
          })
        }  

       }],

       link: function (scope) {
  
       }
   }
});