function TopMenuCntl($window, $scope, $route, $routeParams, $location, Auth, tcm_model) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;

    $scope.menuList = [
        {
            name: 'TCM',
            active: $location.path().indexOf('manager') >=0 || $location.path().indexOf('suites')>=0 ? 'active':'',
            subMenuList: [
                    {
                        name: "Home",
                        link: '#/manager/'+$routeParams.projectId,
                        active: $location.path().indexOf('manager') >=0 ? 'active':''
                    }
                ]
        },
        {
            name: 'Metrics',
            active: $location.path().indexOf('testplan') >=0 || $location.path().indexOf('rlsmetrics')>=0 || $location.path().indexOf('/metrics')>=0 ? 'active':'',
            subMenuList: [
                { name: 'TestPlan',
                  active: $location.path().indexOf('plan/') >=0 ? 'active':'',
                  link: '#/metrics/plan/'+$routeParams.projectId
                },
                { name: 'Release',
                  active: $location.path().indexOf('release/') >=0 ? 'active':'',
                    link: '#/metrics/release/'+$routeParams.projectId
                },
                { name: 'Iteration',
                  active: $location.path().indexOf('iterations/') >=0 ? 'active':'',
                    link: '#/metrics/iterations/'+$routeParams.projectId
                }]
        },
        {
            name: 'Plugins',
            active: $location.path().indexOf('sync') >=0 || $location.path().indexOf('import-export')>=0 ? 'active':'',
            subMenuList:[
                { name: 'JIRA Sync',
                  active: $location.path().indexOf('sync') >=0 ? 'active':'',
                    link: '#/jira/'+$routeParams.projectId
                }
                // ,{ name: 'Import/Export',
                //     active: $location.path().indexOf('import-export') >=0 ? 'active':'',
                //     link: '#/import-export'
                // }
            ]
        }
    ];


    var interOpMenu = {
        name: 'Inter Operavility',
        active: $location.path().indexOf('sync') >=0 || $location.path().indexOf('import-export')>=0 ? 'active':'',
        subMenuList:[
            { name: 'Report',
              active: $location.path().indexOf('sync') >=0 ? 'active':'',
                link: '#/metrics/interop/'+$routeParams.projectId
            }
            ,{ name: 'Mailer',
                active: $location.path().indexOf('import-export') >=0 ? 'active':'',
                link: '#/interop/mailer/'
            }
        ]
    }

    $scope.topmenu = 'app/partials/topmenu.html';

    $scope.loadProjects = function(){
        tcm_model.Projects.query(function(data){
            $scope.projects = data;

            for(var i=0; i < data.length; i++){

                if(data[i].id.toString() === $routeParams.projectId){

                    $scope.currentProject = data[i].name;

                    if(data[i].projectType.toString() == '1'){
                        $scope.menuList.push(interOpMenu);
                    }

                }
            }
        });
    }



    $scope.switchProject = function(project){
        var toUpdate = new tcm_model.Projects;
        toUpdate.active = 1

        toUpdate.$update({id: project.id}, function(){
            $window.location.href = '/#/manager/' + project.id;
        });

    };

    $scope.isActiveMenu = function(element){
        return 'active';
    }

    $scope.getProfile = function(){
        tcm_model.Profile.get(function(data){

            $scope.userName = data.displayName;
            $scope.avatar = data.avatar;
            Auth.user = data;
            $scope.isAdmin = data.admin === 1;
        })

    }


    $scope.getProfile();
    $scope.loadProjects();



}

TopMenuCntl.$inject = ['$window', '$scope', '$route', '$routeParams', '$location', 'Auth', 'tcm_model'];