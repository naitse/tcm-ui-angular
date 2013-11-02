

function JiraPluginCntl( $scope, $routeParams, $http, $rootScope, tcm_model) {

    $scope.iterations = tcm_model.JiraIterations.get();

    $scope.$watch('iteration', function(value){
        if(value != null){
            $scope.issues= tcm_model.JiraIssues.get({id: value});
        }

    });


   $scope.getPopoverTitle = function(issue){
       console.log(issue)
       popoverTitle = issue.key + ': ' + issue.summary;
   }




}
JiraPluginCntl.$inject = [ '$scope', '$routeParams', '$http', '$rootScope', 'tcm_model'];