

function MetricsReleaseCntl( $scope, $routeParams, $window, tcm_model) {
    $scope.selection = {
        release: null
    }

    $scope.trend ={
        series:[],
        cats:{}
    };

    $scope.$watch('selection.release', function(val){
        if(val!=null){
            $scope.loadCarriedOver(val);
            $scope.loadTrends(val);
        }
    })

    $scope.openHotLink = function(id){
        $window.open('#/metrics/release/' + $routeParams.projectId + '/' + id);
    }

    $scope.loadCarriedOver = function(id){
        tcm_model.metrics.CarriedOver.query({id:id}, function(metricsCO){
            if(metricsCO.length > 0){
                var categories = new Array();
                var seriesCarriedOver = new Array();
                var seriesTotal = new Array();
                var dataCO = {
                    "categories": "",
                    "data": new Array()
                }

                _.each(metricsCO, function(value){
                    categories.push(value.name);
                    seriesTotal.push(value.total);
                    seriesCarriedOver.push(value.carried_over);
                });

                dataCO.categories = categories;
                var map = {
                    "name": "total",
                    "data": seriesTotal
                }

                dataCO.data.push(map);
                var map = {
                    "name": "carried over",
                    "data": seriesCarriedOver
                };

                dataCO.data.push(map);


                $scope.carriedOver.options.xAxis = {
                    categories: dataCO.categories
                }
                $scope.carriedOver.series = dataCO.data;
            }
        });

    }

    $scope.loadTrends = function(id){
        tcm_model.metrics.Trend.query({id:id}, function(trend){
            var dataTrend = {
                categories: new Array(),
                blocked: new Array(),
                failed: new Array(),
                passed: new Array(),
                notrun: new Array(),
                inprogress: new Array()
            }

            _.each(trend, function(value){
                dataTrend.categories.push(getSerieName(value.name));
                dataTrend.blocked.push(value.Blocked);
                dataTrend.failed.push(value.Failed);
                dataTrend.passed.push(value.Passed);
                dataTrend.notrun.push(value.notrun);
                dataTrend.inprogress.push(value.inprogress);
            });

            $scope.trend.cats = {
                categories: dataTrend.categories
            };
            $scope.trend.series = [
                {
                    name: 'Not Run',
                    data: dataTrend.notrun
                },
                {
                    name: 'In Progress',
                    data: dataTrend.inprogress
                },
                {
                    name: 'Blocked',
                    data: dataTrend.blocked
                },
                {
                    name: 'Failed',
                    data: dataTrend.failed
                },
                {
                    name: 'Passed',
                    data: dataTrend.passed
                }
            ];

            $scope.trendChart = $scope.compliteChart();


        });
    }


$scope.compliteChart = function(){
    return {
        options: {
            chart: {
                type: 'column',
                events: {
                    click: function(event) {
                        $scope.selectGraph($scope.trendChart);
                    }
                },
                height:200,
                width:300,
                subtitle: {
                    text: 'by status'
                },
                xAxis:$scope.trend.cats,
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Test Cases'
                    }
                },
                plotOptions: {
                    column: {
                        pointPadding: 0,
                        borderWidth: 0
                    }
                }
            },
            colors: ['#c6c6c6', '#46ACCA', '#FAA328',  '#CD433D', '#5DB95D'],
            series: $scope.trend.series,
            title: {
                text: 'Iterations Test Case Execution Trend'
            }
        }
    }
}

    $scope.carriedOver = {
        options: {
            chart: {
                type: 'column',
                events: {
                    click: function(event) {
                        $scope.selectGraph($scope.carriedOver);
                    }
                },
                height:200,
                width:300,
                colors: ['#46ACCA',  '#CD433D']
            },
            title: {
                text: 'Carried over features'
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Features Total'
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                }
            },
            legend: {
                align: 'right',
                x: -100,
                verticalAlign: 'top',
                y: 20,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColorSolid) || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
            },
            tooltip: {
                formatter: function() {
                    return '<b>'+ this.x +'</b><br/>'+
                        this.series.name +': '+ this.y +'<br/>'
                }
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            }
        }
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

    $scope.selectGraph = function(graph){
        $scope.selectedGraph = JSON.parse(JSON.stringify(graph));
        $scope.selectedGraph.options.chart.width = 800;
        $scope.selectedGraph.options.chart.height = 450;
    }


    if($routeParams.releaseId == null){
        $scope.releases = tcm_model.Releases.query();
    }else{
        $scope.selection.release = $routeParams.releaseId;
    }
}
MetricsReleaseCntl.$inject = [ '$scope', '$routeParams', '$window', 'tcm_model'];