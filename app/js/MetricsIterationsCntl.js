

function MetricsIterationsCntl( $scope, $routeParams, $window, tcm_model) {
    $scope.selection = {
        iteration: null
    }

    $scope.statuses = [
        {id: 0, name: 'Not Run'},
        {id: 1, name: 'In Progress'},
        {id: 2, name: 'Blocked'},
        {id: 3, name: 'Failed'},
        {id: 4, name: 'Pass'}];


    $scope.details = false;

    $scope.$watch('selection.iteration', function(id){
        if(id!= null){
            $scope.loadExecuted(id);
            $scope.loadDaily(id);
        }

    });

    $scope.loadDaily = function(id){
        tcm_model.metrics.Daily.query({id: id}, function(metricsDaily){
            if(metricsDaily.length > 0){
                var days = new Array();
                var testcases = new Array();


                _.each(metricsDaily, function(value){
                    days.push(value.day);
                    testcases.push(value.testcases);
                });

                $scope.daily.series = [{
                    showInLegend: false,
                    data: testcases
                }];

                $scope.daily.options.chart.xAxis = {
                    categories: days,
                        title: {
                        text: 'Days'
                    }
                };
            }
        })
    }

    $scope.loadExecuted = function(id){
         tcm_model.metrics.Executed.query({id: id}, function(metricsExecuted){
             if(metricsExecuted.length > 0){
                 var chartData = new Array();

                 $scope.title =  {
                     text: metricsExecuted[0].iterName
                 }

                 delete metricsExecuted[0]['iterName'];
                 _.each(metricsExecuted[0], function(value, key){
                     chartData.push(new Array( key, value));
                 });

                $scope.executed.series = [{
                     type: 'pie',
                     name: 'Test Cases',
                     data: chartData
                 }]
             }
         });
    }

    $scope.daily = {
        options:{
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

    $scope.executed = {
        options: {
            chart: {
                plotBackgroundColor: null,
                // plotBorderWidth: null,
                // plotShadow: false,
                margin: [40, 0, 0, 0],
                animation:true,
                height:200,
                width:300
            },
            colors: ['#c6c6c6', '#CD433D', '#5DB95D', '#46ACCA', '#FAA328'],
            title: {
                text: ""
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000',
                        formatter: function() {
                            return '<b>'+ this.point.name +'</b>: '+ Math.round(this.percentage) +' %';
                        }
                    }

                },
                series: {
                    allowPointSelect: false,
                    cursor: 'pointer',
                    point:{
                        events: {
                            click: function() {
                                if($scope.selectedGraph== null){return;}

                                $scope.details = true;
                                var seriesName = this.name;
                                var status = _.find($scope.statuses, function(item){
                                    return item.name === seriesName;
                                });

                                $scope.detailsByStatus = tcm_model.metrics.TCsByStatus.query({'id': $scope.selection.iteration, 'statusId': status.id})

                            }
                        }
                    }
                }
            }
        }
    }

    $scope.openHotLink = function(id){
        $window.open('#/metrics/iterations/' + $routeParams.projectId + '/' + id);
    }

    $scope.selectGraph = function(graph){
        $scope.selectedGraph = $.extend(true, {}, graph);
        $scope.selectedGraph.options.plotOptions.series.allowPointSelect = true;
        $scope.selectedGraph.options.chart.width = 800;
        $scope.selectedGraph.options.chart.height = 450;
    }

    if($routeParams.iterationId == null){
        $scope.releasesIterations = tcm_model.ReleasesIterations.query();
    }else{
        $scope.selection.iteration = $routeParams.iterationId;
    }

}
MetricsIterationsCntl.$inject = [ '$scope', '$routeParams', '$window', 'tcm_model'];