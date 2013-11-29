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

        $scope.$parent.$watch('tc.statusId', function(newStatus){
            $scope.setButtonColor(newStatus);
        })

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


          if(statusId == 2 || statusId == 3){
            $scope.setButtonColor(statusId)
             $scope.test.statusNameTemp = angular.copy($scope.test.statusName)
             $scope.test.statusIdTemp = angular.copy($scope.test.statusId)
            $scope.test.statusName = (statusId == 2)?'Blocked':'Failed';
            $scope.test.statusId = statusId;
            $scope.requestActualResult(statusId)
            return;
          }

          $scope.$parent.updateTCStatusonDB(statusId,function(data){
              $rootScope.$broadcast('tcStatusUpdated', {featureId: $scope.test.featureId});
              $scope.test.statusName = data.name;
              $scope.setButtonColor(data.statusId);
              $scope.setDefaults();
          })

        }

        $scope.requestActualResult = function(statusId){
          $scope.$parent.setActualResult(statusId,function(data){
              $rootScope.$broadcast('tcStatusUpdated', {featureId: $scope.test.featureId});
              $scope.test.statusName = data.name;
              $scope.setButtonColor(data.statusId);
              $scope.setDefaults();
            });
        }  



       }],

       link: function (scope) {
  
       }
   }
});