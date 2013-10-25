

function ProjectSettingsCntl( $scope, $routeParams, $http, $rootScope, tcm_model) {

    $scope.selectedRelease = {
        'id': 0,
        'name': ''
    };

    $scope.projectConfig = {}

    $scope.updateReleases = function(){
        tcm_model.getReleases(function(dataReleases){
            $scope.releases = dataReleases[0];

            if($scope.selectedRelease.id ===0){

                $scope.selectedRelease.id = dataReleases[0][0].id;
                $scope.selectedRelease.name = dataReleases[0][0].releaseName;

            }

            $scope.updateIterations(dataReleases[0][0].id, dataReleases[0][0].releaseName);

        });
    };

    $scope.updateIterations = function(rid, name){
        $scope.selectedRelease.id = rid;
        $scope.selectedRelease.name = name;

        tcm_model.getIterations($scope.selectedRelease.id, function(dataIter){
            $scope.iterations = dataIter;
        })
    }

    $scope.addNew = function(){

      tcm_model.createRelease($scope.newRelease, function(data){
          $scope.newRelease = "";
          $scope.selectedRelease = data[0].releaseId;
          $scope.updateReleases();
      })
    };

    $scope.deleteRelease = function(releaseId){

       tcm_model.deleteRelease(releaseId, function(data){
           $scope.selectedRelease.id = 0;
           $scope.selectedRelease.name = '';
           $scope.updateReleases();
       });

    };

    $scope.addNewIteration = function(){
        tcm_model.createIteration($scope.selectedRelease.id, $scope.newIteration, function(data){
            $scope.newIteration = "";
            $scope.updateIterations($scope.selectedRelease.id, $scope.selectedRelease.name);
        });
    };

    $scope.deleteIteration = function(iterId){

        tcm_model.deleteIteration(iterId, function(data){

            $scope.updateIterations($scope.selectedRelease.id, $scope.selectedRelease.name);
        });

    };

    $scope.updateIteration = function(iterId, name){

        tcm_model.updateIteration(iterId, name, function(){

        });

    };

    $scope.updateRelease = function(rId, name){
        tcm_model.updateRelease(rId, name, function(){

        });
    }

    $scope.updateReleases();

    $scope.loadProjectConfig = function(){
        tcm_model.getProjectConfig(function(data){
            $scope.projectConfig = data[0];
        });
    };

    $scope.updateProjectConfig = function(){
        tcm_model.updateProjectConfig($scope.projectConfig, function(){

        });
    };

    $scope.loadProjectConfig();
}
ProjectSettingsCntl.$inject = [ '$scope', '$routeParams', '$http', '$rootScope', 'tcm_model'];