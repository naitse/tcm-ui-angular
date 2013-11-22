tcmModule.directive('ngFeatures', function(){
   return {
      restrict: 'E',
      transclude: true,
      scope:{requester:'=', btns:'=', droppable:'@drop', hidenotcurrent:'@hidenotcurrent'},
      templateUrl: 'app/partials/features.html',
       controller: ["$scope", "$element", "$attrs", "$rootScope", 'tcm_model', function($scope, element, $attrs, $rootScope, tcm_model){

       	$scope.btnConfig = (typeof $scope.btns == 'undefined')?{}:$scope.btns;

       	$scope.features = [];
		$scope.featureSelected = false;

   		$scope.clearFtrTests = function(){
			$scope.features = [];
			$scope.featureSelected = false;
		}

        $scope.resetNewFeature = function(){
          $scope.newFeature = {
            create:false,
            name:'',
            key:'',
            description:'',
            type:2,
            iterationId: $scope.requester.IterId
          }
        }
		
		$scope.resetNewFeature();

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
              $scope.resetNewFeature();
          })

       	$scope.getFeatures = function(){
			$scope.statuses = [];
				              	$scope.statusFilter = {
	              		name:'All',
	              		iconUrl:'/assets/images/all_icon.gif'
              		};	
			tcm_model.Features.query({iterationId:$scope.requester.IterId}, function(data){
				$scope.features = data;
				if($scope.btnConfig.hideFeatureActions != true){
					_.each($scope.features,function(feature){
						if(feature.featureType == 1){
							feature.loading = true;
							tcm_model.JiraIssue.get({key:feature.jiraKey}, function(jira){
								feature.featureDescription = jira.fields.description;
								feature.loading = false;
								feature.remote = jira
								if(typeof _.findWhere($scope.statuses, {name:jira.fields.status.name}) == 'undefined'){
									$scope.statuses.push(jira.fields.status)
								}
							})
						}
						
					})
				}
				$scope.extendFeatures();
				if(typeof $scope.requester.callback != 'undefined'){
					$scope.requester.callback();
				}
			})
		}

		$scope.extendFeatures = function(){
			_.each($scope.features, function(obj){
				_.extend(obj, {type:'feature', editMode: false, featureTemp:{}, delete:false, current:false, hide:false,loading:false});
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
				feature.loading = true;
					tcm_model.JiraIssue.get({key:feature.jiraKey}, function(jira){
						feature.featureDescription = jira.fields.description;
						feature.loading = false;
						feature.remote = jira;
						$scope.refreshStatuses();
						$scope.filterFeatures();
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


/* NEW TCs */

      $scope.createFeature =  function(){
        if($scope.newFeature.create == true){
          return false;
        }
        $scope.newFeature.create = true;
      }

      $scope.saveNewFeature = function(){

        var temp = new tcm_model.Features($scope.newFeature)

        temp.$save(function(data){
          $scope.features.push(data)
          // $rootScope.$broadcast('tcStatusUpdated', {featureId: $scope.requester.id});
          $scope.resetNewFeature();
        })

      }

      $scope.cancelNewFeature = function(){

        $scope.resetNewFeature()

      }

            ///////////////DD actions
          	$scope.statusFilter = {
              		name:'All',
              		iconUrl:'/assets/images/all_icon.gif'
          	};

            $scope.filterByStatus=function(status){
            	$scope.statusDDClosed = true;
            	$scope.statusFilter = status
            	if(status == 'all'){
	              	$scope.statusFilter = {
	              		name:'All',
	              		iconUrl:'/assets/images/all_icon.gif'
              		};
            	}

            	$scope.filterFeatures();
            }


            $scope.filterFeatures = function(){
            	_.each($scope.features,function(feature){
            		if(feature.remote.fields.status.id != $scope.statusFilter.id && $scope.statusFilter.name != 'All'){
            			feature.hide = true;
            		}else{
            			feature.hide = false;
            		}
            	})

            	if(typeof _.findWhere($scope.features, {hide:false}) == 'undefined'){
	              	$scope.statusFilter = {
	              		name:'All',
	              		iconUrl:'/assets/images/all_icon.gif'
              		};
            		$scope.filterFeatures();
            	}

            }


            $scope.refreshStatuses = function(){
            	$scope.statuses = [];
            	_.each($scope.features,function(feature){
					if(typeof _.findWhere($scope.statuses, {name:feature.remote.fields.status.name}) == 'undefined'){
						$scope.statuses.push(feature.remote.fields.status)
					}
            	})

            }

        		$scope.statuses = [];
              $scope.setDdDefaults = function(){
				$scope.statusDDClosed = true
                $scope.hovered = false
              }

              $scope.setDdDefaults();

              $scope.openDD = function(){
                $scope.statusDDClosed = false
              }

              $scope.tryCloseDD = function(){

                if(!$scope.statusDDClosed){
                  setTimeout(function(){
                    $scope.$apply(
                      function(){
                        if(!$(element).find('.dropdown-menu').hasClass('hovered')){
                          $scope.setDdDefaults();
                        }
                      }
                    )
                  }, 300);
                }

              }


      }],

       link: function (scope, element, attrs) {
              
       }
   }
});