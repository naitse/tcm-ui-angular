

function TCMSettingsCntl( $scope, $routeParams, $http, $rootScope, tcm_model) {
    $scope.editMode = false;

    $scope.selectedUser = {
        id: 0
    };

    $scope.arrprojects = new Array();

    $scope.loadProjects = function(){
        tcm_model.admin.getProjects(function(data){
            $scope.projects = data;
            $scope.arrprojects = new Array();

            data.forEach(function(elmn, index){
                $scope.arrprojects.push(elmn.name);
            });
        });
    };

    $scope.loadUsers = function(selectFirst){
        tcm_model.admin.getUsers(function(data){
            $scope.users = data;
            if(selectFirst != null){
                $scope.loadUserProjects(data[0].id);
            }
        });
    };

    $scope.loadUserProjects = function(id){
        $scope.selectedUser.id = id;
        tcm_model.admin.getUserProjects(id, function(data){

            $scope.userProjects = data;
        });
    }

    $scope.addProject = function(){
        tcm_model.admin.addProject($scope.newProjectName, $scope.newProjectDescription, function(data){
            $scope.newProjectName = "";
            $scope.newProjectDescription = "";
            $scope.loadProjects();
        });
    }

    $scope.deleteProject = function(id){
        tcm_model.admin.deleteProject(id, function(data){
            $scope.newProjectName = "";
            $scope.newProjectDescription = "";
            $scope.loadProjects();
        });
    }

    $scope.saveProject = function(id, name, desc){
        tcm_model.admin.saveProject(id, name, desc, function(data){
            $scope.newProjectName = "";
            $scope.newProjectDescription = "";
            $scope.loadProjects();
        });
    }

    $scope.addProjectToUser = function(){

        tcm_model.admin.assignProjectToUser($scope.selectedUser.id, $scope.getProjectId($scope.newUserProject), function(data){
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

    $scope.deleteUserProject = function(projId){
       tcm_model.admin.deleteUserProject($scope.selectedUser.id, projId, function(data){
           $scope.newUserProject = "";
           $scope.loadUserProjects ($scope.selectedUser.id);
       });
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

        tcm_model.admin.addUser($scope.newUserName, $scope.newUserIsEnabled, $scope.newUserIsAdmin, function(data){
            $scope.newUserName="";
            $scope.newUserIsAdmin = "";
            $scope.newUserIsEnabled="";
        });

    }

    $scope.loadProjects();
    $scope.loadUsers(true);
}
TCMSettingsCntl.$inject = [ '$scope', '$routeParams', '$http', '$rootScope', 'tcm_model'];