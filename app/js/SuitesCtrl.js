tcmModule.directive('tcmSuitesModule', function() {
    return {
        restrict: 'E',
        transclude:false,
        scope:true,
        templateUrl: 'app/partials/suitesmodule.html',
        controller: ["$scope", "$element", "$attrs", "$rootScope", 'tcm_model', function(scope, element, $attrs, $rootScope, tcm_model){
            
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


            scope.loadSuites = function(){
                scope.sprintActiveClass = 'active'
                scope.suiteActiveClass = ''
                var suite = tcm_model.Suites.query();
                scope.suites =  _.extend(suite, {hide:false})
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
                suite.$delete(function(){
                    console.log('deleted', suite.id)
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
                width: window.innerWidth - 325
            };


            scope.getWidth = function() {
                return window.innerWidth;
            };

            scope.$watch(scope.getWidth, function(newValue, oldValue) {
                newWidth = (scope.showRight == false)? newValue - 325: newValue - 661;
                scope.middleWidth = {
                    width: newWidth
                };
            });

            scope.$watch('showRight', function(value, old){
                if(value == old){
                    return false;
                }

                newWidth = (scope.showRight == false)? scope.getWidth() - 325: scope.getWidth() - 661;

                scope.middleWidth = {
                    width: newWidth
                };
                scope.$apply();

            })

            window.onresize = function(){
                scope.$apply();
            }

        }],
        link: function(scope, elm, attr, ngModelCtrl) {
        }
    };
});