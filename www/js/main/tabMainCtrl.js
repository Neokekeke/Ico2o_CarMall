/**
 * Created by huang on 2016/9/13 0013.
 */
angular.module('ico2o.controllers.tabMainCtrl', [])
	.controller('tabMainCtrl', function($scope, $log, $rootScope, $state, $ionicPopup, $cacheFactory,
		carCodeService, checkLogin, locals, $timeout, MaintenanceCacheFactory) {
		//console.log("success main d:"+$rootScope.host);
		$scope.CarCode = {};
		$scope.CarCode1 = [];
		$scope.CarMessage = true;

		/*获取车型数据*/
		/*                          {{CarCode.Brand}} {{CarCode.Gearbox}}
                          {{CarCode.Engine}} {{CarCode.Year}}
                          {{CarCode.Configuration}}*/
		//int ID,int UserID,string ImagePath,CarNumber,string Modelsstring Link,string ProDate,string Config,string CreateDate,boolean IsDefault string UserName,string Engine,string ModelCode,string Brand,int Drive_KM string Wave

		/*/!*柯尊仁修改绑定车型*!/
		$scope.UserID = locals.get("UserID");
		if($scope.UserID){
		  carCodeService.get_ModelCode_login($scope.UserID);
		  $scope.bingMycar = [];

		};*/

		$scope.CarSelect = false;
		var getCarCode = function() {
			$scope.CarCode = locals.getObject("carCode");
				$scope.CarSelect = true;
				if($scope.CarCode.Brand == null) {
					$scope.CarSelect = true;
				} else
					$scope.CarSelect = false;
			//console.log("CarCode", $scope.CarCode);
			locals.set('CarCode', $scope.CarCode);
			$rootScope.flag_address = 1;
		};
		getCarCode();

		$scope.$on('$stateChangeSuccess', getCarCode);

		/*柯尊仁修改车型弹窗*/
		$scope.BindCar = function() {
			var confirmPopup = $ionicPopup.confirm({
				title: '选择车型',
				template: '您需要现在选择车型吗？',
				cancelText: '下次再选',
				okText: '确定'
			});
			confirmPopup.then(function(res) {
				if(res) {
					$state.go('tab.setCarType');
				} else {
					//console.log('123');
				}
			});
		};

    console.log(locals.getObject("carCode"));
    if($scope.CarCode.Brand == null && $rootScope.isFirst == true) {
          $rootScope.isFirst = false;
          $scope.BindCar();
          //return;
		}

		/*查找配件*/
		$scope.goToSearch = function() {
			if($scope.CarCode.Brand == null) {
				$ionicPopup.alert({
					title: "请选择车型"
				});
			} else {
				$state.go('tab.searchPro');
			}

		};

		/*按行走公里数保养*/

		$scope.Get = {
			kmNum: ''
		};
		MaintenanceCacheFactory.createCache();
		MaintenanceCacheFactory.setCache('hasCache', false);
		$scope.goToProList = function() {
			MaintenanceCacheFactory.setCache('kmNum', $scope.Get.kmNum);
			$log.debug('km', MaintenanceCacheFactory.getCache('kmNum'));

			if($scope.Get.kmNum > 0) {
				MaintenanceCacheFactory.setCache('isSearch', true);
				$scope.Get.kmNum = '';
				$state.go("tab.maintenanceItem_next", {
					btBoolList: angular.toJson([])
				});

			} else {
				$ionicPopup.alert({
					title: "请正确输入"
				});
			}

		};

		/*登录验证*/
		$scope.checkLoginsetCarType = function() {
			$state.go('tab.setCarType');
		};
		$scope.checkLoginSearchPro = function() {
			checkLogin.checkLog('tab.productList');
		};
		$scope.checkLoginMaintenance = function() {
			if($scope.CarCode == null) {
				checkLogin.checkLog('tab.setCarType');
			} else
				checkLogin.checkLog('tab.maintenanceItem');
		};
		$scope.checkLoginRepairShop = function() {
			/*checkLogin.checkLog('tab.Maintenance');*/
			$ionicPopup.alert({
				title: '该功能即将推出，敬请期待',
				okText: '确定'
			});
		};
		$scope.checkLoginProduct = function() {
			checkLogin.checkLog('tab.product_depth_0');
		};
		$scope.checkLoginAddHistory = function() {
			checkLogin.checkLog('tab.addHistory');
		};

		//优惠组合
		$scope.preferentialCombination = function() {
			$ionicPopup.alert({
				title: '该功能即将推出，敬请期待',
				okText: '确定'
			});
		};
		$scope.preferentialGoods = function() {
			$ionicPopup.alert({
				title: '该功能即将推出，敬请期待',
				okText: '确定'
			});
		};
		$scope.freeShippingGoods = function() {
			$ionicPopup.alert({
				title: '该功能即将推出，敬请期待',
				okText: '确定'
			});
		};
		$scope.flashSale = function() {
			$ionicPopup.alert({
				title: '该功能即将推出，敬请期待',
				okText: '确定'
			});
		}

	});
