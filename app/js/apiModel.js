tcmModule.service('tcm_model', ['$http', '$routeParams', 'Auth', '$cookieStore', function($http, $routeParams, Auth, $cookieStore) {

    //set headers if cookies found
    var user = $cookieStore.get('user');
    if(user != null){
        $http.defaults.headers.common['Authorization'] = "Basic " + $.base64.encode(user.username + ':' + user.password);
    }


    return {

        getProjects: function(success, error){
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
        }
    };
}]);