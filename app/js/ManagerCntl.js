

function ManagerCntl($scope, $routeParams, $http, $rootScope, tcm_model) {
	$scope.features = [];
	$scope.testcases = [];

	$scope.placeholders = {
		feature : {
			delete:'Sure?'
		},
		testcase : {
			delete:'Sure?'
		}
	}

	tcm_model.Features.query({iterationId:15}, function(data){
		$scope.features = data;
		$scope.extendFeatures()
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
		feature.$update();
	}

	$scope.deleteFeature = function(feature){
		$scope.placeholders.feature.delete = "Deletting...";

		feature.$delete(function(){
			$scope.features = _.without($scope.features, _.findWhere($scope.features, {featureId: feature.featureId}));
			$scope.placeholders.feature.delete = "Sure?";
		})

	}

	$scope.extendFeatures = function(){
		_.each($scope.features, function(obj){
			_.extend(obj, {editMode: false, featureTemp:{}, delete:false, current:false});
			tcm_model.FeatureExecutedTC.query({featureId:obj.featureId},function(executed){
				var data = executed[0];
				_.extend(obj, {executed: data});
			})
		});
	}

	$scope.getTestCases = function(feature){
		_.each($scope.features, function(obj){
			obj.current = false;
		})

		var setCurrent = _.findWhere($scope.features, {featureId: feature.featureId});
		setCurrent.current = true;

		tcm_model.TestCases.query({featureId: feature.featureId},function(data){
			$scope.testcases = data;
			$scope.extendTcs()
		})

	}

	$scope.extendTcs = function(data){
		_.each($scope.testcases, function(obj){
			_.extend(obj, {editMode: false, tcTemp:{}, delete:false, current:false});
		});
		
	}


	//TCs

	$scope.editTC = function(tc){
		tc.editMode = true; 
		var temp = angular.copy(tc);
		tc.tcTemp = temp;
	}
	$scope.cancelEditTC = function(tc){
		tc.editMode = false; 
		tc.name = tc.tcTemp.name
		tc.description = tc.tcTemp.description
	}

	$scope.saveTC = function(tc){
		tc.editMode = false;
		var temp = angular.copy(tc);
		tc.$update();
	}

	$scope.deleteTC = function(tc){
		$scope.placeholders.testcase.delete = "Deletting...";
		tc.$delete(function(){
			$scope.testcases = _.without($scope.testcases, _.findWhere($scope.testcases, {tcId: tc.tcId}));
			$scope.placeholders.testcase.delete = "Sure?";
		})

	}



}
ManagerCntl.$inject = ['$scope', '$routeParams', '$http', '$rootScope', 'tcm_model'];