/**
 * Created by huang on 2016/9/13 0013.
 */
angular.module('ico2o.controllers.shopCartCtrl', [])
	.controller('shopCartCtrl', function($scope, $state, $http, $ionicHistory, $rootScope, $log, $filter, $ionicPopup, $cacheFactory, $ionicLoading, $rootScope, $timeout, locals, shopCartService) {

		var UserID = $rootScope.UserID;
		/*		var url_getShopCart = $rootScope.host + '/ASHX/MobileAPI/ShopCar/Get.ashx';
				var url_deleteByCart = $rootScope.host + '/ASHX/MobileAPI/ShopCar/Delete.ashx';*/
		var url_getShopCarNum = $rootScope.host + '/ASHX/MobileAPI/ShopCar/GetShopCarNum.ashx';
		var url_getDeliveryAreas = $rootScope.host + '/ASHX/MobileAPI/ShopCar/GetDeliveryAreas.ashx';
		var url_updateDeliveryArea = $rootScope.host + '/ASHX/MobileAPI/ShopCar/UpdateDeliveryArea.ashx';
		var url_getShopCarNum = $rootScope.host + '/ASHX/MobileAPI/ShopCar/GetShopCarNum.ashx'; //查看商品数量

		/*区分购物车和订购车*/
		$rootScope.isShopper = false;
		//$log.debug("view:", $ionicHistory.viewHistory());

		/*加载购物车列表--购物车*/ //
		$scope.pageNo = 1;
		$scope.shopList = [];
		$scope.proID = [];
		$scope.addressList;
		var list;

		var refreshCtrl = function() {
			$ionicLoading.show();

			$scope.totalPrice = 0;
			$scope.shopList = [];
			$scope.proID = [];
			$scope.addressList;
			$scope.checkBoxChecked = [];
			$scope.setBoxCheckedInQX = false;
			$scope.selectAll = false;

			shopCartService.getCart(UserID)
				.then(function(data) {
					$scope.shopList = data;
					//$log.debug(data);
				}, function(error) {
					$log.error("加载购物车失败");
				})
				.then(function() {
					angular.forEach($scope.shopList, function(data, index) {
						$scope.proID.push(data.NO);
					});
					//$log.debug("proID", $scope.proID[0], angular.toJson($scope.proID), $scope.proID[0]);
					$ionicLoading.hide();
				})
				.then(function() {

					//设置发货地
					$http({
							method: 'get',
							url: url_getDeliveryAreas,
							params: {
								ProNOs: angular.toJson($scope.proID)
							} //
						})
						.success(function(data) {
							//$log.debug("address:", data);
							$scope.addressList = data;
						})
						.error(function(error) {
							$log.warn('get areas error');
						});
				});
			$timeout(function() {
				$scope.setBox(false);
			}, 200);
		};

		//获取购物车数量
		/*		$http({
						method: 'post',
						url: url_getShopCarNum
					})
					.success(function(dataz) {
						$log.debug('get num', dataz);
					});*/

		/*		var getAreas = function() {
					
					$http({
							method: 'get',
							url: url_getDeliveryAreas,
							params: {
								ProNOs:list
							}
						})
						.success(function(data) {
							$log.debug("address:", data[0].Areas);
							$scope.addressList = data;
						})
						.error(function(error) {
							//$log.error(error);
						});
				};*/

		$scope.setAreas = function(id, values) {
			$http({
					method: 'post',
					url: url_updateDeliveryArea,
					params: {
						ShopCarID: id,
						Area: values
					}
				})
				.success(function(rep) {
					//$log.debug("update area result:", rep.result);
				})
				.error(function(error) {
					$log.warn("update area error");
				});
		};

		/*单选按钮状态列表*/
		$scope.checkBoxChecked = [];

		/*总价*/
		$scope.totalPrice = 0;

		//全选按钮--页面状态监听
		$scope.setBoxCheckedInQX = false;
		$scope.selectAll = false;

		/*设置单选按钮--全选或反选的状态*/
		$scope.setBox = function(bool) {
			$scope.checkBoxChecked = [];
			for(var i = 0; i < $scope.shopList.length; i++) {
				$scope.checkBoxChecked[i] = bool;
				//$log.debug('bool', $scope.shopList, $scope.checkBoxChecked);
				$scope.selectAll = bool;
			}
		};

		/*单选按钮监听*/
		$scope.setBoxChecked = function(index) {
			$scope.checkBoxChecked[index] = !$scope.checkBoxChecked[index];
			if($scope.checkBoxChecked[index]) {
				$scope.totalPrice += $scope.shopList[index].Price * $scope.shopList[index].Quantity;
			} else {
				$scope.totalPrice -= $scope.shopList[index].Price * $scope.shopList[index].Quantity;
				$scope.selectAll = false;
				$scope.setBoxCheckedInQX = false;
			}
			//$log.debug('单选按钮', $scope.checkBoxChecked[index]);
			//$log.debug("$scope.totalPrice",$scope.totalPrice);
		};

		/*全选按钮监听*/
		$scope.checkAllshopcar = function() {
			$scope.setBoxCheckedInQX = !$scope.setBoxCheckedInQX;
			$scope.totalPrice = 0;
			$scope.setBox($scope.setBoxCheckedInQX);
			if($scope.setBoxCheckedInQX) {
				angular.forEach(
					$scope.shopList,
					function(data, index, arr) {
						$scope.totalPrice += data.Price * data.Quantity;
						//$log.debug("$scope.totalPrice",JSON.stringify($scope.totalPrice));
					});
			}
			//$log.debug("setBoxCheckedInQX",$scope.setBoxCheckedInQX);
		};

		//商品数量加减
		$scope.decrementQuantity = function(index) {
			if($scope.shopList[index].Quantity > 1) {
				$scope.shopList[index].Quantity--;
				if($scope.checkBoxChecked[index]) {
					$scope.totalPrice -= $scope.shopList[index].Price;
				}
			}

		};
		$scope.incrementQuantity = function(index) {
			$scope.shopList[index].Quantity++;
			if($scope.checkBoxChecked[index]) {
				$scope.totalPrice += $scope.shopList[index].Price;
			}
		};

		/*删除商品*/
		$scope.deleteCart = function(id, index) {
			//var t = "";
			var confirmPopup = $ionicPopup.confirm({
				title: '删除商品',
				//template: '确定删除商品',
				cancelText: '取消',
				okText: '确定'
			});
			confirmPopup.then(function(res) {
				if(res) {
					shopCartService.deleteCart(id)
						.then(function(result) {
							if(result) {
								//t = "删除成功";
								if($scope.checkBoxChecked[index]) {
									$scope.totalPrice -= $scope.shopList[index].Price * $scope.shopList[index].Quantity;
								}
								$scope.shopList.splice(index, 1);
								$scope.checkBoxChecked.splice(index, 1);
							}
							//$log.debug("delete:", result);
						}, function(error) {
							$log.error("delete error", error);
						});
				} else {
					//console.log('123');
				}
			});

		};

		/*批量删除商品*/

		$scope.deleteCartList = function() {
			var confirmPopup = $ionicPopup.confirm({
				title: '删除商品',
				//template: '确定删除商品',
				cancelText: '取消',
				okText: '确定'
			});
			confirmPopup.then(function(res) {
				if(res) {
					var IDlist = [];
					angular.forEach($scope.shopList, function(data, index, arr) {
						if($scope.checkBoxChecked[index]) {
							IDlist.push(data.ID);
						}
					});
					//$log.debug('delete list:', IDlist, $scope.checkBoxChecked, $scope.shopList);
					IDlist = angular.toJson(IDlist);
					shopCartService.deleteCart(IDlist)
						.then(function(result) {
							if(result) {
								//t = "删除成功";
								refreshCtrl();
							}

						}, function(error) {
							$log.error("删除商品错误");
						});

				} else {
					//console.log('123');
				}
			});
		};

		refreshCtrl();

		/*-提交订单*/
		$scope.open_orderCheck = function() {
			var list = [];
			var shopCarCount = 0;
			//var o = 0;
			angular.forEach(
				$scope.checkBoxChecked,
				function(data, index, arr) {
					if(data) {
						list.push($scope.shopList[index]);
						shopCarCount += $scope.shopList[index].Quantity;
						////$log.debug("list:",JSON.stringify(list),++o);
					}
					// $log.debug("forEach checkBoxChecked:",index,data);
				}
			);
			//$log.debug("list:", list);

			if($scope.totalPrice != 0) {
				if($rootScope.flag_address == 0) {
					$state.go('tab.order_check2', {
						orderPrice: angular.toJson($scope.totalPrice),
						shopCarCount: angular.toJson(shopCarCount),
						IDList: angular.toJson(list)
					});
				} else if($rootScope.flag_address == 1) {
					$state.go('tab.order_check', {
						orderPrice: angular.toJson($scope.totalPrice),
						shopCarCount: angular.toJson(shopCarCount),
						IDList: angular.toJson(list)
					});
				}
			} else {
				$ionicPopup.alert({
					title: "请选择商品"
				});
			}
		};

		//测试

	});