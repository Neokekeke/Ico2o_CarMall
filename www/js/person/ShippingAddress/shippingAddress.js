/**
 * Created by fan on 2016/9/18 .
 */
// 
//  shippingAddress.js:shippingAddress/updateReceivingCtrl/addAddressCtrl/updateAddressCtrl
//  <project>黄
//  重构代码，修改打开方式
//  Created by huang on 2016-11-21.
//  Copyright 2016 huang. All rights reserved.
// 

angular.module('ico2o.controllers.shippingAddress', [])
	.controller('shippingAddress', function($scope, $log, $timeout, $ionicPopup, $ionicModal, receivingService, receivingCacheFactory) {

		$scope.getReceiving_mList = [];
		$scope.isDefaultList = [];
		var defaultID;

		//获取收货地址
		var getReceiving = function() {
			receivingService.getReceiving()
				.then(function(data) {
					$scope.getReceiving_mList = data;
					//$log.debug('data list:', $scope.getReceiving_mList);
				})
				.then(function() {
					//默认收货地址
					receivingService.getDefaultReceiving()
						.then(function(rep) {
							try {
								defaultID = rep.ID;
							} catch(e) {
								//$log.debug('error', e.message);
							}

						})
						.then(function() {
							angular.forEach($scope.getReceiving_mList, function(data, index) {
								$scope.isDefaultList[index] = false;
								if(data.ID == defaultID) {
									$scope.isDefaultList[index] = true;
								}
							});
						});
				});

		};

		//初始化
		getReceiving();

		//设置默认收货地址
		$scope.setCheckedByID = function(ID) {
			if(ID == defaultID) {
				return true;
			}
			return false;
		};

		//更改默认收货地址
		$scope.setChecked = function(ID, index) {
			//$log.debug('index', index);
			receivingService.updateDefaultReceiving(ID);

		};

		//刷新数据
		$scope.dorefresh = function() {
			//receivingService.cacheReceiving();
			getReceiving();
			$scope.$broadcast('scroll.refreshComplete');
		};

		//删除收货地址
		$scope.deleteChecked = function(ID) {
			$ionicPopup.show({
				title: '确认删除',
				scope: $scope,
				buttons: [{
					text: "确定",
					type: 'button button-positive',
					onTap: function(e) {
						receivingService.deleteReceiving(ID)
							.then(function(result) {
								if(result) {
									$scope.dorefresh();
								} else {
									$ionicPopup.alert({
										title: '删除失败'
									});
								}
							});
					}
				}, {
					text: '取消',
					type: 'button-default'
				}]
			});
		};

		//修改收货地址
		$ionicModal.fromTemplateUrl('templates/person/ShippingAddress/updateAddress.html', {
			scope: $scope,
			animation: 'slide-in-right'
		}).then(function(modal) {
			$scope.modal_updateAddress = modal;
		});
		$scope.openModal_updateAddress = function(data) {
			//$log.debug("open model");
			$scope.$broadcast('getMsg', data);
			$scope.modal_updateAddress.show();
		};
		$scope.closeModal_updateAddress = function() {
			$scope.modal_updateAddress.hide();
		};
		$scope.$on('$destroy', function() {
			$scope.modal_updateAddress.remove();
		});
		$scope.$on('modal.hidden', function() {});
		$scope.$on('modal.removed', function() {});

		$scope.$on('updateOK', function(event, data) {
			$scope.closeModal_updateAddress();
			$scope.dorefresh();
		});

		//添加收货地址
		$ionicModal.fromTemplateUrl('templates/person/ShippingAddress/addAddress.html', {
			scope: $scope,
			animation: 'slide-in-right'
		}).then(function(modal) {
			$scope.modal_AddArea = modal;
		});
		$scope.openModal_AddArea = function() {
			$scope.modal_AddArea.show();
		};

		$scope.closeModal_AddArea = function() {
			$scope.modal_AddArea.hide();
		};

		$scope.$on('$destroy', function() {
			$scope.modal_AddArea.remove();
		});

		$scope.$on('modal.hidden', function() {});
		$scope.$on('modal.removed', function() {});

		$scope.$on('addOK', function(event, data) {
			$scope.closeModal_AddArea();
			$scope.dorefresh();
		});

	})
	//更改收货地址————注入AddressDataService是为了数据预加载
	.controller('updateReceivingCtrl', function($scope, $log, $ionicPopup, AddressDataService, receivingService) {

		$scope.$on('getMsg', function(event, data) {
			$scope.UpdateReceiving = data;
			//$log.debug('收货地址信息 ', $scope.UpdateReceiving);
			$scope.UpdateReceiving.PCD = $scope.UpdateReceiving.Province + " " + $scope.UpdateReceiving.City +
				$scope.UpdateReceiving.District;
		});

		//打开省市区的选择器
		$scope.showPopup = function() {
			//$scope.$broadcast('getAddress', $scope.UpdateReceiving);
			$scope.myPopup = $ionicPopup.show({
				scope: $scope,
				templateUrl: 'templates/person/ShippingAddress/AddArea.html',
			});
		};
		//接受子控制器的值
		$scope.$on('setAddress', function(event, data) {
			try {
				$scope.UpdateReceiving.Province = data.province;
				$scope.UpdateReceiving.City = data.city;
				$scope.UpdateReceiving.District = data.area;
				$scope.UpdateReceiving.PCD = $scope.UpdateReceiving.Province + " " + $scope.UpdateReceiving.City + " " +
					$scope.UpdateReceiving.District;
				$scope.myPopup.close();
			} catch(e) {
				//$log.debug('error', e.message);
			}
		});
		$scope.$on('setAddressNO', function(event, data) {
			$scope.myPopup.close();
		});

		//更改收货地址
		//RecevingID:int, Name:string, PostCode:string, Province:string,
		//City:string, District:String, Address:string, Mobile:string
		$scope.updateReceiving = function() {
			//$log.debug('updateReceiving', JSON.stringify($scope.UpdateReceiving));

			receivingService.updateReceiving($scope.UpdateReceiving.ID, $scope.UpdateReceiving.Name,
					$scope.UpdateReceiving.PostCode, $scope.UpdateReceiving.Province, $scope.UpdateReceiving.City,
					$scope.UpdateReceiving.District, $scope.UpdateReceiving.Address, $scope.UpdateReceiving.Mobile)
				.then(function(result) {
					if(result) {
						$scope.$emit('updateOK', result);
					} else {
						$ionicPopup.alert({
							title: '更改失败，请重试'
						});
					}
				});
		};

	})

//添加收货地址————注入AddressDataService是为了数据预加载
.controller('addAddressCtrl', function($scope, $log, $ionicPopup, AddressDataService, receivingService) {

		$scope.addReceiving = {};

		//打开省市区的选择器
		$scope.showPopup = function() {
			//$scope.$broadcast('getAddress', $scope.UpdateReceiving);
			$scope.myPopup = $ionicPopup.show({
				scope: $scope,
				templateUrl: 'templates/person/ShippingAddress/AddArea.html',
			});
		};
		//接受子控制器的值
		$scope.$on('setAddress', function(event, data) {
			try {
				$scope.addReceiving.Province = data.province;
				$scope.addReceiving.City = data.city;
				$scope.addReceiving.District = data.area;
				$scope.addReceiving.PCD = $scope.addReceiving.Province + " " + $scope.addReceiving.City + " " +
					$scope.addReceiving.District;
				$scope.myPopup.close();
			} catch(e) {
				$log.debug('error', e.message);
			}
		});
		$scope.$on('setAddressNO', function(event, data) {
			$scope.myPopup.close();
		});

		//添加地址
		//UserID:int, Name:string, PostCode:string, Province:string, City:string, District:String, 
		//Address:string, Mobile:string
		/*_Name, _PostCode, _Province, _City, _District, _Address, _Mobile*/
		$scope.submit_address = function(bool) {
			//$log.debug('add address:',JSON.stringify($scope.addReceiving));
			//$log.debug("add address",bool);
			if(bool) {
				receivingService.addReceiving($scope.addReceiving.Name, $scope.addReceiving.PostCode, $scope.addReceiving.Province,
						$scope.addReceiving.City, $scope.addReceiving.District, $scope.addReceiving.Address, $scope.addReceiving.Mobile)
					.then(function(result) {
						if(!result) {
							$ionicPopup.alert({
								title: '添加失败，请重试'
							});
						}
					});
			}
			$scope.$emit('addOK', bool);

		};
	})
	//选择省市区
	.controller('updateAddressCtrl', function($scope, $log, AddressDataService) {
		$scope.address = {};
		$scope.cities;
		$scope.areas;
		$scope.provinces = AddressDataService.getProvincesData();

		try {
			$scope.$watch('address.province', function(newValue, oldValue, scope) {
				if(typeof(newValue) != "undefined") {
					////$log.debug('oldValue if');
					$scope.cities = AddressDataService.getCitiesData($scope.address.province.ID);
				}

				////$log.debug('oldValue',oldValue);
			});
			$scope.$watch('address.city', function(newValue, oldValue, scope) {
				if(typeof(newValue) != "undefined") {
					$scope.areas = AddressDataService.getDistrictsData($scope.address.city.ID);
				}

				////$log.debug('city', $scope.address.city.Name);
			});
		} catch(e) {
			//$log.debug('error:', e.message);
		}

		//提交
		$scope.confirm = function() {
			try {
				if($scope.address.province.Name && $scope.address.city.Name && $scope.address.area.Name) {
					var address = {
						province: $scope.address.province.Name,
						city: $scope.address.city.Name,
						area: $scope.address.area.Name
					};
					//$log.debug('address', $scope.address, address);
					$scope.$emit('setAddress', address);
				} else {
					//$log.debug('error submit address');
				}

			} catch(e) {
				////$log.debug('error', e.message);
			}
		};
		$scope.cancel = function() {
			$scope.$emit('setAddressNO', 'NO');
		};

	});