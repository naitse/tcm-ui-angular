function ReportsSprintCtrl( $scope, $routeParams, tcm_model) {
    $scope.features = []
       $scope.exFullChart = [];
        $scope.exFullchartData = [];
    $scope.sprint = {
        id : $routeParams.sprintId
    }

    $scope.getFeatures = function(){
        tcm_model.Features.query({iterationId:$scope.sprint.id}, function(data){
            $scope.features = data;
            _.each($scope.features, function(feature){
                feature.exChart = [];
                feature.expand = false;
                getTestCases(feature);
            })
        })
    }

    function getTestCases(feature){
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
            drawExecutionChart(feature);
            // drawAutomatedChart(feature);
         })
    }
    drawFullExecutionChart();
    $scope.getFeatures();

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
       $scope.exFullChart = [];
        $scope.exFullchartData = [];

        tcm_model.metrics.IterationExecuted.query({'releaseId': 0, 'iterId':$scope.sprint.id }, function(data){
            var data = data[0];
 
                $scope.sprint.name = data.iterName;

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
            

        });

        

    }


    

}

ReportsSprintCtrl.$inject = [ '$scope', '$routeParams', 'tcm_model'];
