tcmModule.directive('teamStatus', function(){
   return {
       restrict: 'E',
       transclude: true,
       templateUrl: 'app/partials/team_status_dd.html',
       scope:{ 
          team: '='
        },
       controller: ["$scope", "$element", "$attrs", "$rootScope",'tcm_model', function($scope, element, $attrs, $rootScope, tcm_model){

        $scope.buttonSatusClass = 'default';
        $scope.stateName = 'loading'

        $scope.setDefaults = function(){
          $scope.dropDownClose = true;
          $scope.hovered = false
        }

        $scope.$parent.$watch('team.state', function(newStatus){
            $scope.setButtonColor(newStatus);
        })

        $scope.setButtonColor = function(statusId){
          switch(statusId){
              case 0:
                $scope.buttonSatusClass = 'success'
                $scope.stateName = 'OK'
                break;
              case 1:
                $scope.buttonSatusClass = 'warning'
                $scope.stateName = 'Warning'
                break;
              case 2:
                $scope.buttonSatusClass = 'danger'
                $scope.stateName = 'OMG!'
                break;
            }
        }

        $scope.setDefaults();
        $scope.setButtonColor($scope.team.state);

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

        $scope.updateTeamState = function(statusId){

          $scope.setDefaults();
          $scope.$parent.team.state = statusId

        }

       }],

       link: function (scope) {
  
       }
   }
});