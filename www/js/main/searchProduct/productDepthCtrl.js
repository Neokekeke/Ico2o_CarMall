/**
 * Created by huang on 2016/9/20 0020.
 */
angular.module('ico2o.controllers.productDepthCtrl', [])
	.controller('productDepthCtrl', function($scope, $http, $state, $rootScope, $ionicHistory, $log, $timeout,
		productListService, locals) {

		//设置页面数据
		$scope.lists = [];
		$timeout(function() {
			$scope.lists = productListService.getListToPage(0, null);
			//$log.debug('list 1', $scope.lists);
		}, 100);

		/*切换状态*/
		$scope.goToPage = function(_Depth, _ParentID, _Name) {
			$rootScope.keyWord = null;
			$rootScope.sortID.sortOneID = _ParentID;
			var list = productListService.getListToPage(_Depth, _ParentID);
			if(list[0] == null) {
				$state.go("tab.productList"); //产品列表
				//$log.debug("sortID", $rootScope.sortID.sortOneID, $rootScope.sortID.sortSecondID, $rootScope.sortID.sortThreeID, $rootScope.sortID.sortFourID);
			} else {
				$state.go('tab.product_depth_1', {
					Name: _Name,
					listd1: angular.toJson(list)
				});
			}
		};

		/*监听路由状态变化*/
		var get_subheader = function() {
			productListService.set_state($ionicHistory.currentStateName());
		};
		$scope.$on('$stateChangeSuccess', get_subheader);

	});