

function ManagerCntl($scope, $routeParams, $http, $rootScope, tcm_model) {
	$scope.features = [];

	tcm_model.Features.query({iterationId:32}, function(data){
		$scope.features = data;
		_.each($scope.features, function(obj){
			_.extend(obj, {editMode: false, featureTemp:{}});
		});
	})
	
	$scope.editFeature = function(feature){
		feature.featureTemp = angular.copy(feature);

	}
	$scope.cancelEditFeature = function(feature){
		console.log(feature.featureTemp)
	}
	$scope.saveFeature = function(feature){

	}

}
ManagerCntl.$inject = ['$scope', '$routeParams', '$http', '$rootScope', 'tcm_model'];