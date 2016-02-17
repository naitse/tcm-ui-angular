function ReportsSprintCtrl( $scope, $routeParams, tcm_model, $q) {

    $scope.displayByTag = 1;

    $scope.automation = [{
            data: [
                {name:'Automated',y:0, dataLabels:{enabled:false}},
                {name:'Manual',y:0,dataLabels:{enabled:false}}
            ],
            showInLegend: true
        }]
    $scope.progress = [{
            data: [
                {name:'Pass',y:0, dataLabels:{enabled:false}, color:'#5CB85C'},
                {name:'Fail',y:0,dataLabels:{enabled:false}, color:'#D9534F'},
                {name:'Blocked',y:0,dataLabels:{enabled:false}, color:'#F0AD4E'},
                {name:'In Progress',y:0,dataLabels:{enabled:false}, color:'#5BC0DE'},
                {name:'Not Run',y:0,dataLabels:{enabled:false}, color:'#5C5C61'}
            ]
        }]
    $scope.features = []
    $scope.testCases = []
    $scope.groups = []
    $scope.taggedTests = [{name:'No Tagged', tests:[], pass:0, fail:0, blocked:0,inprogress:0, notRun:0, total:0}]
    $scope.automatedCount = {
        automated:0,
        manual:0
    }
       $scope.exFullChart = [];
        $scope.exFullchartData = [];
        $scope.iterations = $routeParams.sprintId.split(',').reverse()
    $scope.sprint = {
        id : $routeParams.sprintId
    }

    $scope.$watch('automatedCount', function(newVal){
        $scope.automation[0].data[0].y = newVal.automated
        $scope.automation[0].data[1].y = newVal.manual
    }, true);

    $scope.$watch('overal', function(newVal){
        $scope.progress[0].data[0].y = newVal.pass
        $scope.progress[0].data[1].y = newVal.failed
        $scope.progress[0].data[2].y = newVal.blocked
        $scope.progress[0].data[3].y = newVal.inprogress
        $scope.progress[0].data[4].y = newVal.notrun
    }, true);
    

    $scope.overal = []

    $scope.HOLA = false;

    $scope.statusFilter = 5;

    $scope.highchartsNG = {
        options: {
            chart: {
                type: 'pie',
                width:200,
                height:200
            }
        },
        // series: [{
        //     data: [
        //         {name:'Automated',y:10},
        //         {name:'Manual',y:20}
        //     ]
        // }],
        plotOptions:{
            showInLegend: true
        },
        title: {
            text: ''
        },
        loading: false
    }

    $scope.highchartsauNG = {
        options: {
            chart: {
                type: 'pie',
                width:200,
                height:200
            }
        },
        // series: [{
        //     data: [
        //         {name:'Automated',y:10},
        //         {name:'Manual',y:20}
        //     ]
        // }],
        plotOptions:{
            dataLabels:{
                enabled:false
            }
        },
        title: {
            text: ''
        },
        loading: false
    }

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

    $scope.filterByGroup = function(test, group){
        console.log(test, group)
        if(typeof test.tags != 'undefined' && test.tags.length > 0){
            var alreadyTracked = _.find(test.tags, function(tag){ return group == tag.name; });
            if(typeof alreadyTracked != 'undefined'){
                return true
            }
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
            _.each($scope.groups, function(group){
                $scope.taggedTests.push({
                    name:group, 
                    tests: _.filter($scope.testCases, function(test) { 
                        return typeof _.find(test.tags, function(tag){ return tag.name == group})
                    })
                })
            })

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

            var temp = ''

        })

    }

function addTestToGroup(tag, test){
    _.each($scope.taggedTests, function(groupedTests){
        if(groupedTests.name == tag.name){
            groupedTests.tests.push(test)
            groupedTests.total++
            switch(test.statusId){
                case 4:
                  groupedTests.pass++
                  break; 
                case 3:
                  groupedTests.fail++
                  break;
                case 2:
                  groupedTests.blocked++
                  break;
                case 1:
                  groupedTests.inprogress++
                  break;
                case 0:
                  groupedTests.notrun++
                  break;
            }
        }
    })
}

    function getTestCases(feature, callback){
        feature.loadingTests = true;
        tcm_model.TestCases.query({featureId: feature.featureId},function(data){
            feature.automated = 0;
            feature.tests = data;
            _.each(feature.tests, function(test){
                $scope.testCases.push(test)
                if(test.tags.length > 0){
                    _.each(test.tags, function(tag){
                        var alreadyTracked = _.find($scope.groups, function(grupo){ return grupo == tag.name; });
                        if(typeof alreadyTracked == 'undefined'){
                            $scope.groups.push(tag.name);
                            $scope.taggedTests.unshift({name:tag.name, tests:[], pass:0, fail:0, blocked:0,inprogress:0, notRun:0, total:0});
                            addTestToGroup(tag, test);
                        }else{
                            addTestToGroup(tag, test);
                        }
                    })
                }else{
                    addTestToGroup({name:'No Tagged'}, test);
                }
                test.expand = false;
                if(test.automated == 1){
                    feature.automated++
                    $scope.automatedCount.automated++
                }else{
                    $scope.automatedCount.manual++
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
drawAutomatedChart()
    function drawAutomatedChart(){
        var feature = [];
        $scope.automation.auChart = [];
        $scope.automation.auchartData = [];


        $scope.automation.auchartData.push(new Array( 'Manual',     $scope.automatedCount.manual ));
        $scope.automation.auchartData.push(new Array( 'Automated',  $scope.automatedCount.automated ));

        $scope.automation.auChart.push( {
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

    // function getAutomationListener(iteId){
    //     return tcm_model.metrics.AutomationRunSummaryLatestbyIterationId.query({'iterId':iteId}).$promise
    // }


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
