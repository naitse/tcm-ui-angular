tcmModule.directive('ngFeatures', function(){
   return {
      restrict: 'E',
      transclude: true,
      scope:{requester:'=', btns:'=', droppable:'@drop', hidenotcurrent:'@hidenotcurrent'},
      templateUrl: 'app/partials/features.html',
       controller: ["$scope", "$element", "$attrs", "$rootScope", 'tcm_model', '$timeout','draggedObjects', '$routeParams',  function($scope, element, $attrs, $rootScope, tcm_model, $timeout, DO, $routeParams){

       	$scope.btnConfig = (typeof $scope.btns == 'undefined')?{}:$scope.btns;

       	$scope.features = [];
		$scope.featureSelected = false;
        $scope.suiteDroppable = false;
        $rootScope.$on('suiteDragStart', function(event, message){
           $scope.suiteDroppable = true;
        })
        $rootScope.$on('suiteDragRevert', function(event, message){
           $scope.suiteDroppable = false;
        })


        $scope.handleSuiteDrop = function(){
            DO.dropSuiteOnFeatureContainer($scope.requester, $scope)
        }

   		$scope.clearFtrTests = function(){
			$scope.features = [];
			$scope.featureSelected = false;
		}

        $scope.resetNewFeature = function(){
          $scope.linkToJira = false
          $scope.isAutomation = false
          $scope.newFeature = {
            automanual:1,
            create:false,
            featureName:'',
            jiraKey:'',
            featureDescription:'',
            featureType:2,
            iterationId: $scope.requester.IterId,
            projectId:$routeParams.projectId,
            reportUrl:'',
            reportType:0,
            total:0,
            pass:0,
            failed:0
          }
        }

		$scope.resetNewFeature();

   		$scope.placeholders = {
			feature : {
				delete:'Delete?'
			}
		}

          $scope.$watch("requester.IterId",function(value){
          	$scope.clearFtrTests()
          		if(typeof value == 'undefined'){
          			return false;
          		}
              if(value != ''){
                if(value != 'none'){
                  $timeout($scope.getFeatures, 2000);
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
    		iconUrl:'/assets/images/all_icon.gif',
        style:"-1px -17px;background-size: 16;"
  		};
			tcm_model.Features.query({iterationId:$scope.requester.IterId}, function(data){
				$scope.features = data;
				if($scope.btnConfig.hideFeatureActions != true){
					_.each($scope.features,function(feature){
              fetchJiraData(feature);
              //fetchAutomationData(feature);
					})
				}
				$scope.extendFeatures();
				if(typeof $scope.requester.callback != 'undefined'){
					$scope.requester.callback();
				}
			})
		}

    function fetchJiraData(feature){
      if(feature.featureType == 1){
      feature.loading = true;

      tcm_model.JiraIssue.get({key:feature.jiraKey}, function(jira){
        $scope.$apply(function(){
          feature.featureDescription = jira.fields.description;
          _.extend(jira.fields.status, {style:"-1px -1px;"})
          feature.loading = false;
          feature.remote = jira
          if(typeof _.findWhere($scope.statuses, {name:jira.fields.status.name}) == 'undefined'){
              $scope.statuses.push(jira.fields.status)
          }
        })
      })
      }
    }

    // function fetchAutomationData(feature){
    //   if(feature.featureType == 4){
    //   feature.loading = true;

    //   tcm_model.AutomationFeatures.get({iterationId:$scope.requester.IterId, featureId: feature.featureId}, function(aurecord){
    //     //$scope.$apply(function(){
    //       feature.total = aurecord.total;
    //       feature.pass = aurecord.pass;
    //       feature.failed = aurecord.failed;
    //       feature.remote = aurecord
    //     //})
    //   })
    //   }
    // }

		$scope.extendFeatures = function(){
			_.each($scope.features, function(obj){
				$scope.extendSingleFeature(obj)
			});
		}

		$scope.extendSingleFeature = function(obj){
			lo = false
			if(obj.featureType == 1 && $scope.btnConfig.hideFeatureActions != true){
				lo = true
			}
			_.extend(obj, {type:'feature', editMode: false, featureTemp:{}, delete:false, current:false, hide:false,loading:lo});
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
				try{_.extend(obj, data);}catch(e){}
			})
		}

		$scope.updateIssueState = function(feature, transition){

			feature.loading = true;

			var tran = new tcm_model.JiraIssueTransition()

			tran.$save({key: feature.jiraKey, transitionId: transition.id}, function(){
				feature.loading = true;
					tcm_model.JiraIssue.get({key:feature.jiraKey}, function(jira){
            $scope.$apply(function(){
              feature.loading = false;
              if (jira != null){
                feature.featureDescription = jira.fields.description;
                feature.remote = jira;
                $scope.refreshStatuses();
                $scope.filterFeatures();
              }
            })
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
      if(message.feature.current == true){
        $scope.$parent.resetCurrentRequester();
      }
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


/* NEW Features */

      $scope.createFeature =  function(){
        if($scope.newFeature.create == true){
          return false;
        }
        $scope.newFeature.create = true;
      }

      $scope.checkLinkToJira = function(){
        $scope.linkToJira = !$scope.linkToJira
      }

      $scope.checkIsAutomation = function(){
        $scope.isAutomation = !$scope.isAutomation
      }

      $scope.saveNewFeature = function(){
        
        if($scope.linkToJira){
          $scope.newFeature.featureType = 1
        }

        if($scope.isAutomation){
          $scope.newFeature.featureType = 4
        }

        var temp = new tcm_model.Features($scope.newFeature)

        temp.$save(function(data){
        	$scope.extendSingleFeature(data);
          
          if(temp.featureType == 4){
            $scope.features.push($scope.newFeature);    
          }else{
            $scope.features.push(data);
          }
          fetchJiraData(data);
          // $rootScope.$broadcast('tcStatusUpdated', {featureId: $scope.requester.id});
          // $scope.cancelNewFeature();
          $scope.cancelNewFeature();
        })

      }

    $scope.cloneFeature = function(feature){
    	feature.clone = true;
        var temp = new tcm_model.Features(feature)

        temp.$save(function(data){
        	$scope.extendSingleFeature(data);

          $scope.features.push(data);
          // $rootScope.$broadcast('tcStatusUpdated', {featureId: $scope.requester.id});
          $scope.cancelNewFeature();
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
	              		iconUrl:'/assets/images/all_icon.gif',
                    style:"-1px -17px;background-size: 16;"
              		};
            	}

            	$scope.filterFeatures();
            }


            $scope.filterFeatures = function(){
            	_.each($scope.features,function(feature){
                if(feature.featureType == 1){
              		if(feature.remote.fields.status.id != $scope.statusFilter.id && $scope.statusFilter.name != 'All'){
              			feature.hide = true;
              		}else{
              			feature.hide = false;
              		}
                }else if($scope.statusFilter.name != 'All'){
                  feature.hide = true
                }else{
                  feature.hide = false
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
                if(feature.featureType == 1){
        					if(typeof _.findWhere($scope.statuses, {name:feature.remote.fields.status.name}) == 'undefined'){
        						$scope.statuses.push(feature.remote.fields.status)
        					}
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




//////////////////////////////////////////////////Sync

    $scope.iterations = tcm_model.JiraIterations.get();
    $scope.selection = {
        jiraIteration: null,
        iteration: null
    }

    $scope.alerts = [

    ];

    $scope.$watch("selection.jiraIteration", function(value){
        if(value != null){
            $scope.issues = tcm_model.JiraIssues.get({id: value});
        }

    });

    $scope.$watch('completedSelecteAll', function(val){
        if($scope.issues== null){return;}
        $scope.issues.contents.completedIssues.forEach(function(element){
            element.selected = val;
        })
    })

    $scope.$watch('incompletedSelecteAll', function(val){

        if($scope.issues== null){return;}
        $scope.issues.contents.incompletedIssues.forEach(function(element){
            element.selected = val;
        })
    })

    $scope.syncronize = function(){
        var issuesToSync = new Array();

        $scope.getIssuesToSync($scope.issues.contents.completedIssues, issuesToSync)
        $scope.getIssuesToSync($scope.issues.contents.incompletedIssues, issuesToSync)

        var newFeatureBulk = new tcm_model.FeaturesBulk({id: $scope.requester.IterId, projectId:$routeParams.projectId});

        newFeatureBulk.issues = issuesToSync;
        newFeatureBulk.$save(function(){
            $('#modal-sync').modal('hide');
            $scope.selection = {
                jiraIteration: null,
                iteration: null
            }
            $scope.issues = null;
            setTimeout(function(){
              $scope.getFeatures();  
            },2000);
            
        });

    }

    $scope.closeSync = function(){
                  $scope.selection = {
                jiraIteration: null,
                iteration: null
            }
            $scope.issues = null;
    }

    $scope.getIssuesToSync = function(issues, issuestoSync){
        issues.forEach(function(feature){
            if(feature.selected != null && feature.selected){
                issuestoSync.push({
                    key : feature.key,
                    name : feature.summary,
                    type : 1
                });
            }
        })
    }

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.releasesIterations = tcm_model.ReleasesIterations.query();              


      }],

       link: function (scope, element, attrs) {

       }
   }
});
