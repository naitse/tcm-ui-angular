

function PluginsCntl( $scope, $routeParams, $http, $rootScope, tcm_model) {

    $scope.plugins = {
        'jira': {
            'id': null,
            'enabled': false,
            'props': null
        }
    }


    tcm_model.getProjectPlugins($rootScope.currentProject, function(data){
        var jiraData = [];

        data.forEach(function(elmnt, index){
            if(elmnt.name === 'Jira' ){

                $scope.plugins.jira.id = elmnt.id

                if(elmnt.prop === 'enabled'){
                    $scope.plugins.jira.enabled = (elmnt.value === '1')? true:false;
                }else{
                    jiraData.push({
                        'prop': elmnt.prop,
                        'value': elmnt.value
                    });
                }

            }

        })

        $scope.plugins.jira.props = jiraData;

    });


    $scope.saveJira = function(){

        $scope.plugins.jira.props.forEach(function(elemnt, index){

            tcm_model.updatePluginProperty($scope.plugins.jira.id, elemnt.prop, elemnt.value, function(){

            }, function(){
                console.log('error');
            });
        })

    };

}
PluginsCntl.$inject = [ '$scope', '$routeParams', '$http', '$rootScope', 'tcm_model'];