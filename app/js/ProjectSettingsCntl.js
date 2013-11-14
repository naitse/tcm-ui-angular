

function ProjectSettingsCntl( $scope, $routeParams, $http, $rootScope, tcm_model) {

    $scope.selectedRelease = {
        'id': 0,
        'name': ''
    };

    $scope.updateReleases = function(){
        $scope.releases = tcm_model.Releases.query(function(data){
                if($scope.selectedRelease.id ===0){

                    $scope.selectedRelease.id = data[0].id;
                    $scope.selectedRelease.name = data[0].releaseName;

                }

                $scope.updateIterations($scope.selectedRelease.id,  $scope.selectedRelease.name);
            }
        );

    };

    $scope.updateIterations = function(rid, name){
        $scope.selectedRelease.id = rid;
        $scope.selectedRelease.name = name;

        $scope.iterations = tcm_model.Iterations.query({releaseId:$scope.selectedRelease.id});
    }

    $scope.addNew = function(){

      var newRel = new tcm_model.Releases();

      newRel.releaseName = $scope.newRelease;
      newRel.$save(function(){
          $scope.newRelease = "";
          $scope.selectedRelease.id = 0;
          $scope.updateReleases();
      });

    };

    $scope.deleteRelease = function(release){

        release.$delete(function(){
           $scope.selectedRelease.id = 0;
           $scope.selectedRelease.name = '';
           $scope.updateReleases();
       });

    };

    $scope.addNewIteration = function(){

        if($scope.newIteration == null){
            return;
        }
        var newIter = new tcm_model.Iterations({releaseId:$scope.selectedRelease.id});

        newIter.iterationName = $scope.newIteration;

        newIter.$save(function(){
            $scope.newIteration = "";
            $scope.updateIterations($scope.selectedRelease.id, $scope.selectedRelease.name);
        });

    };

    $scope.deleteIteration = function(iter){

        iter.$delete(function(data){

            $scope.updateIterations($scope.selectedRelease.id, $scope.selectedRelease.name);
        });

    };


    $scope.updateRelease = function(release){

        release.$update(function(){
            $scope.updateReleases();
        });

    }

    $scope.updateReleases();

    $scope.projectConfig = tcm_model.ProjectConfig.get();
}
ProjectSettingsCntl.$inject = [ '$scope', '$routeParams', '$http', '$rootScope', 'tcm_model'];