

function PluginsCntl( $scope, $routeParams, $http, $rootScope, tcm_model) {

    $scope.plugins = tcm_model.ProjectPlugins.get();


}
PluginsCntl.$inject = [ '$scope', '$routeParams', '$http', '$rootScope', 'tcm_model'];