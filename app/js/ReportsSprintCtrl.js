function ReportsSprintCtrl( $scope, $routeParams, tcm_model, $q) {
    $scope.features = []
       $scope.exFullChart = [];
        $scope.exFullchartData = [];
    $scope.sprint = {
        id : $routeParams.sprintId
    }

    $scope.getFeatures = function(){


        $q.all({
            automationDetails: tcm_model.metrics.AutomationRunLatestbyIterationId.query({iterId:$scope.sprint.id}).$promise,
            features: tcm_model.Features.query({iterationId:$scope.sprint.id}).$promise
        }).then(function(results){
            $scope.features = results.features;
            $scope.automationFeatures = results.automationDetails;
            
            _.each($scope.features, function(feature){
                feature.exChart = [];
                feature.expand = false;
                getTestCases(feature);
            })

            var auTemp = []
            var temp = ''

            _.each($scope.automationFeatures, function(auFeature){

                if(auFeature.suite != temp){
                    temp = auFeature.suite
                    auTemp.push({
                        featureType:4,
                        jiraKey: auFeature.suite,
                        total: _.findWhere($scope.dataAU, {suite:auFeature.suite}).TOTAL,
                        pass: _.findWhere($scope.dataAU, {suite:auFeature.suite}).PASSED,
                        failed: _.findWhere($scope.dataAU, {suite:auFeature.suite}).FAILED,
                        notrun: _.findWhere($scope.dataAU, {suite:auFeature.suite}).NOTRUN,
                        tests: []
                    })
                }
                auTemp[auTemp.length -1].tests.push(
                        {
                            statusId: auFeature.status,
                            name: auFeature.test,
                            description: 'Build #' + auFeature.build
                        }
                )
                

            });

            _.each(auTemp,function(lala){
                $scope.features.push(lala);
            })
            


        })

    }

    function getTestCases(feature, callback){
        tcm_model.TestCases.query({featureId: feature.featureId},function(data){
            feature.automated = 0;
            feature.tests = data;
            _.each(feature.tests, function(test){
                test.expand = false;
                if(test.automated == 1){
                    feature.automated++
                }
            })
            //feature.automated = (feature.automated * 100) / feature.tests.length
            //drawExecutionChart(feature);
            // drawAutomatedChart(feature);
         })
    }
    drawFullExecutionChart();

    function drawExecutionChart(feature){

        if(feature.total === 0){
            return;
        }

        feature.exChart = [];
        feature.exchartData = [];

        _.each(feature, function(value, key){
            if( key === "notrun" ||
                key === "inprogress"||
                key === "blocked"||
                key === "failed"||
                key === "pass"){
                feature.exchartData.push(new Array( key, value));
            }
        });

        feature.exChart.push( {
            options: {
                chart: {
                    plotBackgroundColor: null,
                    margin: [40, 0, 0, 0],
                    animation:false,
                    width: 120,
                    height: 120,
                    marginTop: 0
                },
                credits: {
                      enabled: false
                },
                colors: ['#c6c6c6','#46ACCA', '#FAA328', '#CD433D', '#5DB95D' ],
                plotOptions: {
                    pie: {
                        //allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false,
                            // color: '#000000',
                            // connectorColor: '#000000',
                            // formatter: function() {
                            //     // return InteropMetricsView.fetchTCsbyStatus(this.x);
                            //     return '<b>'+ this.point.name +'</b>: '+ Math.round(this.percentage) +' %';
                            // }
                        }
                    },
                    series: {
                        allowPointSelect: false,
                        cursor: 'default'
                    }
                },
                tooltip: {
                    enabled: true,
                    formatter: function() {
                        return this.y;
                    }
                }
            },
            title: {
                text: null,
                margin: 0
            },
            subtitle: {
                text: null,
                margin: 0
            },
            series: [{
                type: 'pie',
                name: 'Test Cases',
                data: feature.exchartData
            }]
        });

    }

    function drawAutomatedChart(feature){

        feature.auChart = [];
        feature.auchartData = [];


        feature.auchartData.push(new Array( 'debt', (feature.tests.length - feature.automated)));
        feature.auchartData.push(new Array( 'Automated', feature.automated));

        feature.auChart.push( {
            options: {
                chart: {
                    plotBackgroundColor: null,
                    margin: [40, 0, 0, 0],
                    animation:false,
                    width: 200,
                    height: 200
                },
                colors: ['#c6c6c6', '#5DB95D'],
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false,
                            color: '#000000',
                            connectorColor: '#000000',
                            formatter: function() {
                                // return InteropMetricsView.fetchTCsbyStatus(this.x);
                                return '<b>'+ this.point.name +'</b>: '+ Math.round(this.percentage) +' %';
                            }
                        }
                    },
                    series: {
                        allowPointSelect: false,
                        cursor: 'default'
                    }
                }
            },
            title: {
                text: 'Automated'
            },
            series: [{
                type: 'pie',
                name: 'Test Cases',
                data: feature.auchartData
            }]
        });

    }

    $scope.openModal = function(feature){
        $scope.modalData = feature;
        $('#modal-showMetrics').modal();
    }

    function drawFullExecutionChart(){

        $q.all({
            iterExecuted: tcm_model.metrics.IterationExecuted.query({'releaseId': 0, 'iterId':$scope.sprint.id }).$promise,
            autoListener: tcm_model.metrics.AutomationRunSummaryLatestbyIterationId.query({'iterId':$scope.sprint.id}).$promise,
            manualAutomation: tcm_model.metrics.ManualAutomation.query({'iterId':$scope.sprint.id}).$promise
        }).then(function(results){
            $scope.HOLA = false;
           $scope.exFullChart = [];
            $scope.exFullchartData = [];
            data = results.iterExecuted[0]
            $scope.dataAU = dataAU = results.autoListener
            $scope.manualAU = results.manualAutomation

            $scope.getFeatures();
 
            $scope.sprint.name = data.iterName;

            if(typeof dataAU != 'undefined' && dataAU.length > 0){
                if(dataAU[0].PASSED != null){
                    $scope.HOLA = true;
                }
                
                var atotal = 0;
                var apass = 0;
                var afailed = 0;
                var anotrun = 0;

                _.each($scope.dataAU, function(au){
                    atotal += au.TOTAL
                    apass += au.PASSED
                    afailed += au.FAILED
                    anotrun += au.NOTRUN
                })

                data.notrun += anotrun                
                data.pass += apass               
                data.failed += afailed
                data.total += atotal                                  
            }

            if(typeof $scope.manualAU != 'undefined' && $scope.manualAU.length > 0){
                $scope.HOLA = true;
                var matotal = 0;
                var mapass = 0;
                var mafailed = 0;

                _.each($scope.manualAU, function(mau){
                    matotal += mau.total
                    mapass += mau.pass
                    mafailed += mau.failed
                })

                data.pass += mapass                
                data.failed += mafailed
                data.notrun += (matotal - (mapass + mafailed))
                data.total += matotal

            }
            

            _.each(data, function(value, key){
                if( key === "notrun" ||
                    key === "inprogress"||
                    key === "blocked"||
                    key === "failed"||
                    key === "pass"){
                    $scope.exFullchartData.push(new Array( key, value));
                }
            });

            $scope.exFullChart.push( {
                options: {
                    chart: {
                        plotBackgroundColor: null,
                        margin: [40, 0, 0, 0],
                        animation:false,
                        width: 500,
                        height: 500,
                        marginTop: 0
                    },
                    credits: {
                          enabled: false
                    },
                    colors: ['#c6c6c6','#46ACCA', '#FAA328', '#CD433D', '#5DB95D' ],
                    plotOptions: {
                        pie: {
                            //allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: false
                            }
                        },
                        series: {
                            allowPointSelect: false,
                            cursor: 'default'
                        }
                    },
                    tooltip: {
                        enabled: true,
                        formatter: function() {
                            return this.y;
                        }
                    }
                },
                title: {
                    text: null,
                    margin: 0
                },
                subtitle: {
                    text: null,
                    margin: 0
                },
                series: [{
                    type: 'pie',
                    name: 'Test Cases',
                    data: $scope.exFullchartData
                }]
            });
        
        }); //end $q
            
    }


    

}

ReportsSprintCtrl.$inject = [ '$scope', '$routeParams', 'tcm_model', '$q'];
