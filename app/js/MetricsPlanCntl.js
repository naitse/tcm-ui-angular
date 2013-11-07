

function MetricsPlanCntl( $scope, $routeParams, $http, $location, tcm_model) {
    $scope.selectedIteration = null;
    $scope.releasesIterations = tcm_model.ReleasesIterations.query();

    $scope.getPlan = function(id){
        $scope.plan = tcm_model.metrics.Plan.query({id: id});
    }

}
MetricsPlanCntl.$inject = [ '$scope', '$routeParams', '$http', '$location', 'tcm_model'];