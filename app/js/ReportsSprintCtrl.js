function ReportsSprintCtrl( $scope, $routeParams, tcm_model, $q) {
    $scope.features = []
       $scope.exFullChart = [];
        $scope.exFullchartData = [];
        $scope.iterations = $routeParams.sprintId.split(',').reverse()
    $scope.sprint = {
        id : $routeParams.sprintId
    }

    $scope.overal = []

    $scope.HOLA = false;

    $scope.statusFilter = 5;

    $scope.filterFeaturebyTestsStatus = function(feature){
        if(typeof feature.tests == 'undefined' || $scope.statusFilter == 5){
            return true;
        }
        var found = false;
        for (var i = feature.tests.length - 1; i >= 0; i--) {
            if(feature.tests[i].statusId == $scope.statusFilter){
                found = true;
                break;
            }
        };

        return found;
    }

    $scope.filterByTestsStatus = function(test){

        if($scope.statusFilter == 5){
            return true;
        }

        var found = false;
        if(test.statusId == $scope.statusFilter){
            return true;
        }

        return false;
    }

    function getAutomationFeatures(iterId){
        return tcm_model.metrics.AutomationRunLatestbyIterationId.query({iterId:iterId}).$promise
    }

    function getFeature(iterId){
        return tcm_model.Features.query({iterationId:iterId}).$promise
    }

    $scope.getFeatures = function(){
        var promises = [];

        for (var i = $scope.iterations.length - 1; i >= 0; i--) {
            //promises.push(getAutomationFeatures($scope.iterations[i]))
            promises.push(getFeature($scope.iterations[i]))
        };

        $q.all(promises).then(function(results){

            $scope.features = [];
            $scope.automationFeatures =[]

            _.each(results, function(featureSet){
                if(featureSet.length > 0){
                    _.each(featureSet, function(feature){
                        if(typeof feature.suite == 'undefined'){
                            feature.loadingTests = false;
                            $scope.features.push(feature);
                        }else{
                            $scope.automationFeatures.push(feature);
                        }
                    })
                }
            })
            
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
        feature.loadingTests = true;
        tcm_model.TestCases.query({featureId: feature.featureId},function(data){
            feature.automated = 0;
            feature.tests = data;
            _.each(feature.tests, function(test){
                test.expand = false;
                if(test.automated == 1){
                    feature.automated++
                }
            })
            feature.loadingTests = false;
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

    function getIterationExecuted(iteId){
        return tcm_model.metrics.IterationExecuted.query({'releaseId': 0, 'iterId':iteId }).$promise
    }

    function getAutomationListener(iteId){
        return tcm_model.metrics.AutomationRunSummaryLatestbyIterationId.query({'iterId':iteId}).$promise
    }


    function drawFullExecutionChart(){
        $scope.dataAU = [];
        var promises = [];
        var iterations = $scope.iterations;

        for (var i = iterations.length - 1; i >= 0; i--) {
            promises.push(getIterationExecuted(iterations[i]));
            // promises.push(getAutomationListener(iterations[i]));
        };

        $q.all(promises).then(function(results){
            var data = {
                notrun:0,
                inprogress:0,
                blocked:0,
                failed:0,
                pass:0,
                total:0,
                iterName:'QA Extended Report'
            }
            for (var i = results.length - 1; i >= 0; i--) {
                if(typeof results[i][0].PASSED != 'undefined'){
                    for (var j = results[i].length - 1; j >= 0; j--) {
                        if(results[i][j].PASSED != null){
                            $scope.dataAU.push(results[i][j]);
                            $scope.HOLA = true;
                            data.notrun += results[i][j].NOTRUN                
                            data.pass += results[i][j].PASSED               
                            data.failed += results[i][j].FAILED
                            data.total += results[i][j].TOTAL 
                        }
                    };
                    
                }else{
                    data.blocked += results[i][0].blocked
                    data.pass += results[i][0].pass
                    data.inprogress += results[i][0].inprogress
                    data.failed += results[i][0].failed
                    data.notrun += results[i][0].notrun
                    data.total += results[i][0].total
                    
                }
            };

            $scope.HOLA = false;
            $scope.exFullChart = [];
            $scope.exFullchartData = [];

            $scope.getFeatures();
 
            $scope.sprint.name = data.iterName;
            
            $scope.overal = data;
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
