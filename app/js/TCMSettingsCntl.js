

function TCMSettingsCntl( $scope, $routeParams, $http, $rootScope, tcm_model) {
    $scope.editMode = false;

    $scope.selectedUser = {
        id: 0
    };

    $scope.arrprojects = new Array();

    $scope.loadProjects = function(){
        $scope.projects = tcm_model.admin.Projects.query(function(data){

            $scope.arrprojects = new Array();

            data.forEach(function(elmn, index){
                $scope.arrprojects.push(elmn.name);
            });
        });
    };

    $scope.loadUsers = function(selectFirst){
        $scope.users = tcm_model.admin.Users.query(function(data){

            if(selectFirst != null){
                $scope.loadUserProjects(data[0].id);
            }
        });
    };

    $scope.loadUserProjects = function(id){

        $scope.selectedUser.id = id;
        $scope.refreshProjects();
    }

    $scope.refreshProjects = function(){
        $scope.userProjects = tcm_model.admin.UserProjects.query({'id': $scope.selectedUser.id});
    }

    $scope.addProject = function(){
       var proj = new tcm_model.admin.Projects();
       proj.name =  $scope.newProjectName;
       proj.description = $scope.newProjectDescription;

       proj.$save(function(){
           $scope.newProjectName = "";
           $scope.newProjectDescription = "";
           $scope.loadProjects();
       });
    }



    $scope.addProjectToUser = function(){
        var UP = new tcm_model.admin.UserProjects({id: $scope.selectedUser.id, projectId: $scope.getProjectId($scope.newUserProject)});

        UP.$save(function(){
            $scope.newUserProject = "";
            $scope.loadUserProjects ($scope.selectedUser.id);
        });

    }

    $scope.getProjectId = function(name){
        var projectId = 0;

        $scope.projects.forEach(function(elmnt){
            if(elmnt.name === name){
                projectId = elmnt.id;
            }
        });

        return projectId;
    }



    $scope.saveUser = function(user){
        tcm_model.admin.updateUser(user, function(data){
            $scope.loadUsers();
        });
    }

    $scope.deleteUser = function(user){
        tcm_model.admin.deleteUser(user.id, function(data){
            $scope.loadUsers(true);
        });
    }

    $scope.addUser = function(){

        var user = new tcm_model.admin.Users();
        user.user_name = $scope.newUserName;
        user.enabled = ($scope.newUserIsAdmin)?'1':'0';
        user.admin = ($scope.newUserIsEnabled)?'1':'0';

        user.$save(function(){
            $scope.newUserName="";
            $scope.newUserIsAdmin = "";
            $scope.newUserIsEnabled="";
            $scope.loadUsers(true);
        });

    }

    $scope.loadProjects();
    $scope.loadUsers(true);
}
TCMSettingsCntl.$inject = [ '$scope', '$routeParams', '$http', '$rootScope', 'tcm_model'];