

function MetricsPlanCntl( $scope, $routeParams, $window, tcm_model) {
    $scope.selection = {
        iteration: null
    }

    $scope.$watch('selection.iteration', function(id){
        $scope.plan = tcm_model.metrics.Plan.query({id: id});
    });

    $scope.openHotLink = function(id){
        $window.open('#/metrics/plan/' + $routeParams.projectId + '/' + id);
    }

    if($routeParams.iterationId == null){
        $scope.selectedIteration = null;
        $scope.releasesIterations = tcm_model.ReleasesIterations.query();
    }else{
        $scope.selection.iteration = $routeParams.iterationId;
    }

}
MetricsPlanCntl.$inject = [ '$scope', '$routeParams', '$window', 'tcm_model'];