tcmModule.factory('tcm_model', ['$resource', '$http', '$route', 'Auth', '$rootScope', '$sce', function($resource, $http, $route, Auth, $rootScope, $sce) {

    return {
        trustUrl: function(url){return $sce.trustAsResourceUrl(basePath + url)},
        Profile: $resource(basePath + 'api/profile'),
        Projects:  $resource(basePath + 'api/projects/:id', {id:'@id'},{
                    update: { method: 'PUT'}

        }),
        ProjectConfig: $resource(basePath + 'api/projects/:id/config', {id:function () { return $route.current.params.projectId; }}, {
            update: { method: 'PUT'}

        }),
        ProjectPlugins: $resource(basePath + 'api/projects/:id/plugins/:pid', {id: function () { return $route.current.params.projectId; }},{
            update: { method: 'PUT'}

        }),

        Releases: $resource(basePath + 'api/projects/:projectId/releases/:id', {projectId: function () { return $route.current.params.projectId; }, id:'@id'}, {
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

        TestCaseAttachment: $resource(basePath + 'api/features/:featureId/testcases/:tcId/attachments/:attId/delete',{featureId:'@featureId', tcId: '@tcId', attId: '@attId'},{
            deleteAttach: {
                method: 'POST'
            }
        }),
        getTestCaseAttachments: function(tcId, callback){
            return $http.get( basePath + 'api/testcases/:tcId/attachments'.replace(':tcId',tcId) ).success(callback).error();
        },
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
        JiraIterations: $resource(basePath + 'api/projects/:id/jira/iterations', {id: function () { return $route.current.params.projectId; }}),
        JiraIssues: $resource(basePath + 'api/projects/:projectId/jira/iteration/:id/issues', {projectId: function () { return $route.current.params.projectId; }, id: '@id'}),
        JiraIssue: { //$resource(basePath + 'api/projects/:projectId/jira/issue/:key', {projectId: function () { return $route.current.params.projectId; }, key: '@key'}),
            get: function(params, callback){
                $.ajax({
                url: basePath + 'api/projects/:projectId/jira/issue/:key'.replace(':projectId', function () { return $route.current.params.projectId; }).replace(':key', params.key),
                 type: "GET",
                 asyn:true,
                 contentType:"application/json"
                }).done(callback);
                //return $http.get(basePath + 'api/projects/:projectId/jira/issue/:key'.replace(':projectId', function () { return $route.current.params.projectId; }).replace(':key', params.key));

            }
        },

        JiraIssueTransition: $resource(basePath + 'api/projects/:projectId/jira/issue/:key/transitions/:transitionId/', {projectId: function () { return $route.current.params.projectId; }}),
        ReleasesIterations: $resource(basePath + 'api/projects/:id/releasesiterations', {id: function () { return $route.current.params.projectId; }}),
        Tags: $resource(basePath + 'api/projects/:id/tags/:tid', {id: function () { return $route.current.params.projectId; }},{
                update: {
                    method: 'PUT'
                }
        }),
        TagsTcs: $resource(basePath + 'api/projects/:id/tags/:tid/tcs/:tcId', {id: function () { return $route.current.params.projectId; }, tid:'@tid',tcId:'@tcId'},{
                update: {
                    method: 'PUT'
                }
        }),
        MultiTagsTcs: $resource(basePath + 'api/projects/:id/multitags', {id: function () { return $route.current.params.projectId; }},{
                fetch: {
                    method: 'POST',
                    transformResponse:function(data, headersGetter){
                        return {response:data}
                    },
                    responseType:'json'
                }
        }),
        Suites: $resource(basePath + 'api/projects/:pid/suites/:id', {pid: function () { return $route.current.params.projectId; }, id:'@id'},{
                update: {
                    method: 'PUT'
                }
        }),
        SuiteTests: $resource(basePath + 'api/projects/:id/suites/:sid/tests/:tcId', {id: function () { return $route.current.params.projectId; }, sid:'@sid', tcId:'@tcId'},{
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
                },
                delete: {
                    method: 'DELETE',
                    transformResponse:function(data, headersGetter){
                        return {response:data}
                    },
                    responseType:'json'
                }
        }),
        SuiteTestsClone: $resource(basePath + 'api/projects/:id/suites/:sid/tests/:tcId/cloneSuiteTC', {id: function () { return $route.current.params.projectId; }, sid:'@sid', tcId:'@tcId'},{
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
        SuiteTestsLink: $resource(basePath + 'api/projects/:id/suites/:sid/linkTestCases', {id: function () { return $route.current.params.projectId; }, sid:'@sid'},{
                create:{
                    method: 'POST',
                    transformResponse:function(data, headersGetter){
                        return {response:data}
                    },
                    responseType:'json'
                },
                unlink: {
                    method: 'PUT',
                    responseType:'json',
                    transformResponse:function(data, headersGetter){
                        return {response:data}
                    }
                },
                delete: {
                    method: 'DELETE',
                    transformResponse:function(data, headersGetter){
                        return {response:data}
                    },
                    responseType:'json'
                }
        }),
        getTCLinkState: function(tcId, callback){
            return $http.get( basePath + 'api/tests/:tcId/linked'.replace(':tcId',tcId) ).success(callback).error();
        },
        instanceSuite: function(iterId, suiteId, callback){
            return $http.post( basePath + 'api/suites/:suiteId/instance/:iterId'.replace(':iterId',iterId).replace(':suiteId',suiteId) ).success(callback).error();
        },
        mailer:{
            getTeams: function(rlsId, callback){
                return $http.get( basePath + 'api/mailer/getTeams?rlsId=:rlsId'.replace(':rlsId',rlsId) ).success(callback).error();
            },
            sendMail: function(req, callback){
                return $http.post( basePath + 'api/mailer/send', req).success(callback).error();
            },
            saveData: function(data, callback){
                return $http.post( basePath + 'api/mailer/saveData', data).success(callback).error();
            },
            getEmails: function(callback){
                return $http.get( basePath + 'api/mailer/getEmails').success(callback).error();
            },
            setEmails: function(data, callback){
                return $http.post( basePath + 'api/mailer/setEmails', data).success(callback).error();
            }
        },
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
            ReleaseReport: $resource(basePath + 'api/metrics/interop/releases/:releaseId/report'),
            IterationExecuted: $resource(basePath + 'api/metrics/interop/releases/:releaseId/iterations/:iterId/executed'),
            IterationDaily: $resource(basePath + 'api/metrics/interop/releases/:releaseId/iterations/:iterId/daily'),
            IterationExecutedByItem: $resource(basePath + 'api/metrics/interop/releases/:releaseId/iterations/:iterId/executed_by_item'),
            ReleasesTCsbyStatusByFtr: $resource(basePath + 'api/metrics/interop/releases/:releaseId/:statusId/tcsbyftr'),
            TeamTCsbyStatus: $resource(basePath + 'api/metrics/interop/releases/:releaseId/iterations/:iterationId/:statusId/tcdetails')
        }
    };
}]);