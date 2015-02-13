

function JiraPluginCntl( $scope, $routeParams, $http, $location, tcm_model) {

    $scope.iterations = tcm_model.JiraIterations.get();
    $scope.selection = {
        jiraIteration: null,
        iteration: null
    }

    $scope.alerts = [

    ];

    $scope.$watch("selection.jiraIteration", function(value){
        if(value != null){
            $scope.issues = tcm_model.JiraIssues.get({id: value});
        }

    });

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

    $scope.syncronize = function(){
        var issuesToSync = new Array();

        $scope.getIssuesToSync($scope.issues.contents.completedIssues, issuesToSync)
        $scope.getIssuesToSync($scope.issues.contents.incompletedIssues, issuesToSync)

        var newFeatureBulk = new tcm_model.FeaturesBulk({id: $scope.selection.iteration, projectId:$routeParams.projectId});

        newFeatureBulk.issues = issuesToSync;
        newFeatureBulk.$save(function(){
            $scope.alerts.push({ type: 'success', msg: 'Well done! You successfully syncronized jira items.' });
        });

    }

    $scope.getIssuesToSync = function(issues, issuestoSync){
        issues.forEach(function(feature){
            if(feature.selected != null && feature.selected){
                issuestoSync.push({
                    key : feature.key,
                    name : feature.summary,
                    type : 1
                });
            }
        })
    }

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.releasesIterations = tcm_model.ReleasesIterations.query();

}
JiraPluginCntl.$inject = [ '$scope', '$routeParams', '$http', '$location', 'tcm_model'];