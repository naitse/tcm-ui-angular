function MetricsInteropCntl( $scope, $routeParams, tcm_model) {

    var tc_statuses = {
        "Not Run": 0,
        "In Progress": 1,
        "Blocked": 2,
        "Failed": 3,
        "Passed": 4
    }

    $scope.details = {
        title: '',
        tcs: []
    }

    $scope.filterTeamByName = 'All Teams';

    $scope.setTeamNameFilter = function(team){
        $scope.filterTeamByName = team.name;
    }

    $scope.filterTeamName = function(team){
        if($scope.filterTeamByName == 'All Teams'){
            return false;
        }
        if($scope.filterTeamByName != team.name){
            return true;
        }
    }

    $scope.statusText='All Test Status';

    $scope.teams = [];
    $scope.display_team_general = true;

    $scope.byItemGraphs = [];
    $scope.selection = {
            iteration: {
                name: '',
                id: 0 },
            release:{
                name:'Select a Release',
                id:0
            }    
    };

    $scope.releases = [];

    $scope.getReleases = function(){
        tcm_model.Releases.query(function(data){
            $scope.releases = data;
        })
    }




    $scope.executionGraph = {
        options: {
            chart: {
                plotBackgroundColor: null,
                height:200,
                width:300,
                margin: [40, 0, 0, 0],
                animation:true

            },
            //'[{"Not Run":6,"In Progress":0,"Blocked":0,"Passed":10,"Failed":0}]'
            colors: ['#c6c6c6','#46ACCA', '#FAA328', '#CD433D', '#5DB95D' ],

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

                                var that = this
                                tcm_model.metrics.ReleasesTCsbyStatusByFtr.query({'releaseId': $scope.selection.release.id, 'statusId': tc_statuses[this.name]}, function(data){
                                    $scope.details.title = 'Test Cases for status: ' + that.name;
                                    $scope.details.tcs = data;
                                    $('#modal-showMetric').modal();
                                })

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
        tcm_model.metrics.ReleaseExecuted.query({'releaseId': $scope.selection.release.id}, function(metricsExecuted){
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
        tcm_model.metrics.ReleaseDaily.query({'releaseId': $scope.selection.release.id}, function(metricsDaily){

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
        tcm_model.metrics.IterationDaily.query({'releaseId': $scope.selection.release.id, 'iterId':$scope.selection.iteration.id }, function(metricsDaily){

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

        tcm_model.metrics.ReleaseExecutedByItem.query({'releaseId': $scope.selection.release.id}, function(data){
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
                        colors: ['#c6c6c6','#46ACCA', '#FAA328', '#CD433D', '#5DB95D' ],
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
                                cursor: 'pointer'
                            }
                        }
                    },
                    title: {
                        text: ftr.featureName
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

    $scope.refreshExecutionByTeamByItem = function(){

        tcm_model.metrics.IterationExecutedByItem.query({'releaseId': $scope.selection.release.id, 'iterId':$scope.selection.iteration.id}, function(data){
            $scope.byTeamByItemGraphs = [];

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

                $scope.byTeamByItemGraphs.push( {
                    options: {
                        chart: {
                            plotBackgroundColor: null,
                            margin: [40, 0, 0, 0],
                            animation:true,
                            width: 400,
                            height: 300
                        },
                        colors: ['#c6c6c6','#46ACCA', '#FAA328', '#CD433D', '#5DB95D' ],
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
                                cursor: 'pointer'
                            }
                        }
                    },
                    title: {
                        text: ftr.featureName
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
        $scope.ReleaseReport = tcm_model.metrics.ReleaseReport.query({'releaseId': $scope.selection.release.id});
        $scope.ReleaseReportOriginal = $.extend(true,{},$scope.ReleaseReport);
    }

    function getSerieName(key){

        var name = '';
        switch(true){
            case key == 'notrun':
                name =  'Not Run';
                break;
            case key == 'inprogress':
                name =  'In Progress';
                break;
            case key == 'blocked':
                name =  'Blocked';
                break;
            case key == 'failed':
                name =  'Fail';
                break;
            case key == 'pass':
                name =  'Pass';
                break;                
        }

        return name;

    }


    $scope.refreshExecutionByTeam = function(){

        tcm_model.metrics.IterationExecuted.query({'releaseId': $scope.selection.release.id, 'iterId':$scope.selection.iteration.id }, function(metricsExecuted){
            var chartData = [];
            var chartDetails = [];

            $scope.executionByTeamGraph.title= {
                text: metricsExecuted[0].iterName
            }
            delete metricsExecuted[0].iterName;

            chartDetails['total'] = metricsExecuted[0].total

            delete metricsExecuted[0].total;

            _.each(metricsExecuted[0], function(value, key, list){

                chartData.push(new Array( getSerieName(key), value));

                var leKey = getSerieName(key)

                chartDetails[getSerieName(key)] = value;

            });

            $scope.executionByTeamGraph.chartData = chartDetails;

            $scope.executionByTeamGraph.series = [{
                type: 'pie',
                name: 'Test Cases',
                data: chartData
            }];


            $scope.setActiveGraphByTeam($scope.executionByTeamGraph);
        });


    };

    $scope.$watch('display_team_general', function(val){
        $scope.refreshIterationOverview();
    })
    $scope.$watch('display_general', function(val){
        $scope.refreshReleaseOverview();
    })

    $scope.refreshIterationOverview = function(){

        if($scope.display_team_general){
            $scope.refreshExecutionByTeam();
            $scope.refreshReleaseDailyGraphByTeam();
        }else{
            $scope.refreshExecutionByTeamByItem();
        }
    }


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
        if($scope.display_general){
            $scope.refreshReleaseExecutedGraph();
            $scope.refreshReleaseDailyGraph();
        }else{
            $scope.refreshExecutionByItem();
        }
    }

    $scope.switchByTeamGraph = function(){
        var toPreview = $.extend(true, {}, $scope.byTeamSelectedGraph);
        var toSelected = $.extend(true, {}, $scope.byTeamPreviewGraph);

        $scope.setPreviewGraphByTeam(toPreview);
        $scope.setActiveGraphByTeam(toSelected);
    }

    $scope.getReleaseData = function(){
        $scope.byItemGraphs = [];
        $scope.display_general = true;
        $scope.refreshReleaseOverview();
        $scope.refreshReleaseReport();
           //teams are iterations, thanks naitse
        $scope.teams = tcm_model.Iterations.query({'releaseId': $scope.selection.release.id}, function(teams){

            $scope.selection.iteration.name = teams[0].iterationName;
            $scope.selection.iteration.id = teams[0].IterId;
            $scope.refreshExecutionByTeam();
            $scope.refreshReleaseDailyGraphByTeam();
        });
    }

    $scope.getTeamData = function(){
        $scope.display_team_general = true;
            $scope.byTeamByItemGraphs = [];
            $scope.refreshExecutionByTeam();
            $scope.refreshReleaseDailyGraphByTeam();
    }

    if($routeParams.releaseId != null){
        $scope.selection.release.id = $routeParams.releaseId;
        $scope.getReleaseData();
    }else{
        $scope.getReleases();
    }

    $scope.filteredTestsLength = function(team, filterStatusId, filterPriority){
        var testAmount = 0;
        
        if(filterStatusId === "" || typeof filterStatusId == 'undefined'){
            return 1;
        }

        _.each(team.features, function(feature){
            _.each(feature.tests, function(test){
                if(test.statusId == filterStatusId || test.priority == filterPriority){
                    testAmount++
                }
            })
        })
        return testAmount;
    }

    $scope.filteredTestsLengthByFeature = function(feature, filterStatusId, filterPriority){
        var testAmount = 0;
        
        if(filterStatusId === "" || typeof filterStatusId == 'undefined'){
            return 1;
        }

        _.each(feature.tests, function(test){
            if(test.statusId == filterStatusId || test.priority == filterPriority){
                testAmount++
            }
        })
        return testAmount;
    }

    $scope.getPreview = function(){
        $scope.loading = true;
        $scope.preview = tcm_model.trustUrl('api/mailer/build?rlsId=' + $scope.selection.release.id + '&_='+Math.floor(Math.random()*10000001))
        
        tcm_model.mailer.getTeams($scope.selection.release.id, function(data){
            $scope.summaryteams = data;
            $scope.loading = false;
        })

    }


}

MetricsInteropCntl.$inject = [ '$scope', '$routeParams', 'tcm_model'];
