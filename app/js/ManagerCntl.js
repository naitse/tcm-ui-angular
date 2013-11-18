

function ManagerCntl($scope, $routeParams, $http, $rootScope, tcm_model) {
	
	$scope.showRight = true;
	$scope.toggleIcon = ($scope.showRight == true)?'right':'left';
	$scope.panelExpanderRight = ($scope.showRight == true)?319:0;

	$scope.togglePanel = function(){
		$scope.showRight = !$scope.showRight
		$scope.toggleIcon = ($scope.showRight == true)?'right':'left';
		$scope.panelExpanderRight = ($scope.showRight == true)?319:0;
	}

	$scope.middleWidth = {
		width: window.innerWidth - 325
	};


    $scope.getWidth = function() {
        return window.innerWidth;
    };

    $scope.$watch($scope.getWidth, function(newValue, oldValue) {
    	newWidth = ($scope.showRight == false)? newValue - 325: newValue - 661;
        $scope.middleWidth = {
			width: newWidth
		};
    });

    $scope.$watch('showRight', function(value, old){
    	if(value == old){
    		return false;
    	}

    	newWidth = ($scope.showRight == false)? $scope.getWidth() - 325: $scope.getWidth() - 661;

        $scope.middleWidth = {
			width: newWidth
		};
		$scope.$apply();

    })

    window.onresize = function(){
        $scope.$apply();
    }

	$scope.resetCurrentRequester = function(){
		$scope.currentRequester = {
			id:'',
			type:'',
			object:{}
		};
	}

	$scope.resetCurrentRequester();

	$scope.resetIteration = function() {

		$scope.iteration = {
			IterId : ''
		}

	}

	$scope.resetIteration();
	
	
	if($routeParams.projectId !== null){
		$scope.releases =  tcm_model.Releases.query();
	}
	

	$scope.isEmpty = function(string){
		var result = /^\s*$/.test(string) || (string === null);
		return result;
	}


}
ManagerCntl.$inject = ['$scope', '$routeParams', '$http', '$rootScope', 'tcm_model'];