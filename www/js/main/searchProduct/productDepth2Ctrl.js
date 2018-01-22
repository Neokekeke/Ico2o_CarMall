/**
 * Created by huang on 2016/9/13 0013.
 */
angular.module('ico2o.controllers.productDepth2Ctrl', [])
	.controller('productDepth2Ctrl', function($scope, $http, $state, $rootScope, $stateParams, $ionicHistory, $log, productListService) {
		/*监听路由状态变化*/
		var get_subheader = function() {
			productListService.set_state($ionicHistory.currentStateName());
		};
		$scope.$on('$stateChangeSuccess', get_subheader);

		//获取参数
		$scope.title = $stateParams.Name;
		/*获取列表*/
		$scope.lists = [];
		$scope.lists = angular.fromJson($stateParams.listd2);
		//$log.debug("list3", JSON.stringify($scope.lists));

		/*切换状态*/
		$scope.goToPage = function(_Depth, _ParentID, _Name) {
			$rootScope.keyWord = null;
			$rootScope.sortID.sortThreeID = _ParentID;
			var list = productListService.getListToPage(_Depth, _ParentID);
			if(list[0] == null) {
				$state.go("tab.productList"); //产品列表
				//$log.debug("sortID", $rootScope.sortOneID, $rootScope.sortSecondID, $rootScope.sortThreeID, $rootScope.sortFourID);
			} else {
				$state.go('tab.product_depth_3', {
					Name: _Name,
					listd3: angular.toJson(list)
				});
			}

		};
	});