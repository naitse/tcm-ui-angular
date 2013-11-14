

function MetricsPlanCntl( $scope, $routeParams, $window, tcm_model) {
    $scope.selection = {
        iteration: null
    }

    $scope.$watch('selection.iteration', function(id){
        if(id != null){
            $scope.plan = tcm_model.metrics.Plan.query({id: id});
        }else{
            $scope.plan=null;
        }

    });

    $scope.openHotLink = function(id){
        $window.open('#/metrics/plan/' + $routeParams.projectId + '/' + id);
    }

    if($routeParams.iterationId == null){
        $scope.releasesIterations = tcm_model.ReleasesIterations.query();
    }else{
        $scope.selection.iteration = $routeParams.iterationId;
    }

}
MetricsPlanCntl.$inject = [ '$scope', '$routeParams', '$window', 'tcm_model'];