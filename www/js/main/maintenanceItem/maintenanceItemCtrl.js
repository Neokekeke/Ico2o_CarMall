/**
 * Created by huang on 2016/9/13 0013.
 */
angular.module('ico2o.controllers.maintenanceItemCtrl', [])
	.controller('maintenanceItemCtrl', function($scope, $http, $state, $ionicPopup, $cacheFactory, $log,
		$rootScope, $timeout, checkLogin, locals, maintenanceService, MaintenanceCacheFactory) {

		//保养项目名列表
		var list_mainenance = [];

		//获取全部保养项目名
		var getListData = function() {
			var l = locals.get("MaintianceItemLength") - 2; //两个数据项无效
			for(var i = 0; i < l; i++) {
				list_mainenance.push(locals.getObject("MaintianceItem" + i));
			}
		};
		$timeout(getListData, 100);

		//保养项目的事件监听
		$scope.btResultList = [];
		$scope.mBTList = [];

		for(var i = 0; i < 22; i++) {
			$scope.btResultList[i] = false;
		}
		for(var j = 1; j <= 6; j++) {
			$scope.mBTList[j] = false;
		}
		$scope.setBT = function(id) {
			$scope.btResultList[id] = !$scope.btResultList[id];
		};
		//保养套餐设置
		var flagIndex = 0;
		$scope.setBtnChecked = function(index, km) {
			//MaintenanceCacheFactory.setCache('kmNum', km);

			for(var i = 0; i < 22; i++) {
				$scope.btResultList[i] = false;
			}
			$scope.mBTList[index] = !$scope.mBTList[index];
			for(var j = 1; j <= 6; j++) {
				if(j != index) {
					$scope.mBTList[j] = false;
				}
			}
			switch(index) {
				case 1:
					$scope.btResultList[0] = $scope.mBTList[index];
					break;
				case 2:
					$scope.btResultList[0] = $scope.mBTList[index];
					$scope.btResultList[11] = $scope.mBTList[index];
					$scope.btResultList[12] = $scope.mBTList[index];
					break;
				case 3:
					$scope.btResultList[0] = $scope.mBTList[index];
					$scope.btResultList[1] = $scope.mBTList[index];
					$scope.btResultList[11] = $scope.mBTList[index];
					$scope.btResultList[12] = $scope.mBTList[index];
					break;
				case 4:
					$scope.btResultList[0] = $scope.mBTList[index];
					$scope.btResultList[2] = $scope.mBTList[index];
					$scope.btResultList[4] = $scope.mBTList[index];
					$scope.btResultList[5] = $scope.mBTList[index];
					$scope.btResultList[11] = $scope.mBTList[index];
					$scope.btResultList[12] = $scope.mBTList[index];
					$scope.btResultList[14] = $scope.mBTList[index];
					$scope.btResultList[15] = $scope.mBTList[index];
					$scope.btResultList[16] = $scope.mBTList[index];
					$scope.btResultList[17] = $scope.mBTList[index];
					$scope.btResultList[20] = $scope.mBTList[index];
					break;
				case 5:
					$scope.btResultList[0] = $scope.mBTList[index];
					$scope.btResultList[1] = $scope.mBTList[index];
					$scope.btResultList[6] = $scope.mBTList[index];
					$scope.btResultList[7] = $scope.mBTList[index];
					$scope.btResultList[8] = $scope.mBTList[index];
					$scope.btResultList[11] = $scope.mBTList[index];
					$scope.btResultList[12] = $scope.mBTList[index];
					break;
				case 6:
					$scope.btResultList[0] = $scope.mBTList[index];
					$scope.btResultList[10] = $scope.mBTList[index];
					$scope.btResultList[11] = $scope.mBTList[index];
					$scope.btResultList[12] = $scope.mBTList[index];
					$scope.btResultList[19] = $scope.mBTList[index];
					break;
			}
		};

		/*下一步查看选择的项目对应商品*/
		MaintenanceCacheFactory.setCache('hasCache', false);
		MaintenanceCacheFactory.setCache('isSearch', false);
		
		$scope.open_MaintianceItemNext = function() {
			//$timeout.
			//判断是否已选择车型
			if(!locals.get('ModelCode')) {
				$ionicPopup.alert({
						title: "请选择车型"
					})
					.then(function() {
						$state.go('tab.setCarType');
					})
			} else {
				
				var bool = false;
				var item = [];
				//获取保养项目
				angular.forEach(list_mainenance, function(data, index, arr) {
					if($scope.btResultList[index]) {
						bool = true;
						item.push(data.Name);
					}
					//$log.debug("item", item);
				});
				if(bool == false) {
					$ionicPopup.alert({
						title: "请选择保养项目"
					});
				} else {
					$log.debug("item", item);
					MaintenanceCacheFactory.setCache('item', item);
					$state.go('tab.maintenanceItem_next');
				}
			}

		};

	});