

function MetricsPlanCntl( $scope, $routeParams, $http, $window, tcm_model) {

    $scope.getPlan = function(id){
        $scope.plan = tcm_model.metrics.Plan.query({id: id});
    }

    $scope.openHotLink = function(id){
        $window.open('#/metrics/plan/' + $routeParams.projectId + '/' + id);
    }

    if($routeParams.iterationId == null){
        $scope.selectedIteration = null;
        $scope.releasesIterations = tcm_model.ReleasesIterations.query();
    }else{
        $scope.getPlan($routeParams.iterationId);
    }

}
MetricsPlanCntl.$inject = [ '$scope', '$routeParams', '$http', '$window', 'tcm_model'];