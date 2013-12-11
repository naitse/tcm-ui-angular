function MetricsInteropCntl( $scope, $routeParams, tcm_model) {

    $scope.byItemGraphs = [];
    $scope.selection = {
            iteration: {
                name: '',
                id: 0 }
    };

    $scope.executionGraph = {
        options: {
            chart: {
                plotBackgroundColor: null,
                height:200,
                width:300,
                margin: [40, 0, 0, 0],
                animation:true

            },
            //'[{"Not Run":6,"In Progress":0,"Passed":10,"Failed":0,"Blocked":0}]'
            colors: ['#c6c6c6','#46ACCA', '#5DB95D', '#CD433D', '#FAA328'],

            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000',
                        formatter: function() {
                            // return InteropMetricsView.fetchTCsbyStatus(this.x);
                            return '<b>'+ this.point.name +'</b>: '+ Math.round(this.percentage) +' %';
                        }
                    }
                },
                series: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    point: {
                        events: {
                            select: function() {
                                $('#InteropMetrics #tc-container').css('visibility','visible');
                                // console.log(this)
                                $(container).data('series',this.x);
                                $(container).data('name',iterName);

                                chart = $(container);

                                // console.log(chart)

                                $('#info-tc-modal-io #tc-container').children().remove();

                                $('#info-tc-modal-io').find('.feature-title').text($(container).find('.highcharts-title tspan').text() +' - '+ this.name + ' test cases')
                                // console.log(this,$(container))
                                InteropMetricsView.fetchTCsbyStatus(this.x,chart);
                            },
                            unselect: function() {
                                $('#InteropMetrics #tc-container').children().remove();
                            }
                        }
                    }
                }
            }
        }
    };

    $scope.executionByTeamGraph = $.extend(true, {}, $scope.executionGraph );

    $scope.dailyGraph = {
        options: {
            chart: {
                height:200,
                width:300
            },
            title: {
                text: 'Daily Execution',
                x: -20 //center
            },

            yAxis: {
                title: {
                    text: 'Test Cases'
                }
            }

        }

    }

    $scope.dailyGraphByTeam = $.extend(true, {}, $scope.dailyGraph );

    $scope.refreshReleaseExecutedGraph = function(){
        tcm_model.metrics.ReleaseExecuted.query({'releaseId': $routeParams.releaseId}, function(metricsExecuted){
            var chartData = new Array();

            $scope.iterName = metricsExecuted[0].iterName;

            $scope.executionGraph.title= {
                text: metricsExecuted[0]['name']
            }
            delete metricsExecuted[0]['name'];
            var total = 0;

            _.each(metricsExecuted[0], function(value, key, list){

                chartData.push(new Array( key, value));
                total += value;
            });

            $scope.executionGraph.total = total;
            $scope.executionGraph.chartData = metricsExecuted;

            $scope.executionGraph.series = [{
                type: 'pie',
                name: 'Test Cases',
                data: chartData
            }]

            $scope.setActiveGraph($scope.executionGraph);

        });
    }

    $scope.refreshReleaseDailyGraph = function(){
        tcm_model.metrics.ReleaseDaily.query({'releaseId': $routeParams.releaseId}, function(metricsDaily){

            if(metricsDaily.length > 0){

                var days = new Array();
                var testcases = new Array();


                _.each(metricsDaily, function(value, key, list){
                    days.push(value.day);
                    testcases.push(value.testcases);
                });


                $scope.dailyGraph.series = [{
                    showInLegend: false,
                    data: testcases
                }];

                $scope.dailyGraph.options.chart.xAxis = {
                    categories: days,
                    title: {
                        text: 'Days'
                    }
                };
            }

            $scope.setPreviewGraph($scope.dailyGraph);
        });
    }

    $scope.refreshReleaseDailyGraphByTeam = function(){
        tcm_model.metrics.IterationDaily.query({'releaseId': $routeParams.releaseId, 'iterId':$scope.selection.iteration.id }, function(metricsDaily){

            if(metricsDaily.length > 0){

                var days = new Array();
                var testcases = new Array();


                _.each(metricsDaily, function(value, key, list){
                    days.push(value.day);
                    testcases.push(value.testcases);
                });


                $scope.dailyGraphByTeam.series = [{
                    showInLegend: false,
                    data: testcases
                }];

                $scope.dailyGraphByTeam.options.chart.xAxis = {
                    categories: days,
                    title: {
                        text: 'Days'
                    }
                };
            }

            $scope.setPreviewGraphByTeam($scope.dailyGraphByTeam);
        });
    }

    $scope.refreshExecutionByItem = function(){

        tcm_model.metrics.ReleaseExecutedByItem.query({'releaseId': $routeParams.releaseId}, function(data){
            $scope.byItemGraphs = [];

            _.each(data, function(ftr){

                var chartData = [];
                _.each(ftr, function(value, key){
                    if( key === "notrun" ||
                        key === "inprogress"||
                        key === "blocked"||
                        key === "failed"||
                        key === "pass"){
                        chartData.push(new Array( key, value));
                    }
                });

                $scope.byItemGraphs.push( {
                    options: {
                        chart: {
                            plotBackgroundColor: null,
                            margin: [40, 0, 0, 0],
                            animation:true,
                            width: 400,
                            height: 300
                        },
                        colors: ['#c6c6c6','#46ACCA', '#5DB95D', '#CD433D', '#FAA328'],
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    color: '#000000',
                                    connectorColor: '#000000',
                                    formatter: function() {
                                        // return InteropMetricsView.fetchTCsbyStatus(this.x);
                                        return '<b>'+ this.point.name +'</b>: '+ Math.round(this.percentage) +' %';
                                    }
                                }
                            },
                            series: {
                                allowPointSelect: true,
                                cursor: 'pointer'/*,
                                 point: {
                                 events: {
                                 select: function() {
                                 $('#InteropMetrics #tc-container').css('visibility','visible');
                                 // console.log(this)
                                 $(container).data('series',this.x);
                                 $(container).data('name',iterName);

                                 chart = $(container);

                                 // console.log(chart)

                                 $('#info-tc-modal-io #tc-container').children().remove();

                                 $('#info-tc-modal-io').find('.feature-title').text($(container).find('.highcharts-title tspan').text() +' - '+ this.name + ' test cases')
                                 // console.log(this,$(container))
                                 InteropMetricsView.fetchTCsbyStatus(this.x,chart);
                                 },
                                 unselect: function() {
                                 $('#InteropMetrics #tc-container').children().remove();
                                 }
                                 }
                                 }*/
                            }
                        }
                    },
                    title: {
                        text: ftr.featureDescription
                    },
                    series: [{
                        type: 'pie',
                        name: 'Test Cases',
                        data: chartData
                    }]
                });
            });
        });
    }

    $scope.refreshReleaseReport = function(){
        $scope.ReleaseReport = tcm_model.metrics.ReleaseReport.query({'releaseId': $routeParams.releaseId});
        $scope.ReleaseReportOriginal = $.extend(true,{},$scope.ReleaseReport);
    }

   //teams are iterations, thanks naitse
    $scope.teams = tcm_model.Iterations.query({'releaseId': $routeParams.releaseId}, function(teams){

        $scope.selection.iteration.name = teams[0].iterationName;
        $scope.selection.iteration.id = teams[0].IterId;
        $scope.refreshExecutionByTeam();
        $scope.refreshReleaseDailyGraphByTeam();
    });


    $scope.refreshExecutionByTeam = function(){

        tcm_model.metrics.IterationExecuted.query({'releaseId': $routeParams.releaseId, 'iterId':$scope.selection.iteration.id }, function(metricsExecuted){
            var chartData = [];

            $scope.executionByTeamGraph.title= {
                text: metricsExecuted[0].iterName
            }
            delete metricsExecuted[0].iterName;

            _.each(metricsExecuted[0], function(value, key, list){

                chartData.push(new Array( key, value));

            });

            $scope.executionByTeamGraph.chartData = metricsExecuted;

            $scope.executionByTeamGraph.series = [{
                type: 'pie',
                name: 'Test Cases',
                data: chartData
            }];

            $scope.setActiveGraphByTeam($scope.executionByTeamGraph);
        });


    };

    $scope.setPreviewGraph = function(graph){
        $scope.previewGraph = $.extend(true, {}, graph);
        $scope.previewGraph.options.chart.width = 300;
        $scope.previewGraph.options.chart.height = 200;
    }

    $scope.setActiveGraph = function(graph){
        $scope.selectedGraph = $.extend(true, {}, graph);
        $scope.selectedGraph.options.chart.width = 900;
        $scope.selectedGraph.options.chart.height = 550;
    }

    $scope.setActiveGraphByTeam = function(graph){
        $scope.byTeamSelectedGraph = $.extend(true, {}, graph);
        $scope.byTeamSelectedGraph.options.chart.width = 900;
        $scope.byTeamSelectedGraph.options.chart.height = 550;
    }

    $scope.setPreviewGraphByTeam = function(graph){
        $scope.byTeamPreviewGraph = $.extend(true, {}, graph);
        $scope.byTeamPreviewGraph.options.chart.width = 300;
        $scope.byTeamPreviewGraph.options.chart.height = 200;
    }

    $scope.switchGraph = function(){
        var toPreview = $.extend(true, {}, $scope.selectedGraph);
        var toSelected = $.extend(true, {}, $scope.previewGraph);

        $scope.setPreviewGraph(toPreview);
        $scope.setActiveGraph(toSelected);
    }

    $scope.refreshReleaseOverview = function(){
        $scope.refreshReleaseExecutedGraph();
        $scope.refreshReleaseDailyGraph();
        $scope.refreshExecutionByItem();
    }

    $scope.switchByTeamGraph = function(){
        var toPreview = $.extend(true, {}, $scope.byTeamSelectedGraph);
        var toSelected = $.extend(true, {}, $scope.byTeamPreviewGraph);

        $scope.setPreviewGraphByTeam(toPreview);
        $scope.setActiveGraphByTeam(toSelected);
    }

    $scope.refreshReleaseOverview();
    $scope.refreshReleaseReport();

}

MetricsInteropCntl.$inject = [ '$scope', '$routeParams', 'tcm_model'];
