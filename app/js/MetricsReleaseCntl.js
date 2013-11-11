

function MetricsReleaseCntl( $scope, $routeParams, $window, tcm_model) {

    $scope.openHotLink = function(id){
        $window.open('#/metrics/release/' + $routeParams.projectId + '/' + id);
    }


    $scope.selectedRelease = null;
    $scope.releases = tcm_model.Releases.query();


}
MetricsReleaseCntl.$inject = [ '$scope', '$routeParams', '$window', 'tcm_model'];