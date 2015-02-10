tcmModule.directive('tcmAutomationModule', function() {
    return {
        restrict: 'E',
        transclude:false,
        scope:true,
        templateUrl: 'app/partials/automation/automationmodule.html',
        controller: ["$scope", "$element", "$attrs", "$rootScope", 'tcm_model', 'Automation', function(scope, element, $attrs, $rootScope, tcm_model, Automation){

            scope.suites = [];
            scope.btnConfig = {hideDropdown:true};
            scope.containerType = 'suites'
            var duration = 200
            scope.resetBarHeight = function(){

                scope.helperBarHeight= 36
            }

            scope.resetBarHeight();

            $("#accordion").collapse()



        scope.resetNewSuite = function(){
        scope.resetBarHeight();
          scope.newSuite = {
            create:false,
            name:''
          }
        }
        
        scope.resetNewSuite();


        scope.createSuite =  function(){
        if(scope.newSuite.create == true){
          return false;
        }
        scope.helperBarHeight= 160
        scope.newSuite.create = true;
      }

        scope.saveNewSuite = function(){
        var temp = new tcm_model.Suites(scope.newSuite)

        temp.$save(function(data){
            scope.suites.push(data);
            $rootScope.$broadcast('suiteAdded', {suite: data});
            scope.resetNewSuite();
        })

      }


        scope.cancelNewSuite = function(){

        scope.resetNewSuite()

      }


            scope.resetCurrentRequester = function(){
             scope.currentRequester = {
                 id:'',
                 type:'',
                 object:{}
             };
            }

            scope.resetCurrentRequester();

            scope.isEmpty = function(string){
             var result = /^\s*$/.test(string) || (string === null);
             return result;
            }

            scope.refreshSuites =function(){
                scope.resetCurrentRequester();
                scope.loadSuites()
            }

            scope.loadSuites = function(){
                scope.sprintActiveClass = 'active'
                scope.suiteActiveClass = ''
                scope.suites = Automation.getSuiteTypes();
            }

            scope.loadSuites();


            scope.getSuiteTestcases = function(suite){
                _.each(scope.suites,function(s){
                    s.active = false;
                })
                suite.active = true;
                scope.currentRequester = {
                     id:suite.id,
                     type:'suite',
                     object:suite
                };
            }

            scope.deleteSuite = function(suite, deleteText){
                if(suite.id == scope.currentRequester.id){
                    scope.resetCurrentRequester();
                }
                var rem =angular.copy(suite)
                suite.$delete(function(){
                    $rootScope.$broadcast('suiteRemoved', {suite: rem});
                    scope.suites = _.without(scope.suites, _.findWhere(scope.suites, {id: suite.id}))
                })
            }

/////////////////////////

            


/////////////////////////

            scope.showRight = false;
            scope.toggleIcon = (scope.showRight == true)?'right':'left';
            scope.panelExpanderRight = (scope.showRight == true)?334:0;

            scope.togglePanel = function(){
                scope.showRight = !scope.showRight
                scope.toggleIcon = (scope.showRight == true)?'right':'left';
                scope.panelExpanderRight = (scope.showRight == true)?334:0;
            }

            scope.middleWidth = {
                width: 1350 - 325
            };


            // scope.getWidth = function() {
            //     return 1350;
            // };

            // scope.$watch(scope.getWidth, function(newValue, oldValue) {
            //     newWidth = (scope.showRight == false)? newValue - 325: newValue - 661;
            //     scope.middleWidth = {
            //         width: newWidth
            //     };
            // });

            scope.$watch('showRight', function(value, old){
                if(value == old){
                    return false;
                }

                newWidth = (scope.showRight == false)? 1350 - 325: 1350 - 661;

                scope.middleWidth = {
                    width: newWidth
                };

            })

            // window.onresize = function(){
            //     scope.$apply();
            // }

        }],
        link: function(scope, elm, attr, ngModelCtrl) {
        }
    };
});