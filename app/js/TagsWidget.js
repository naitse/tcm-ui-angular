tcmModule.directive('ngTagsWidget', function(){
   return {
       restrict: 'E',
       transclude: true,
       templateUrl: 'app/partials/tagswidget.html',
       scope:{ 
          test: '='
        },
       controller: ["$scope", "$element", "$attrs", "$rootScope",'tcm_model', function($scope, element, $attrs, $rootScope, tcm_model){


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