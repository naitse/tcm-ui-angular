tcmModule.directive('ngFeatures', function(){
   return {
      restrict: 'E',
      transclude: true,
      scope:{requester:'=', btns:'=', droppable:'@drop', hidenotcurrent:'@hidenotcurrent'},
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
				_.each($scope.features,function(feature){
					if(feature.featureType == 1){
						tcm_model.JiraIssue.get({key:feature.jiraKey}, function(jira){
							feature.featureDescription = jira.fields.description;
							feature.loading = false;
							feature.remote = jira
							//  _.each(feature.remote.fields.comment.comments,function(comment){
							// 	comment.body = $scope.parseCommentBody(comment.body);
							// })
						})
					}else{
						feature.loading = false;
					}
					
				})
				$scope.extendFeatures();
				if(typeof $scope.requester.callback != 'undefined'){
					$scope.requester.callback();
				}
			})
		}

		$scope.extendFeatures = function(){
			_.each($scope.features, function(obj){
				_.extend(obj, {type:'feature', editMode: false, featureTemp:{}, delete:false, current:false, hide:false});
			});
		}

		$scope.selectFeature = function(feature){
			$rootScope.dragedObjects = [];

			_.each($scope.features, function(obj){
				obj.current = false;
			})
			var setCurrent = _.findWhere($scope.features, {featureId: feature.featureId});
			setCurrent.current = true;


			if(typeof $scope.hidenotcurrent != 'undefined'){
				if($scope.hidenotcurrent == 'true'){
					$scope.features = [feature]
				}
			}

			$scope.$parent.setCurrentRequester(feature);
			
		}

		$scope.featureUpdateTCsatus = function(featureId){
			tcm_model.FeatureExecutedTC.query({featureId:featureId},function(executed){
				var data = executed[0];
				var obj = _.findWhere($scope.features, {featureId: featureId})
				_.extend(obj, data);
			})
		}

		$scope.updateIssueState = function(feature, transition){

			feature.loading = true;

			var tran = new tcm_model.JiraIssueTransition()

			tran.$save({key: feature.jiraKey, transitionId: transition.id}, function(){
					tcm_model.JiraIssue.get({key:feature.jiraKey}, function(jira){
						feature.featureDescription = jira.fields.description;
						feature.loading = false;
						feature.remote = jira
					})
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

	
		$scope.parseCommentBody= function(comment){
			var comment = comment.split('{code}')
			var parsed = comment[0];
			_.each(comment, function(section, index){
				if(isOdd(index)){
					parsed += '<div class="code-line">' + section + '</div>'
				}
			})
			console.log(parsed += _.last(comment));
			return parsed += _.last(comment)

		}
		function isOdd(num) { return num % 2;}

      }],

       link: function (scope, element, attrs) {
              
       }
   }
});