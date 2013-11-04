

function ManagerCntl($scope, $routeParams, $http, $rootScope, tcm_model) {
	$scope.features = [];
	$scope.testcases = [];
	$rootScope.dragedObjects = [];
	// $scope.closeUpdatedd = true;

	$scope.clearFtrTests = function(){
		$scope.features = [];
		$scope.featureSelected = false;
		$scope.testcases = [];
	}

	$scope.featureSelected = false;

	$('.testcase').draggable({revert:true,helper:'clone'})

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
	
	if($routeParams.projectId !== null){
		$scope.releases =  tcm_model.Releases.query();
	}
	
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

	$scope.featureUpdateTCsatus = function(featureId){
		tcm_model.FeatureExecutedTC.query({featureId:featureId},function(executed){
			var data = executed[0];
			var obj = _.findWhere($scope.features, {featureId: featureId})
			_.extend(obj, data);
		})
	}

	$rootScope.$on('tcStatusUpdated', function(event, parameters){
		$scope.featureUpdateTCsatus(parameters.featureId);
	});

	$rootScope.$on('tcDeleted', function(event, parameters){
		$scope.testcases = _.without($scope.testcases, _.findWhere($scope.testcases, {tcId: parameters.tcId}));
		$scope.featureUpdateTCsatus(parameters.featureId);
	});

	$rootScope.$on('featureDeleted', function(event, parameters){
		$scope.features = _.without($scope.features, _.findWhere($scope.features, {featureId: parameters.featureId}));
		$scope.testcases = [];
	});

	$rootScope.$on('featureCurrentTCadded', function(event, parameters){
		$scope.updateTestCasesList(parameters.featureId, parameters.tc)
	});


	$scope.updateTestCasesList = function(featureId, tc){
		var extended = tc
		extended.featureId = featureId;
		$scope.extendSingleTC(extended);
		$scope.testcases.push(extended);
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
          $scope.extendSingleTC(obj);//_.extend(obj, {type:'test', editMode: false, tcTemp:{}, delete:false, current:false, dropDownClose:true, checked: false});
        });
      }

      $scope.extendSingleTC = function(singletc) {
      	_.extend(singletc, {type:'test', editMode: false, tcTemp:{}, delete:false, current:false, dropDownClose:true, checked: false});
      }

	$scope.extendFeatures = function(){
		_.each($scope.features, function(obj){
			_.extend(obj, {type:'feature', editMode: false, featureTemp:{}, delete:false, current:false});
		});
	}

	$scope.isEmpty = function(string){
		var result = /^\s*$/.test(string) || (string === null);
		return result;
	}

	$scope.loguea = function(item){
		console.log(item)
		item.dropDownClose = false;
	}

}
ManagerCntl.$inject = ['$scope', '$routeParams', '$http', '$rootScope', 'tcm_model'];