/**
 * Created by huang on 2016/9/13 0013.
 */
angular.module('ico2o.controllers.maintenanceItemNextCtrl', [])
	.controller('maintenanceItemNextCtrl', function($scope, $http, $stateParams, $ionicPopup, $ionicHistory,
		$rootScope, $cacheFactory, $log, $ionicLoading, $state, $filter, locals, maintenanceService,
		shopCartService, carCodeService, MaintenanceCacheFactory, $timeout) {
		var UserID = $rootScope.UserID;

		var url_MaintenanceItem_getProducts = $rootScope.host + "/ASHX/MobileAPI/MaintenanceItem/GetProducts.ashx";
		var url_updateMaintenanceItem = $rootScope.host + "/ASHX/MobileAPI/MaintenanceItem/Update.ashx";
		var url_getMaintenanceItemVersion = $rootScope.host + "/ASHX/MobileAPI/MaintenanceItem/Version.ashx";

		$ionicLoading.show();

		var item = [];

		/*产品ID列表,对应数量*/
		var ProductIDList = [];
		var QuantityList = [];

		/*设置产品列表是否在页面显示*/
		$scope.isList = true;

		//产品列表 数据
		$scope.MaintianceItemDatas = [];
		$scope.maintenanceNameList = [];

		/*小计*/
		$scope.priceList = [];

		/*合计*/
		$scope.totalPrice = 0;

		//保养公里数
		$scope.KMMessage = [];

		//根据输入的公里数查找相应配件列表
		var searchByKM = function() {
			maintenanceService.searchByKM(MaintenanceCacheFactory.getCache('kmNum'))
				.then(function(itemdata) {
					item = itemdata;
					MaintenanceCacheFactory.setCache('isSearch', false);
				})
				.then(function() {

					$log.debug("searchByKM data", item);
					$timeout(getProductData, 300);
				});
		};

		//请求产品数据
		var getProductData = function() {
			$log.debug("getProductData");
			if(item.length <= 0) {
				$scope.isList = false;
				$ionicLoading.hide();

			} else {
				maintenanceService.getProducts(item)
					.then(function(res) {
						$scope.MaintianceItemDatas = res;

						angular.forEach(res, function(datass, index) {

							//获取项目列表名
							$scope.maintenanceNameList.push(datass.MaintanceItem);

							//获取小计，总价
							datass.Products[i] = angular.fromJson(datass.Products[i]);
							var ps = 0;
							for(var i = 0; i < datass.Products.length; i++) {
								var p = angular.fromJson(datass.Products[i]);
								ps += p.ShopPrice;
								ProductIDList.push(p.ProID);
								QuantityList.push(1);
							}
							$scope.priceList[index] = ps;
							$scope.totalPrice += ps;

						}); //forEach end
					})
					.then(function() {
						if($scope.totalPrice == 0) {
							$scope.isList = false;
						}
						$ionicLoading.hide();
					});
			}
			//手动缓存数据,必须等待异步数据处理完成
			$timeout(function() {
				MaintenanceCacheFactory.setCache('hasCache', true);
				MaintenanceCacheFactory.setCache('isList', $scope.isList);
				//MaintenanceCacheFactory.setCache('kmMsg', $scope.KMMessage);
				MaintenanceCacheFactory.setCache('MaintianceItemDatas', $scope.MaintianceItemDatas);
				MaintenanceCacheFactory.setCache('maintenanceNameList', $scope.maintenanceNameList);
				MaintenanceCacheFactory.setCache('priceList', $scope.priceList);
				MaintenanceCacheFactory.setCache('totalPrice', $scope.totalPrice);
				MaintenanceCacheFactory.setCache('ProductIDList', ProductIDList);
				MaintenanceCacheFactory.setCache('QuantityList', QuantityList);
			}, 1000);

		};

		//如果有页面缓存
		if(MaintenanceCacheFactory.getCache('hasCache')) {
			$scope.isList = MaintenanceCacheFactory.getCache('isList');
			//$scope.KMMessage = MaintenanceCacheFactory.getCache('kmMsg');
			$scope.MaintianceItemDatas = MaintenanceCacheFactory.getCache('MaintianceItemDatas');
			$scope.maintenanceNameList = MaintenanceCacheFactory.getCache('maintenanceNameList');
			$scope.priceList = MaintenanceCacheFactory.getCache('priceList');
			$scope.totalPrice = MaintenanceCacheFactory.getCache('totalPrice');
			ProductIDList = MaintenanceCacheFactory.getCache('ProductIDList');
			QuantityList = MaintenanceCacheFactory.getCache('QuantityList');
			//$log.debug('cache', $scope.MaintianceItemDatas, $scope.maintenanceNameList);
			$ionicLoading.hide();
		} else {

			//设置本页面数据
/*			var date = new Date();
			var change_date = $filter("date")(date, "yyyy年MM月dd日");
			$scope.KMMessage[1] = locals.getObject('kmMsg' + locals.get('kmMsgLength')) ? locals.getObject('kmMsg' + locals.get('kmMsgLength')) : {
				KM: '',
				KMDate: ''
			};
			$scope.KMMessage[0] = {
				KM: MaintenanceCacheFactory.getCache('kmNum'),
				KMDate: change_date
			};
			locals.set('kmMsgLength', Number(locals.get('kmMsgLength')) + 1);
			$log.debug('kml', locals.get('kmMsgLength'));
			locals.setObject('kmMsg' + locals.get('kmMsgLength'), $scope.KMMessage[0]);*/

			//根据查找方式
			if(MaintenanceCacheFactory.getCache('isSearch')) {
				$log.debug('issearch', MaintenanceCacheFactory.getCache('isSearch'));
				searchByKM();
				//$timeout(searchByKM, 100);
			} else {
				item = MaintenanceCacheFactory.getCache('item');
				$timeout(getProductData, 300);
			}
		}

		/*删除*/
		var removeProItem = function(index, id, ind) {
			$log.debug('ID', $scope.MaintianceItemDatas[index].Products[ind].ShopPrice);
			ProductIDList.splice(ProductIDList.indexOf(id), 1);
			QuantityList.splice(ProductIDList.indexOf(id), 1);
			$scope.priceList[index] -= $scope.MaintianceItemDatas[index].Products[ind].ShopPrice;
			$scope.totalPrice -= $scope.MaintianceItemDatas[index].Products[ind].ShopPrice;
			$scope.MaintianceItemDatas[index].Products.splice(ind, 1);

			MaintenanceCacheFactory.setCache('MaintianceItemDatas', $scope.MaintianceItemDatas);
			MaintenanceCacheFactory.setCache('priceList', $scope.priceList);
			MaintenanceCacheFactory.setCache('totalPrice', $scope.totalPrice);
			MaintenanceCacheFactory.setCache('ProductIDList', ProductIDList);
			MaintenanceCacheFactory.setCache('QuantityList', QuantityList);
		};

		$scope.deletePro = function(list, ID, ind) {
			$log.debug('pro delete', list, ID, ind);
			angular.forEach($scope.MaintianceItemDatas, function(data, index, arr) {
				if(list.MaintanceItem == data.MaintanceItem) {
					removeProItem(index, ID, ind);
					return;
				}
			});

		};

		/*添加数据到购物车*/
		$scope.addToShopCart = function() {

			//$log.debug("p ID List", ProductIDList, QuantityList);
			if(ProductIDList[0] == null) {
				$ionicPopup.alert({
					title: "添加失败"
				});
			} else {
				//添加
				shopCartService.addCart(UserID, "", angular.toJson(ProductIDList), angular.toJson(QuantityList))
					.then(function(response) {
						//$log.debug("add result", response);
						if(response.result) {
							$ionicPopup.alert({
								title: "添加成功"
							});
						} else {
							$ionicPopup.alert({
								title: "添加失败",
								templates: response.tip
							});
						}
					})
					.then(function() {
						$state.go('tab.shopCart');
					});
			}
		};
		$scope.goMaintenance = function() {
			$ionicPopup.alert({
				title: '该功能即将推出，敬请期待',
				okText: '确定'
			});
		}
	});