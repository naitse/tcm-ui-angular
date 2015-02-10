

function ManagerCntl($scope, $routeParams, $http, $rootScope, tcm_model) {

	$scope.views = {
		sprint:{active:true},
		suites:{active:false},
        automation:{active:false}
	}

	$scope.sprintTestInactive = false
	$scope.suiteTestInactive = true
    $scope.automationTestInactive = true

	$scope.selectSprint = function(){
		$scope.sprintTestInactive = false
		$scope.suiteTestInactive = true
        $scope.automationTestInactive = true
		$scope.views.sprint.active = true
		$scope.views.suites.active = false
        $scope.views.automation.active = false
	}

	$scope.selectSuites = function(){
		$scope.sprintTestInactive = true
		$scope.suiteTestInactive = false
        $scope.automationTestInactive = true
		$scope.views.sprint.active = false
		$scope.views.suites.active = true
        $scope.views.automation.active = false
	}

    $scope.selectAutomation = function(){
        $scope.sprintTestInactive = true
        $scope.suiteTestInactive = true
        $scope.automationTestInactive = false
        $scope.views.sprint.active = false
        $scope.views.suites.active = false
        $scope.views.automation.active = true
    }


}
ManagerCntl.$inject = ['$scope', '$routeParams', '$http', '$rootScope', 'tcm_model'];