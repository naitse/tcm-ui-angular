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
        }),

        Features: $resource(basePath + 'api/iterations/:iterationId/features/:featureId', {iterationId: '@iterationId', featureId:'@featureId'},{
                update: {
                    method: 'PUT'
                }
        }),

        FeatureExecutedTC: $resource(basePath + 'api/getFeatureExecutedTestCases/:featureId', {featureId:'@featureId'},{
                update: {
                    method: 'PUT'
                }
        }),

        TestCases: $resource(basePath + 'api/features/:featureId/testcases/:tcId', {featureId:'@featureId', tcId: '@tcId'},{
                update: {
                    method: 'PUT'
                }
        }),

        TestCasesUpdateStatus: $resource(basePath + 'api/testcases/:tcId/updateStatus', {tcId: '@tcId', statusId: '@statusId', actualResult:'@actualResult'},{
                update: {
                    method: 'PUT'
                }
        }),

        TestCasesCloneTC: $resource(basePath + 'api/testcases/:tcId/cloneTC', {tcId: '@tcId'},{
                update: {
                    method: 'PUT'
                }
        }),

        JiraIterations: $resource(basePath + 'api/projects/:id/jira/iterations', {id: $routeParams.projectId}),
        JiraIssues: $resource(basePath + 'api/projects/:projectId/jira/iteration/:id/issues', {projectId: $routeParams.projectId, id: '@id'}),
        ReleasesIterations: $resource(basePath + 'api/projects/:id/releasesiterations', {id: $routeParams.projectId}),
        admin: {

            Projects: $resource(basePath + 'api/admin/projects/:id', {id:'@id'}, {
                update: {
                    method: 'PUT'
                }
            }),

            Users: $resource(basePath + 'api/admin/users/:id', {id:'@id'}, {
                update: {
                    method: 'PUT'
                }
            }),

            UserProjects: $resource(basePath + 'api/admin/users/:id/projects/:projectId', {id:'@id', projectId:'@projectId'}, {
                update: {
                    method: 'PUT'
                }
            })

        }
    };
}]);