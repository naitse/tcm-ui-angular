tcmModule.directive('ngFeatures', function(){
   return {
      restrict: 'E',
      transclude: true,
      scope:{requester:'=', btns:'='},
      templateUrl: 'app/partials/features.html',
       controller: ["$scope", "$element", "$attrs", "$rootScope", 'tcm_model', function($scope, element, $attrs, $rootScope, tcm_model){

       	$scope.features = [];
		$scope.featureSelected = false;

   		$scope.clearFtrTests = function(){
			$scope.features = [];
			$scope.featureSelected = false;
		}


   		$scope.placeholders = {
			feature : {
				delete:'Sure?'
			}
		}

          $scope.$watch("requester.IterId",function(value){
          	$scope.clearFtrTests()
          		if(typeof value == 'undefined'){
          			return false;
          		}
              if(value != ''){
                if(value != 'none'){
                  $scope.getFeatures()
                  $scope.$parent.hideButtons = false
                }else{
                	$scope.clearFtrTests()
                  $scope.$parent.hideButtons = true
                }
              }else{
              	$scope.clearFtrTests()
                  $scope.$parent.hideButtons = true
              }
          })

       	$scope.getFeatures = function(){
			tcm_model.Features.query({iterationId:$scope.requester.IterId}, function(data){
				$scope.features = data;
				$scope.extendFeatures();
				if(typeof $scope.requester.callback != 'undefined'){
					$scope.requester.callback();
				}
			})
		}

		$scope.extendFeatures = function(){
			_.each($scope.features, function(obj){
				_.extend(obj, {type:'feature', editMode: false, featureTemp:{}, delete:false, current:false});
			});
		}

		$scope.selectFeature = function(feature){
			$rootScope.dragedObjects = [];

			_.each($scope.features, function(obj){
				obj.current = false;
			})
			var setCurrent = _.findWhere($scope.features, {featureId: feature.featureId});
			setCurrent.current = true;

			$scope.$parent.setCurrentRequester(feature);
			
		}

		$scope.featureUpdateTCsatus = function(featureId){
			tcm_model.FeatureExecutedTC.query({featureId:featureId},function(executed){
				var data = executed[0];
				var obj = _.findWhere($scope.features, {featureId: featureId})
				_.extend(obj, data);
			})
		}

		///////////////////////////////

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


	
      }],

       link: function (scope, element, attrs) {
              
       }
   }
});