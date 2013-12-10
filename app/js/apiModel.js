tcmModule.factory('tcm_model', ['$resource', '$http', '$routeParams', 'Auth', '$rootScope', function($resource, $http, $routeParams, Auth, $rootScope) {


    return {
        Profile: $resource(basePath + 'api/profile'),
        Projects:  $resource(basePath + 'api/projects/:id', {id:'@id'},{
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

        FeaturesBulk: $resource(basePath + 'api/iterations/:id/features_bulk', {id: '@id'}),

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
        JiraIssue: { //$resource(basePath + 'api/projects/:projectId/jira/issue/:key', {projectId: $routeParams.projectId, key: '@key'}),
            get: function(params, callback){
                $.ajax({
                url: basePath + 'api/projects/:projectId/jira/issue/:key'.replace(':projectId', $routeParams.projectId).replace(':key', params.key),
                 type: "GET",
                 asyn:true,
                 contentType:"application/json"
                }).done(callback);
                //return $http.get(basePath + 'api/projects/:projectId/jira/issue/:key'.replace(':projectId', $routeParams.projectId).replace(':key', params.key));

            }
        },

        JiraIssueTransition: $resource(basePath + 'api/projects/:projectId/jira/issue/:key/transitions/:transitionId/', {projectId: $routeParams.projectId}),
        ReleasesIterations: $resource(basePath + 'api/projects/:id/releasesiterations', {id: $routeParams.projectId}),
        Tags: $resource(basePath + 'api/projects/:id/tags/:tid', {id: $routeParams.projectId},{
                update: {
                    method: 'PUT'
                }
        }),
        TagsTcs: $resource(basePath + 'api/projects/:id/tags/:tid/tcs/:tcId', {id: $routeParams.projectId, tid:'@tid',tcId:'@tcId'},{
                update: {
                    method: 'PUT'
                }
        }),
        Suites: $resource(basePath + 'api/projects/:pid/suites/:id', {pid: $routeParams.projectId, id:'@id'},{
                update: {
                    method: 'PUT'
                }
        }),
        SuiteTests: $resource(basePath + 'api/projects/:id/suites/:sid/tests/:tcId', {id: $routeParams.projectId, sid:'@sid', tcId:'@tcId'},{
                create:{
                    method: 'POST',
                    transformResponse:function(data, headersGetter){
                        return {response:data}
                    },
                    responseType:'json'
                },
                update: {
                    method: 'PUT',
                    responseType:'json'
                }
        }),
        SuiteTestsClone: $resource(basePath + 'api/projects/:id/suites/:sid/tests/:tcId/cloneSuiteTC', {id: $routeParams.projectId, sid:'@sid', tcId:'@tcId'},{
                clone:{
                    method: 'POST',
                    transformResponse:function(data, headersGetter){
                        return {response:data}
                    },
                    responseType:'json'
                },
                update: {
                    method: 'PUT',
                    responseType:'json'
                },
                delete: {
                    method: 'DELETE',
                    transformResponse:function(data, headersGetter){
                        return {response:data}
                    },
                    responseType:'json'
                }
        }),
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
            UsersPassports: $resource(basePath + 'api/admin/users/:userId/passport/:id', {userId:'@userId', id:'@id'}, {
                    update: {
                        method: 'PUT'
                    }
                }
            ),
            UserProjects: $resource(basePath + 'api/admin/users/:id/projects/:projectId', {id:'@id', projectId:'@projectId'}, {
                update: {
                    method: 'PUT'
                }
            }),
            LoginTypes: $resource(basePath + 'api/logintypes')

        },
        metrics:{
            Plan: $resource(basePath + 'api/metrics/iterations/:id/plan'),
            Trend: $resource(basePath + 'api/metrics/releases/:id/trend'),
            CarriedOver: $resource(basePath + 'api/metrics/releases/:id/carriedover'),
            Executed: $resource(basePath + 'api/metrics/iterations/:id/executed'),
            Daily: $resource(basePath + 'api/metrics/iterations/:id/daily'),
            TCsByStatus: $resource(basePath + 'api/metrics/iterations/:id/status/:statusId'),
            ReleaseExecuted: $resource(basePath + 'api/metrics/interop/releases/:releaseId/executed'),
            ReleaseDaily: $resource(basePath + 'api/metrics/interop/releases/:releaseId/daily'),
            ReleaseExecutedByItem: $resource(basePath + 'api/metrics/interop/releases/:releaseId/executed_by_item'),
            ReleaseReport: $resource(basePath + 'api/metrics/interop/releases/:releaseId/report')
        }
    };
}]);