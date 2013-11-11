

function ManagerCntl($scope, $routeParams, $http, $rootScope, tcm_model) {
	
	$scope.showRight = true;
	$scope.middleWidth = {
		width: window.innerWidth - 325
	};


    $scope.getWidth = function() {
        return window.innerWidth;
    };

    $scope.$watch($scope.getWidth, function(newValue, oldValue) {
    	newWidth = ($scope.showRight == false)? newValue - 325: newValue - 661;
        $scope.middleWidth = {
			width: newWidth
		};
    });

    $scope.$watch('showRight', function(value, old){
    	if(value == old){
    		return false;
    	}

    	newWidth = ($scope.showRight == false)? $scope.getWidth() - 325: $scope.getWidth() - 661;

        $scope.middleWidth = {
			width: newWidth
		};
		$scope.$apply();

    })

    window.onresize = function(){
        $scope.$apply();
    }





	$scope.resetCurrentRequester = function(){
		$scope.currentRequester = {
			id:'none',
			type:''
		};
	}

	$scope.resetCurrentRequester();

	$scope.features = [];
	
	$scope.clearFtrTests = function(){
		$scope.features = [];
		$scope.featureSelected = false;
		$scope.resetCurrentRequester();
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
	
	if($routeParams.projectId !== null){
		$scope.releases =  tcm_model.Releases.query();
	}
	
	//

	$scope.placeholders = {
		feature : {
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

	$rootScope.$on('tcStatusUpdated', function(event, message){
		$scope.featureUpdateTCsatus(message.featureId);
	});

	$rootScope.$on('tcDeleted', function(event, message){
		$scope.featureUpdateTCsatus(message.featureId);
	});

	$rootScope.$on('featureDeleted', function(event, message){
		$scope.features = _.without($scope.features, _.findWhere($scope.features, {featureId: message.featureId}));
		//$scope.testcases = [];
	});



	$scope.selectFeature = function(feature){
		$rootScope.dragedObjects = [];

		_.each($scope.features, function(obj){
			obj.current = false;
		})
		var setCurrent = _.findWhere($scope.features, {featureId: feature.featureId});
		setCurrent.current = true;

		$scope.currentRequester.id = feature.featureId
		$scope.currentRequester.type = "feature"
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


}
ManagerCntl.$inject = ['$scope', '$routeParams', '$http', '$rootScope', 'tcm_model'];