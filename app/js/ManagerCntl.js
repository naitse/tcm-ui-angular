

function ManagerCntl($scope, $routeParams, $http, $rootScope, tcm_model) {

	$scope.views = {
		sprint:{active:true},
		suites:{active:false}
	}

	$scope.selectSprint = function(){
		$scope.views.sprint.active = true
		$scope.views.suites.active = false
	}

	$scope.selectSuites = function(){
		$scope.views.sprint.active = false
		$scope.views.suites.active = true
	}






////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	

	// $scope.resetCurrentRequester = function(){
	// 	$scope.currentRequester = {
	// 		id:'',
	// 		type:'',
	// 		object:{}
	// 	};
	// }

	// $scope.resetCurrentRequester();

	// $scope.resetIteration = function() {

	// 	$scope.iteration = {
	// 		IterId : ''
	// 	}

	// }

	// $scope.resetIteration();
	
	
	// if($routeParams.projectId !== null){
	// 	$scope.releases =  tcm_model.Releases.query();
	// }
	

	// $scope.isEmpty = function(string){
	// 	var result = /^\s*$/.test(string) || (string === null);
	// 	return result;
	// }


}
ManagerCntl.$inject = ['$scope', '$routeParams', '$http', '$rootScope', 'tcm_model'];