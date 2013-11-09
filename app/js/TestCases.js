tcmModule.directive('ngTestcases', function(){
   return {
      restrict: 'E',
      transclude: true,
      scope:{requester:'='},
      templateUrl: 'app/partials/testcases.html',
       controller: ["$scope", "$element", "$attrs", "$rootScope", 'tcm_model', function($scope, element, $attrs, $rootScope, tcm_model){


        $scope.showTCdelete = false
        $scope.selectall = false
        $scope.hideButtons = true;

        $scope.resetTestcasesObject = function(){
          $scope.testcases = [];
          for(var cs = $scope.$$childHead; cs; cs = cs.$$nextSibling) {
              cs.$destroy();
          }
        }

        $scope.resetNewTestcase = function(){
          $scope.newTC = {
            create:false,
            name:'',
            description:''
          }
        }

        $scope.resetTestcasesObject();
        $scope.resetNewTestcase();


          $scope.$watch("requester.id",function(value){

            $scope.resetTestcasesObject();
              if(value != ''){
                if(value != 'none'){
                  $scope.getTestCases()
                  $scope.hideButtons = false
                }else{
                  $scope.hideButtons = true
                }
              }else{
                  $scope.hideButtons = true
              }
          })

          $scope.getTestCases = function(){
            $scope.resetTestcasesObject();
            $scope.resetNewTestcase();
            $scope.selectall = false
            $scope.showTCdelete = false
            tcm_model.TestCases.query({featureId: $scope.requester.id},function(data){
              $scope.$parent.testcases = data;
              $scope.testcases = $scope.$parent.testcases;
              $scope.extendTcs();
            })

          }

        $scope.extendTcs = function(data){
          _.each($scope.testcases, function(obj){
            $scope.extendSingleTC(obj);
          });
        }

        $scope.extendSingleTC = function(singletc) {
          _.extend(singletc, {type:'test', editMode: false, tcTemp:{}, delete:false, current:false, dropDownClose:true, checked:false, draggable:true, dragSingle:false});
        }


        $scope.updateTestCasesList = function(tc){
          var extended = tc
          extended.featureId = $scope.requester.id;
          $scope.extendSingleTC(extended);
            if($scope.areTcsChecked()){
              extended.draggable = false;
            }else{
              extended.draggable = true;
            }
            extended.dragSingle = false;
          $scope.testcases.push(extended);
        }


        $scope.deleteTCsBulk = function(){
          $scope.$broadcast('tcDeleteBulk');
        }
/* NEW TCs */

      $scope.createTC =  function(){
        if($scope.newTC.create == true){
          return false;
        }
        $scope.newTC.create = true;
        $scope.newTC.featureId = $scope.requester.id;
      }

      $scope.saveNewTC = function(){

        var temp = new tcm_model.TestCases($scope.newTC)

        temp.$save(function(data){
          $scope.updateTestCasesList(data)
          $rootScope.$broadcast('tcStatusUpdated', {featureId: $scope.requester.id});
          $scope.resetNewTestcase();
        })

      }

/*******************************************************/

  $rootScope.$on('featureCurrentTCadded', function(event, message){
    $scope.updateTestCasesList(message.tc)
  });


  $scope.tcDeleted = function(tc){
   $scope.testcases = _.without($scope.testcases, _.findWhere($scope.testcases, {tcId: tc.tcId}));
   $scope.updateParentTcArray();
    $rootScope.$emit('tcDeleted', {featureId: tc.featureId});
    $scope.manageDragState();
    $scope.verifyBulkDisplay();
  };

/*******************************************************/


  $scope.tcChecked = function(){
    $scope.manageDragState();
    $scope.verifyBulkDisplay()
 }

$scope.tcUnchecked = function(){
    $scope.manageDragState();
    $scope.verifyBulkDisplay();
 }

     
$scope.$on('tcSelected', function(event, message){
   _.each($scope.testcases, function(obj){
      obj.current = false;
    })
    var setCurrent = _.findWhere($scope.testcases, {tcId: message.tc.tcId});
    setCurrent.current = true;  
 })


     


/*******************************************************/
  
        $scope.updateParentTcArray = function() {
          $scope.$parent.testcases = $scope.testcases;
        }

        $scope.selectAll = function(){
          $scope.testcases.forEach(function(tc){
            tc.checked = ($scope.selectall == true)?false:true;
          });
        }


        $scope.areTcsChecked = function(){
            var count = 0;
            _.each($scope.testcases, function(obj){
              if(obj.checked == true){
                count++
              }
            })
            if(count > 0){
              return true;
            }else {
              return false;
            }
         }

        $scope.manageDragState = function(){
            var count = 0;
              _.each($scope.testcases, function(obj){
                if(obj.checked == true){
                  count++
                }
              })
              if(count == 0){
                  _.each($scope.testcases, function(obj){
                      obj.draggable = true
                  })
              }else{
                   _.each($scope.testcases, function(obj){
                    if(obj.checked != true){
                      obj.draggable = false
                    }
                  })
              }
        }

        $scope.verifyBulkDisplay = function(){

          var count = 0;
              _.each($scope.testcases, function(obj){
                if(obj.checked == true){
                  count++
                }
              })
            if(count > 1){
              $scope.showTCdelete = true;
              $scope.selectall = true
            }else{
              $scope.showTCdelete = false;
              $scope.selectall = false
            }

            if(count == $scope.testcases.length){
              $scope.selectall = true
            }else{
              $scope.selectall = false
            }


        }

        $scope.tcCheckedCount = function(){

          var count = 0;
          _.each($scope.testcases, function(obj){
            if(obj.checked == true){
              count++
            }
          })
          return count;
        }


        $scope.isEmpty = function(string){
          var result = /^\s*$/.test(string) || (string === null);
          return result;
        }
      }],

       link: function (scope, element, attrs) {
              
       }
   }
});