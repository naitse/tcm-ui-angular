tcmModule.service('tcm_model', ['$resource', '$http', '$routeParams', 'Auth', '$cookieStore', function($resource, $http, $routeParams, Auth, $cookieStore) {

     var Projects = $resource(basePath + 'api/projects', {}, {
         getProj: { method: "GET",
             withCredentials:true
         }

     })

    //$http.defaults.headers.common['connect.sess'] = document.cookie.replace('connect.sess=', '');
    //$http.defaults.withCredentials = true;

    //$http.defaults.headers.common['Cookie'] = document.cookie;


    return {
        /*getResource: $resource(basePath + 'api/projects', {}, {
                getProj: { method: "GET",
                    withCredentials:true
                }

        }),*/
        getProfile: function(success, error){
            $http.get( basePath + 'api/profile').success(success).error(error);
        },
        getProjects: function(success, error){
            //Projects.getProj(success);
            //console.log(Projects.getProj());
            $http.get( basePath + 'api/projects').success(success).error(error);
        },
        getProjectConfig: function( success, error){
            $http.get( basePath + 'api/projects/'+$routeParams.projectId+'/config').success(success).error(error);
        },
        updateProject: function(projectId, requestBody, success, error){
            $http.put( basePath + 'api/projects/'+projectId, requestBody).success(success).error(error);
        },
        getProjectPlugins: function(projectId, success, error){
            $http.get( basePath + 'api/projects/'+$routeParams.projectId + '/plugins').success(success).error(error);
        },
        updatePluginProperty: function(pluginId, prop, value, success, error){
            $http.put( basePath + 'api/projects/'+$routeParams.projectId + '/plugins/'+ pluginId, {'prop': prop, 'value': value}).success(success).error(error);
        },
        getReleases: function(success, error){
            $http.get( basePath + 'api/projects/'+$routeParams.projectId+'/releases').success(success).error(error);
        },
        getIterations: function(id, success, error){
            $http.get( basePath + 'api/releases/'+id+'/iterations').success(success).error(error);
        },
        createRelease: function(releaseName, success, error){
            $http.post( basePath + 'api/projects/'+$routeParams.projectId+'/releases', {'name': releaseName}).success(success).error(error);
        },
        deleteRelease: function(releaseId, success, error){
            $http.delete( basePath + 'api/releases/' + releaseId).success(success).error(error);
        },
        createIteration: function(releaseId, name, success, error){
            $http.post( basePath + 'api/releases/' + releaseId + '/iterations', {'name': name}).success(success).error(error)
        },
        deleteIteration: function(iterId, success, error){
            $http.delete( basePath + 'api/iterations/' + iterId).success(success).error(error);
        },
        updateIteration: function(iterId, name, success, error){
            $http.put( basePath + 'api/iterations/' + iterId, {"name": name}).success(success).error(error);
        },
        updateRelease: function(rlsId, name, success, error){
            $http.put( basePath + 'api/releases/' + rlsId, {"name": name}).success(success).error(error);
        },
        updateProjectConfig: function(config, success, error){
            $http.put(basePath + 'api/projects/' + $routeParams.projectId + '/config', config).success(success).error(error);
        },
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
        }
    };
}]);