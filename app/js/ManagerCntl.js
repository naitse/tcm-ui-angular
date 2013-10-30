

function ManagerCntl($scope, $routeParams, $http, $rootScope, tcm_model) {
	$scope.features = [];

	tcm_model.getFeatures(32).then(function(data){
		$scope.features = data.data;
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