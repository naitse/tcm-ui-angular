tcmModule.directive('ngTagsWidget', function(){
   return {
       restrict: 'E',
       transclude: true,
       templateUrl: 'app/partials/tagswidget.html',
       scope:{ 
          test: '='
        },
       controller: ["$scope", "$element", "$attrs", "$rootScope",'tcm_model', function($scope, element, $attrs, $rootScope, tcm_model){


        $rootScope.$on('tagDeleted', function(event, message){
          $scope.tags = _.without($scope.tags, _.findWhere($scope.tags, {id:message.tagId}))
        })

        $rootScope.$on('tcTagged', function(event, message){
          if(typeof $scope.$parent.requester !== 'undefined' && $scope.$parent.requester.id !== message.parentRequester.id && $scope.$parent.tc.tcId == message.tc.tcId){
            $scope.tags.push(message.tag)
          }
        })

        $scope.tags = [];
        $scope.globalTags = [];
        $scope.loadingTags = false;

        $scope.setDefaults = function(){
          $scope.dropDownClose = true;
          $scope.hovered = false
        }

        $scope.setDefaults();

        $scope.$parent.$watch('tc.tags', function(newVal, oldVal){
          $scope.tags = newVal
        })

        $scope.handleTagInput = function(searchTag){
          var tagFound = false;

          _.each($scope.globalTags, function(tag){
              if(tag.name == searchTag){
                $scope.tagTc(tag);
                $scope.searchTag = ''
                tagFound = true;  
              }
          })

          if(tagFound == false){
            var newTag = new tcm_model.Tags();
            newTag.name = searchTag
            newTag.$save(function(data){
              if(data.FALSE == 0){
                return false;
              }
              $scope.tagTc(data)
              $scope.searchTag = ''
              $rootScope.$broadcast('tagCreated', {tag: data});
            })
          }

        }

        $scope.getTags = function(){
          $scope.globalTags = [];
          $scope.loadingTags = true;
          tcm_model.Tags.query(function(res){
            $scope.globalTags = res;
              _.each($scope.tags, function(tag){
                  $scope.removeFromGtags(tag);
              })
              $scope.loadingTags = false;
          })
        }

        $scope.tagTc = function(tag){
          var tagTc = new tcm_model.TagsTcs({tid:tag.id})
          tagTc.tid = tag.id;
          tagTc.testArray = [$scope.$parent.tc]
          tagTc.$save(function(){
            $rootScope.$broadcast('tcTagged', {tc: $scope.$parent.tc, tag:tag, parentRequester:$scope.$parent.$parent.requester});
            $scope.removeFromGtags(tag)
            $scope.tags.push(tag)
          });
        }

        $scope.unassignTag = function(tag){
          var tcId = $scope.$parent.tc.tcId
          var tagTc = new tcm_model.TagsTcs({tid:tag.id, tcId:tcId})
          tagTc.tid = tag.id;
          tagTc.tcId = tcId;
          tagTc.testArray = [$scope.$parent.tc]
          tagTc.$delete(function(){
            $rootScope.$broadcast('tcUntagged', {tc: $scope.$parent.tc, tag:tag});
            $scope.globalTags.push(tag);
            $scope.removeFromTags(tag)
          });
        }

        $scope.removeFromGtags = function(tag){
          var temArray = [];
          _.each($scope.globalTags, function(letag){
            if(letag.id !== tag.id){
              temArray.push(letag)
            }
          })
          $scope.globalTags = temArray;
        }

        $scope.removeFromTags = function(tag){
          var temArray = [];
          _.each($scope.tags, function(letag){
            if(letag.id !== tag.id){
              temArray.push(letag)
            }
          })
          $scope.tags = temArray;
        }


        $scope.openDD = function(){
          if($scope.dropDownClose == false){
            return false;
          }
          $scope.dropDownClose = false
          $scope.getTags()
        }

        $scope.tryCloseDD = function(){

          if(!$scope.dropDownClose){
            setTimeout(function(){
              $scope.$apply(
                function(){
                  if(!$(element).find('.dropdown-menu').hasClass('hovered')){
                    $scope.setDefaults();
                  }
                }
              )
            }, 300);
          }

        }




       }],

       link: function (scope) {
  
       }
   }
});