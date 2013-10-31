

function ManagerCntl($scope, $routeParams, $http, $rootScope, tcm_model) {
	$scope.features = [];

	tcm_model.Features.query({iterationId:32}, function(data){
		$scope.features = data;
		console.log($scope.features);
		_.each($scope.features, function(obj){
			_.extend(obj, {editMode: false, featureTemp:{}, delete:false});
		});
	})

	$scope.editFeature = function(feature){
		feature.editMode = true; 
		var temp = angular.copy(feature);
		feature.featureTemp = temp;
	}
	$scope.cancelEditFeature = function(feature){
		feature.editMode = false; 
		feature.featureName = feature.featureTemp.featureName
	}
	$scope.saveFeature = function(feature){
		feature.editMode = false;
		var temp = angular.copy(feature);
		console.log(temp)

		feature.$update();
	}

	$scope.deleteFeature = function(feature){

		feature.$delete(function(){
			$scope.features = _.without($scope.features, _.findWhere($scope.features, {featureId: feature.featureId}));
		})

	}

}
ManagerCntl.$inject = ['$scope', '$routeParams', '$http', '$rootScope', 'tcm_model'];