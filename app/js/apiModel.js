tcmModule.service('tcm_model', ['$resource', '$http', '$routeParams', 'Auth', '$cookieStore', function($resource, $http, $routeParams, Auth, $cookieStore) {


    return {
        Profile: $resource(basePath + 'api/profile'),
        Projects:  $resource(basePath + 'api/projects', {},{
                    update: { method: 'PUT'}

        }),
        ProjectConfig: $resource(basePath + 'api/projects/:id/config', {id:$routeParams.projectId}, {
            update: { method: 'PUT'}

        }),
        ProjectPlugins: $resource(basePath + 'api/projects/:id/plugins/:pid', {id: $routeParams.projectId},{
            update: { method: 'PUT'}

        }),

        Releases: $resource(basePath + 'api/projects/:projectId/releases/:id', {projectId: $routeParams.projectId, id:'@id'}, {
            update: { method: 'PUT'}

        }),

        Iterations: $resource(basePath + 'api/releases/:releaseId/iterations/:IterId', {releaseId: '@releaseId', IterId: '@IterId'},{
                update: {
                    method: 'PUT'
                }
        })
        /*
        admin: {
            getProjects: function(success, error){
                $http.get( basePath + 'api/admin/projects').success(success).error(error);
            },
            addProject: function(name, desc, success, error){
                $http.post( basePath + 'api/admin/projects', {'name': name, 'description': desc}).success(success).error(error);
            },
            deleteProject: function(id, success, error){
                $http.delete( basePath + 'api/admin/projects/' + id).success(success).error(error);
            },
            saveProject: function(id, name, desc, success, error){
                $http.put( basePath + 'api/admin/projects/' + id, {'name':name, 'description': desc}).success(success).error(error);
            },
            getUsers: function(success, error){
                $http.get( basePath + 'api/admin/users').success(success).error(error);
            },
            getUserProjects: function(id, success, error){
                $http.get( basePath + 'api/admin/users/' + id + '/projects').success(success).error(error);
            },
            assignProjectToUser: function(userId,projectId, success, error ){
                $http.post( basePath + 'api/admin/users/' + userId + '/projects', {'projectId': projectId}).success(success).error(error);
            },
            deleteUserProject: function(userId, projectId, success, error){
                $http.delete(basePath+ 'api/admin/users/' + userId + '/projects/' + projectId).success(success).error(error);
            },
            updateUser: function(user, success, error){
                $http.put(basePath+ 'api/admin/users/' + user.id, user).success(success).error(error);
            },
            addUser: function(name, enabled, admin, success, error){
                $http.post(basePath+ 'api/admin/users', {
                 'user_name': name,
                 'enabled': enabled,
                 'admin': admin
                }).success(success).error(error);
            },
            deleteUser: function(id, success, error){
                $http.delete(basePath + 'api/admin/users/' + id).success(success).error(error);
            }
        }  */
    };
}]);