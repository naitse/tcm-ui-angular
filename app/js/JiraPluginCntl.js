

function JiraPluginCntl( $scope, $routeParams, $http, $location, tcm_model) {

    $scope.iterations = tcm_model.JiraIterations.get();
    $scope.iteration = null;

    $scope.getIssues = function(value){
        if(value != null){
            $scope.issues= tcm_model.JiraIssues.get({id: value});
        }

    };

    $scope.releasesIterations = tcm_model.ReleasesIterations.query();

    $scope.syncronize = function(){

        $scope.issues.contents.completedIssues.forEach(syncItem);
        $scope.issues.contents.incompletedIssues.forEach(syncItem);
    }

    $scope.$watch('completedSelecteAll', function(val){
        if($scope.issues== null){return;}
        $scope.issues.contents.completedIssues.forEach(function(element){
            element.selected = val;
        })
    })

    $scope.$watch('incompletedSelecteAll', function(val){

        if($scope.issues== null){return;}
        $scope.issues.contents.incompletedIssues.forEach(function(element){
            element.selected = val;
        })
    })

    function syncItem(feature){
        if(feature.selected != null && feature.selected){

            $scope.releasesIterations.forEach(function(release){

                release.iterations.forEach(function(iteration){

                    if(iteration.selected != null && iteration.selected){
                        var newFeature = new tcm_model.Features({iterationId: iteration.iterId});

                        newFeature.key = feature.key
                        newFeature.name = feature.summary
                        newFeature.$save();
                    }
                })
            });
        }

        //$location.path('/manager/' + $routeParams.projectId);

    }
}
JiraPluginCntl.$inject = [ '$scope', '$routeParams', '$http', '$location', 'tcm_model'];