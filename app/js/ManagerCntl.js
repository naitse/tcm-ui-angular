

function ManagerCntl($scope, $routeParams, $http, $rootScope, tcm_model) {
	$scope.features = [];
	$scope.testcases = [];
	$scope.closeUpdatedd = true;

	$scope.clearFtrTests = function(){
		$scope.features = [];
		$scope.featureSelected = false;
		$scope.testcases = [];
	}

	$scope.featureSelected = false;

	//export to a directive

	$scope.releases = [];

	$scope.clearIterations = function(){
		$scope.iterations = [];
		$scope.iteration = {
			open:false,
			iterationName: 'Select Iteration',
			IterId:null		
		}
	}

	$scope.clearRelease = function(){
		$scope.release = {
			open:false,
			releaseName:'',
			id:null		
		}
	}

	$scope.clearRelease();
	$scope.clearIterations();

	$scope.selectRelease = function(rel){
		$scope.clearRelease();
		$scope.clearIterations();
		$scope.clearFtrTests();
		$scope.release.open = false;
		$scope.release.releaseName =  rel.releaseName;
		$scope.release.id =  rel.id;
		
		tcm_model.Iterations.query({releaseId: $scope.release.id}).$promise.then(function(data){
			$scope.iterations = data;
		})

	}

	$scope.selectIteration = function(iter){
		$scope.clearFtrTests();
		$scope.iteration.open = false;
		$scope.iteration.iterationName =  iter.iterationName;
		$scope.iteration.IterId =  iter.IterId;
		$scope.getFeatures();
	}
	
	tcm_model.Releases.query(function(data){
		$scope.releases = data;
	});
	
	//

	$scope.placeholders = {
		feature : {
			delete:'Sure?'
		},
		testcase : {
			delete:'Sure?'
		}
	}

	$scope.getFeatures = function(){
		tcm_model.Features.query({iterationId:$scope.iteration.IterId}, function(data){
			$scope.features = data;
			$scope.extendFeatures()
		})
	}

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
			$scope.testcases = [];
			$scope.featureSelected = false;
		})

	}

	$scope.extendFeatures = function(){
		_.each($scope.features, function(obj){
			_.extend(obj, {editMode: false, featureTemp:{}, delete:false, current:false});
			// tcm_model.FeatureExecutedTC.query({featureId:obj.featureId},function(executed){
			// 	var data = executed[0];
			// 	_.extend(obj, {executed: data});
			// })
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
			$scope.extendTcs();
			$scope.featureSelected = true;
		})

	}

	$scope.extendTcs = function(data){
		_.each($scope.testcases, function(obj){
			_.extend(obj, {editMode: false, tcTemp:{}, delete:false, current:false, dropDownClose:true});
		});
		
	}


	//TCs

	$scope.selectTc= function(tc){
		_.each($scope.testcases, function(obj){
			obj.current = false;
		})

		var setCurrent = _.findWhere($scope.testcases, {tcId: tc.tcId});
		setCurrent.current = true;
	}

	$scope.editTC = function(tc){
		tc.editMode = true; 
		var temp = angular.copy(tc);
		tc.tcTemp = temp;
	}

	// $scope.updateTCstatus = function(tc, statusId){
	// 	tcm_model.TestCasesUpdateStatus.update({tcId: tc.tcId, statusId: statusId, actualResult:''}, function(data){
	// 		tc.statusName = data.name;
	// 		// console.log(data)
	// 	})
	// }

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



	$scope.loguea = function(item){
		console.log(item)
		item.dropDownClose = false;
	}

}
ManagerCntl.$inject = ['$scope', '$routeParams', '$http', '$rootScope', 'tcm_model'];