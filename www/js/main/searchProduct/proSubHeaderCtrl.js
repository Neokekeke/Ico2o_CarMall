/**
 * Created by huang on 2016/9/22 0022.
 */
angular.module('ico2o.controllers.proSubHeaderCtrl', [])
	.controller('proSubHeaderCtrl', function($scope, $log, $rootScope, $state, locals, $ionicPopup) {
		$scope.CarCodess = "请选择车型";
		$scope.code = [];
		$scope.CarMessage = false;
		$scope.KeyWord = '';
		/*获取车型数据*/
		var getCarCode = function() {
			//$log.debug('carcode',$scope.CarCodess);
			$scope.code = locals.getObject("carCode");
			if($scope.code.Brand != null) {
				$scope.CarMessage = true;
			}
		};
		//getCarCode();
		/*关键字查找*/
		$rootScope.keyWord = null;
		$scope.getBySearch = function() {
			if($scope.KeyWord == null) {
				$ionicPopup.show({
					title: "请输入关键字",
					buttons: [{
						text: "确定",
						type: 'button button-positive'
					}]
				});
			}
			if($scope.code == []) {
				$ionicPopup.show({
					title: "请选择车型",
					buttons: [{
						text: "确定",
						type: 'button button-positive'
					}]
				});
			}
			else {
				$rootScope.keyWord = $scope.KeyWord;
				$state.go("tab.productList");
			}
		};

		/*监听*/
		$scope.$on('$stateChangeSuccess', getCarCode);

	});