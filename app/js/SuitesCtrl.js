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

            $("#accordion").collapse()

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

/////////////////////////

            


/////////////////////////

            scope.showRight = true;
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