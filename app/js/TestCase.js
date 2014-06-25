tcmModule.directive('ngTestcase', function(){
   return {
      restrict: 'E',
      transclude: true,
       templateUrl: 'app/partials/testcase.html',
       controller: ["$scope", "$element", "$attrs", "$rootScope", 'tcm_model', 'draggedObjects', 'fileUploader', function($scope, element, $attrs, $rootScope, tcm_model, DO, fileUploader){
        
        $scope.deleteText = ($scope.tc.linked == 0 )?"Delete?":"Unlink?";
        $scope.draggable = $scope.tc.draggable;
        var saveCallback = function(){};

        $scope.$watch('tc.checked', function(newValue, oldValue){
            if (newValue == oldValue) {
              return false;
            }
          if(newValue == true){
            $scope.tc.draggable = newValue;
            $scope.$parent.tcChecked()
          }else{
            $scope.$parent.tcUnchecked()
            if($scope.$parent.areTcsChecked()){
              $scope.draggable = $scope.tc.draggable;
            }else{
              $scope.draggable = true;
            }
          }
        })

        $scope.$watch('tc.draggable', function(newValue, oldValue){
            if (newValue == oldValue) {
              return false;
            }

            $scope.draggable = $scope.tc.draggable;
        })

        
        $scope.selectTc= function(){
          if($scope.tc.current == true){
            $scope.tc.current = false;
          }else{
            $scope.tc.current = true;
          }
        }

        $scope.editTC = function(tc){
          tc.current = true;
          tc.editMode = true;
          tc.updateParent = false; 
          tc.tcTemp = angular.copy(tc);
        }

        $scope.cancelEditTC = function(tc){
          tc.editMode = false; 
          if(tc.delete == true){
            return false;
          }
          tc.name = tc.tcTemp.name
          tc.description = tc.tcTemp.description

          tc.attachments =_.reject(tc.attachments, function(item) { return item.id == 0 });
          $scope.attachmentsToDelete = null;

        }

        $scope.checkTC = function(event){
          event.stopPropagation();
          $scope.tc.checked = ($scope.tc.checked == true)?false:true;
        }

        $scope.saveTC = function(tc){
          $scope.tc.editMode = false;



          if($scope.tc.linked == 1){

            var newTc = new tcm_model.TestCasesCloneTC({tcId:$scope.tc.tcId});
            newTc.sid = $scope.$parent.requester.id
            newTc.name = $scope.tc.name
            newTc.description = $scope.tc.description
            newTc.priority = $scope.tc.priority
            newTc.$update(function(data){

            })

            return false;

          }


          $scope.tc.sid = $scope.$parent.requester.id
          $scope.tc.featureId = $scope.$parent.requester.id
          $scope.tc.tid = $scope.$parent.requester.id
          $scope.tc.$update(function(data){

              if($scope.attachmentsToDelete != null && $scope.attachmentsToDelete.length ){
                var aux = $scope.attachmentsToDelete.slice(0);

                $scope.attachmentsToDelete = null;

                aux.forEach(function(attach){

                    var TCattach = new tcm_model.TestCaseAttachment({featureId:$scope.$parent.requester.id,
                        tcId: $scope.tc.tcId,
                        attId: attach.id });


                    TCattach.key = attach.key
                    TCattach.$deleteAttach();
                });

              }

              fileUploader.upload({featureId: $scope.$parent.requester.id,
                  tcId: $scope.tc.tcId}, function(){

              }, function(res){

                  var attachments =_.reject($scope.tc.attachments, function(item) { return item.id == 0 });
                  $scope.tc.attachments = _.union(attachments, res.data);

              }, function(){

              });

          });

        }

        $scope.setAutomation = function(tc){

            tc.automated = (tc.automated != 0)?0:1;
            $scope.tc.$update(function(data){});

        }

        $scope.deleteAttachment = function(file, index){
            if(file.id != 0){
                if($scope.attachmentsToDelete == null){
                    $scope.attachmentsToDelete = [];
                }
               $scope.attachmentsToDelete.push(file);
            }

            fileUploader.removeFile(file, $scope.tc.tcId);
            $scope.tc.attachments.splice(index, 1);
        }

        $scope.getTcId = function(){
          return $scope.tc.tcId;
        }

        $scope.deleteTC = function(){

          if($scope.$parent.requester.type=='suite' && $scope.tc.linked == 1){
              var temp = new tcm_model.SuiteTestsLink()
              temp.sid = $scope.requester.id;
              temp.testArray = [$scope.tc]
              temp.$unlink(function(data){
                _.each(data.response,function(tc){
                  $scope.removeTCfromScope(tc);
                })
                $rootScope.$broadcast('suiteTcUnLinked', {suiteId: $scope.requester.id, tcArray:data.response});
              })
            return false;
          }


          if($scope.$parent.requester.type=="tag"){
            var toDel =  new tcm_model.TagsTcs({tid:$scope.$parent.requester.id, tcId:$scope.tc.tcId});
            toDel.$delete(function(){
              $scope.tcUntagged($scope.tc);
            })
            return;
          }

          $scope.deleteText = "OMG!";
          $scope.tc.delete = true;
          $scope.tc.sid = $scope.$parent.requester.id
          $scope.tc.featureId = $scope.$parent.requester.id
          $scope.tc.tid = $scope.$parent.requester.id
          $scope.tc.$delete(function(){
              $scope.tcDeleted($scope.tc);
              $scope.$destroy()
          })
        }

        $scope.cloneTc = function(tc){
            var contraryPanel = _.without($rootScope.draggedObjects,_.findWhere($rootScope.draggedObjects,{id:$scope.$parent.uuid}))
              if($scope.$parent.requester.type == 'feature'){
                  $scope.$parent.cloneTcBulk([tc])
              }else if($scope.$parent.requester.type == 'tag'){
                  newTc.tid = $scope.$parent.requester.id
              }else if($scope.$parent.requester.type == 'suite'){
                    $scope.$parent.cloneTCSuiteBulk([tc.tcId]);

              }
              
        }

        $scope.updateTCStatusonDB = function(statusId, callback){
          tcm_model.TestCasesUpdateStatus.update({tcId: $scope.tc.tcId, statusId: statusId, actualResult:$scope.tc.actualResult}, function(data){
              callback(data);
              saveCallback(data)
          })
        }

        $scope.setActualResult = function(statusId, callback){
          saveCallback = callback;
          if($scope.tc.current != true){
            $scope.selectTc($scope.tc)
          }
          $scope.tc.editARMode = true;
        }

        $scope.saveRun = function(){
          $scope.updateTCStatusonDB($scope.tc.statusId,function(){
            $scope.tc.editARMode = false;
          })
        }

        $scope.undoRun = function(){
          $scope.tc.statusName = $scope.tc.statusNameTemp;
          $scope.tc.statusId = $scope.tc.statusIdTemp;
          $scope.tc.editARMode = false;
          saveCallback = function(){}
        }

        $scope.handleDragStart = function(){
          $scope.$parent.droppable = false;

          if($scope.$parent.areTcsChecked()){
            if($scope.$parent.tcCheckedCount() > 1){
              $scope.tc.dragSingle = false;
            }else{
              $scope.tc.dragSingle = true;
              // $scope.$parent.updateGlobalDraggableArray();
            }
          }else{
              $scope.tc.dragSingle = true;
              // $scope.$parent.updateGlobalDraggableArray();
          }
          $scope.$parent.updateGlobalDraggableArray();
        }

        $scope.handleDragRevert = function(tc){
          $scope.$parent.droppable = true;
          DO.cleanDraggable();
        }

        $scope.fileAdded = function(file){

            if(typeof $scope.tc.attachments == 'undefined'){
                $scope.tc.attachments = [];              
            }

            $scope.tc.attachments.push({
                id: 0,
                name: file.name
            })
        }

       }],

       link: function (scope, element, attrs) {
              
       }
   }
});