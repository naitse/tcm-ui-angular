tcmModule.directive('ngTestcases', function(){
   return {
      restrict: 'E',
      transclude: false,
      scope:{requester:'=', btns:'=', tcminactive:'='},
      templateUrl: 'app/partials/testcases.html',
       controller: ["$scope", "$element", "$attrs", "$rootScope", 'tcm_model', 'draggedObjects', 'fileUploader', '$q', 'uuid', function($scope, element, $attrs, $rootScope, tcm_model, DO, fileUploader, $q, uuid){

        $scope.showTCdelete = false
        $scope.selectall = false
        $scope.hideBulk = false;
        $scope.uuid = Math.floor(Math.random()*10000001);
        $scope.linkTcs = false;
        $scope.createSuiteBtn = false;
        $scope.loading = false;

        $scope.draggedTests = {
          id: $scope.uuid,
          link: $scope.linkTcs, 
          objects:[],
          sc:$scope
        }

        $scope.$watch('linkTcs', function(linkFlag){
          $scope.draggedTests.link = linkFlag
        })

        $rootScope.$on('suiteDragStart', function(event, message){
           $scope.droppable = false;
        })
        $rootScope.$on('suiteDragRevert', function(event, message){
            $scope.droppable = true;
        })

        DO.draggedObjects.push($scope.draggedTests)

        if(typeof $scope.btns !== 'undefined'){
          if($scope.btns.hideBulk){
            $scope.hideBulk = true;
          }
        }

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
            description:'',
            priority:1,
            proposed:0
          }
        }

        $scope.resetCreateSuite = function(){
          $scope.createSuite = {
            create:false,
            name:'',
            description:''
          }
        }

        $scope.resetTestcasesObject();
        $scope.resetNewTestcase();
        $scope.resetCreateSuite();


          $scope.$watch("requester.id",function(value, old){

            $scope.droppable = false;

            if(value == old){
              return false;//prone to error
            }

            $scope.draggedTests.type = $scope.requester.type

            $scope.resetTestcasesObject();
              if(value != ''){
                if(value != 'none'){
                    $scope.getTestCases();
                  $scope.hideButtons = false
                }else{
                  $scope.hideButtons = true
                }
              }else{
                  $scope.hideButtons = true
              }
          })

          $scope.getTestCases = function(){
            $scope.loading = true;
            $scope.resetTestcasesObject();
            $scope.resetNewTestcase();
            $scope.selectall = false
            $scope.showTCdelete = false
            if($scope.requester.type == 'multitag'){
              if($scope.requester.tagsArray.length == 0){
                $scope.testcases = [];
                $scope.createSuiteBtn = true;
                $scope.createSuiteBtnEnabled = false;
                $scope.loading = false;
                return false;
              }
              var multi = new tcm_model.MultiTagsTcs()
              multi.tagsArray = $scope.requester.tagsArray;

              multi.$fetch(function(data){
                $scope.testcases = data.response;
                $scope.extendTcs();
                $scope.createSuiteBtn = true;
                $scope.createSuiteBtnEnabled = true;
                $scope.droppable = false;
                $scope.loading = false;
              })
            }else if($scope.requester.type == 'tag'){
              tcm_model.TagsTcs.query({tid: $scope.requester.id},function(data){
                  procesTc(data)
              })
            }else if($scope.requester.type == 'feature'){
              tcm_model.TestCases.query({featureId: $scope.requester.id},function(data){
                  procesTc(data)
              })
            }else if($scope.requester.type == 'suite'){
              tcm_model.SuiteTests.query({sid: $scope.requester.id},function(data){
                  procesTc(data)
              })
            }

          }

        function procesTc(data){
            $scope.testcases = data;
            $scope.extendTcs();
            $scope.droppable = true;
            $scope.loading = false;
        }  

        $scope.extendTcs = function(data){
          _.each($scope.testcases, function(obj){
            $scope.extendSingleTC(obj);
          });
        }

        $scope.extendSingleTC = function(singletc) {
          _.extend(singletc, {type:'test', editMode: false, editARMode:false, tcTemp:{}, delete:false, current:false, dropDownClose:true, checked:false, draggable:true, dragSingle:false});
        }


        $scope.updateTestCasesList = function(tc){
          var extended = tc
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

          var toUnlink =[]

          _.each($scope.testcases,function(tc){

            if(tc.linked == 1){

              if(tc.checked == true){
                  toUnlink.push(tc)
              }

            }else if(tc.checked == true){
              var tcDel = new tcm_model.TestCases(tc)
              tcDel.featureId = 0
              tcDel.$delete(function(){
                  $scope.tcDeleted(tc);
              })
            }


            if(toUnlink.length > 0){
            var temp = new tcm_model.SuiteTestsLink()
              temp.sid = $scope.requester.id;
              temp.testArray = toUnlink
              temp.$unlink(function(data){
                _.each(data.response,function(tc){
                  $scope.removeTCfromScope(tc);
                })
                  $rootScope.$broadcast('suiteTcUnLinked', {suiteId: $scope.requester.id, tcArray:data.response});
              })
            }
          })
        }

        $scope.cloneTcBulk = function(tcArray){

          if($scope.requester.type == 'suite'){
            var tcArray = [];
            _.each($scope.testcases,function(tc){
              if(tc.checked == true){
                tcArray.push(tc.tcId)
              }
            })
            $scope.cloneTCSuiteBulk(tcArray)
            return false;
          }

          if($scope.requester.type == 'feature'){

            if(typeof tcArray == 'undefined'){
              var tcArray = [];
                _.each($scope.testcases,function(tc){
                  if(tc.checked == true){
                    tcArray.push(tc)
                  }
                })
            }

            _.each(tcArray,function(tc){
                var newTc = new tcm_model.TestCasesCloneTC({tcId:tc.tcId});
                newTc.featureId = $scope.requester.id;
                newTc.$save(function(data){
                  $rootScope.$broadcast('tcStatusUpdated', {featureId: $scope.requester.id});
                  $scope.updateTestCasesList(data)
                })
            })

            
          }


        }

        $scope.cloneTCSuiteBulk = function(tcArray){
            var temp = new tcm_model.SuiteTestsClone({tcId:0, sid: $scope.requester.id});
            temp.testArray = tcArray
            temp.$clone(function(data){
              _.each(data.response, function(tc){
                var ntc = new tcm_model.SuiteTests(tc)
                $scope.updateTestCasesList(ntc)
                $rootScope.$broadcast('suiteTcStatusUpdated', {suiteId: $scope.requester.id});
              })
            })
        }
/* NEW TCs */

      $scope.createTC =  function(){
        if($scope.newTC.create == true){
          return false;
            $scope.filesToUpload = [];
            fileUploader.cleanFiles(0);
        }
        $scope.newTC.create = true;
          $scope.filesToUpload = [];
          fileUploader.cleanFiles(0);
        if($scope.requester.type == "feature"){
          $scope.newTC.featureId = $scope.requester.id;
        }else if($scope.requester.type == "suite"){
          $scope.newTC.sid = $scope.requester.id;
        }
        
      }

      $scope.newTcPanelId = uuid.new();
      $scope.saveNewTC = function(){

        if($scope.requester.type == "feature"){
          var temp = new tcm_model.TestCases($scope.newTC)
          var deferred = $q.defer();

          temp.$save(function(data){

            if($scope.filesToUpload.length > 0){

              $scope.uploadFiles(data.tcId,function(files){
                  console.log(files)
                  data.attachments = files
                  $scope.updateTestCasesList(data)
                  $rootScope.$broadcast('tcStatusUpdated', {featureId: $scope.requester.id});
              });
            }else{
              $scope.updateTestCasesList(data)
              $rootScope.$broadcast('tcStatusUpdated', {featureId: $scope.requester.id});
            }

          })
        }else if($scope.requester.type == "suite"){
          var temp = new tcm_model.SuiteTests()
          temp.sid = $scope.requester.id;
          temp.testArray = [$scope.newTC]
          temp.$create(function(data){

            _.each(data.response,function(tc){

            if($scope.filesToUpload.length > 0){

              $scope.uploadFiles(tc.tcId,function(files){
                  console.log(files)
                  tc.attachments = files
                  $scope.updateTestCasesList(tc)
                  $rootScope.$broadcast('suiteTcStatusUpdated', {suiteId: $scope.requester.id});
              });
            }else{
              $scope.updateTestCasesList(tc)
              $rootScope.$broadcast('suiteTcStatusUpdated', {suiteId: $scope.requester.id});
            }

            })
          })
        }
      }

      $scope.uploadFiles = function(id, callback){

          fileUploader.upload(
              {featureId: $scope.requester.id,
              tcId: id,
              newTcPanelId: $scope.newTcPanelId},
          function (percentDone) {
          },
          function (files, data) {
              $scope.filesToUpload = [];
              fileUploader.cleanFiles($scope.newTcPanelId);
              if(typeof callback != 'undefined'){
                callback(files.data)
              }
          },
          function (files, type, msg) {
              console.log("Upload error: " + msg, files);
              console.log("Error type:" + type);
          });
      };

      $scope.cancelNewTC = function(){

        $scope.resetNewTestcase()

      }

      $scope.deleteAttachmentNewTc = function(file, index){

          fileUploader.removeFile(file, $scope.newTcPanelId);

          $scope.filesToUpload.splice(index, 1);

      }


////////////////////createSuite

      $scope.createNewSuite =  function(){
        if($scope.createSuite.create == true){
          return false;
        }
        $scope.createSuite.create = true;
      }

      $scope.saveCreateSuite = function(){

          var temp = new tcm_model.Suites($scope.createSuite)

          temp.$save(function(data){
              $rootScope.$broadcast('suiteAdded', {suite: data});
              $scope.resetCreateSuite();
              manageCreatedSuite(data);
          })

        

      }

      function manageCreatedSuite(suite){

        var tcSuiteArray = _.where($scope.testcases, {checked:true});

        if(tcSuiteArray.length == 0){
          tcSuiteArray = $scope.testcases;
        }


        if($scope.requester.type == "multitag"){
            var temp = new tcm_model.SuiteTests()
              temp.sid = suite.id;
              temp.testArray = tcSuiteArray
              temp.$create(function(data){
                $scope.cancelCreateSuite();
              })
        }
      }

      $scope.cancelCreateSuite = function(){

        $scope.resetCreateSuite()

      }

/*******************************************************/

  $rootScope.$on('featureCurrentTCadded', function(event, message){
    if(message.uuid != $scope.uuid){
      if($scope.tcminactive == false){
        $scope.updateTestCasesList(angular.copy(message.tc))
      }
    }

    $scope.draggable = true

  });


  $rootScope.$on('tcUntagged', function(event, message){
    if(typeof $scope.requester !== 'undefined' && $scope.requester.type == 'tag' && $scope.requester.id == message.tag.id){
      $scope.removeTCfromScope(message.tc)
    }
  })

  $rootScope.$on('tcTagged', function(event, message){
    if( typeof $scope.requester !== 'undefined' && $scope.requester.type == 'tag' && $scope.requester.id == message.tag.id){
      $scope.updateTestCasesList(angular.copy(message.tc))
    }
  })

    $rootScope.$on('suiteTcLinked', function(event, message){
      if(typeof $scope.requester == 'undefined'){
        return false;
      }
    if($scope.requester.type == 'suite'){
      _.each($scope.testcases, function(tc){
        _.each(message.tcArray, function(remoteTc){
          if(tc.tcId == remoteTc.tcId){
            tc.linked = 1
          }
        })
      })
    }
  })

  $rootScope.$on('suiteTcUnLinked', function(event, message){
      if(typeof $scope.requester == 'undefined'){
        return false;
      }
    if($scope.requester.type == 'suite'){
      _.each($scope.testcases, function(tc){
        _.each(message.tcArray, function(remoteTc){
          if(tc.tcId == remoteTc.tcId){
            tcm_model.getTCLinkState(tc.tcId, function(data){
              tc.linked = data.linked
            })
          }
        })
      })
    }
  })

  $scope.removeTCfromScope = function(tc){
    $scope.testcases = _.without($scope.testcases, _.findWhere($scope.testcases, {tcId: tc.tcId}));
  }

  $scope.tcDeleted = function(tc){
    $scope.removeTCfromScope(tc)
    if($scope.requester.type == 'feature'){
      $rootScope.$emit('tcDeleted', {featureId: tc.featureId});
    }
    $scope.manageDragState();
    $scope.verifyBulkDisplay();
  };

    $scope.tcUntagged = function(tc){
   $scope.testcases = _.without($scope.testcases, _.findWhere($scope.testcases, {tcId: tc.tcId}));
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

$scope.testSelected = function(tc){
   _.each($scope.testcases, function(obj){
      obj.current = false;
    })
    var setCurrent = _.findWhere($scope.testcases, {tcId: tc.tcId});
    setCurrent.current = true; 
}     


     


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

       $scope.updateGlobalDraggableArray =  function(){
          _.each(DO.draggedObjects, function(objectArray){
            if(objectArray.id == $scope.uuid){
              objectArray.objects = $scope.testcases
            }
          })
          DO.currentDragUUID = $scope.uuid
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


////////////////////DROP SECTION

            $scope.droppable = false;

            $scope.handleDrop = function(){

              $('.tcm-drag-helper').remove();

              if($scope.requester.type == 'tag'){
                DO.dropTestOnTagContainer($scope.requester, $scope.testcases)
              }else if($scope.requester.type == 'feature'){
                DO.dropTestsOnTestsContainer($scope.requester.id)
              }else if($scope.requester.type == 'suite'){
                DO.dropTestOnSuite($scope.requester.object, $scope)
              }

              $scope.draggable = true            

            }

            $scope.handleHover = function(){
              if(DO.getOriginLinkFlag() == true && $scope.requester.type != 'suite'){
                DO.setOriginLinkFlag(false)
              }
            }

            $scope.filesToUpload = new Array();

            $scope.fileAdded = function(file){
                $scope.filesToUpload.push(file)
            }

          $scope.imageSelector = function(file){

          if(typeof file.imgSelector != 'undefined'){
            return file.imgSelector;
          }

          var aName =  file.name

          if(/[^\s]+(.*)+(\.(jpg|png|gif|bmp))$/i.test(aName)){
            if(file.url == null){
              file.imgSelector = "background: url('assets/images/files.png') no-repeat -119px -1px;"
            }else{
              file.isImage = true;
              file.imgSelector = "background: url('" + file.url + "') no-repeat; background-size: 100% 100% !important;"
            }
          }else if(/[^\s]+(.*)+(\.(zip|rar|7zip|tar|gz))$/i.test(aName)){
            file.imgSelector =  "background: url('assets/images/files.png') no-repeat -119px -74px;"
          }else if(/[^\s]+(.*)+(\.(txt|log))$/i.test(aName)){
            file.imgSelector =  "background: url('assets/images/files.png') no-repeat -59px -74px;"
          }else if(/[^\s]+(.*)+(\.(csv|xls|xlsx))$/i.test(aName)){
            file.imgSelector =  "background: url('assets/images/files.png') no-repeat 0px -74px;"
          }else if(/[^\s]+(.*)+(\.(doc|docx))$/i.test(aName)){
            file.imgSelector =  "background: url('assets/images/files.png') no-repeat 0px -1px;"
          }else if(/[^\s]+(.*)+(\.(ppt))$/i.test(aName)){
            file.imgSelector =  "background: url('assets/images/files.png') no-repeat -59px -1px;"
          }else if(/[^\s]+(.*)+(\.(pdf))$/i.test(aName)){
            file.imgSelector =  "background: url('assets/images/files.png') no-repeat -179px -1px;"
          }else{
            file.imgSelector =  "background: url('assets/images/files.png')  no-repeat -179px -74px;"
          }

          return file.imgSelector

        }

        $scope.getFileExt = function(file){
          if(typeof file.fileExt != 'undefined'){return file.fileExt;}
            file.fileExt = file.name.match(/(\.)[\w]*$/)[0].replace('.', '');
          return file.fileExt
        }

        $scope.openAttach = function(file){
          if(file.url == null){return false;}
          window.open(file.url, '_blank')
        }


      }],

       link: function (scope, element, attrs) {
              
       }
   }
});