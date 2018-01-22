/**
 * Created by huang on 2016/9/13 0013.
 */
angular.module('ico2o.controllers.productDepth1Ctrl', [])
	.controller('productDepth1Ctrl', function($scope, $state, $stateParams, $rootScope, $ionicHistory, $q, $log, productListService) {

		/*监听路由状态变化*/
		var get_subheader = function() {
			productListService.set_state($ionicHistory.currentStateName());
		};
		$scope.$on('$stateChangeSuccess', get_subheader);

		//获取列表title
		$scope.title = $stateParams.Name;
		/*获取列表*/
		$scope.lists = [];
		//$scope.lists = $rootScope.list.list_2;
		$scope.lists = angular.fromJson($stateParams.listd1);
		//$log.debug("list2", $scope.lists);

		/*切换状态*/
		$scope.goToPage = function(_Depth, _ParentID, _Name) {
			$rootScope.keyWord =null;
			$rootScope.sortID.sortSecondID = _ParentID;
			var list = productListService.getListToPage(_Depth, _ParentID);
					if(list[0] == null) {
						$state.go("tab.productList"); //产品列表
						//$log.debug("sortID", $rootScope.sortOneID, $rootScope.sortSecondID, $rootScope.sortThreeID, $rootScope.sortFourID);
					} else {
						$state.go('tab.product_depth_2', {
							Name: _Name,
							listd2: angular.toJson(list)
						});
					}
		};
	});