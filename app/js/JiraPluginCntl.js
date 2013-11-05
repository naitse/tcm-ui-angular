

function JiraPluginCntl( $scope, $routeParams, $http, $rootScope, tcm_model) {

    $scope.iterations = tcm_model.JiraIterations.get();
    $scope.iteration = null;

    $scope.getIssues = function(value){
        if(value != null){
            $scope.issues= tcm_model.JiraIssues.get({id: value});
        }

    };

    $scope.releasesIterations = tcm_model.ReleasesIterations.query();


    $scope.syncronize = function(){
        console.log($scope.issues);
        console.log($scope.releasesIterations)
    }
}
JiraPluginCntl.$inject = [ '$scope', '$routeParams', '$http', '$rootScope', 'tcm_model'];