/**
 * Created by huang on 2016/9/13 0013.
 */
angular.module('ico2o.controllers.orderCheckCtrl', [])
	.controller('orderCheckCtrl', function($scope, $stateParams, $state, $http, $ionicPopup, $ionicModal,
		receivingService, $ionicLoading, $cacheFactory,$ionicHistory, $filter, $rootScope, $log, locals, orderService, wechatPayService) {
			$log.debug('run order');
		var url_getFreight = $rootScope.host + '/ASHX/MobileAPI/Freight/GetFreight.ashx';

		/*修改状态切换*/
		$scope.gotoAddress = function() {
			if($rootScope.flag_address == 0) {
				$state.go('tab.shippingAddress');
			}
			if($rootScope.flag_address == 1) {
				$state.go('tab.shippingAddress2');
			}
		};

		var UserID = $rootScope.UserID;

		/*从上级页面传递的参数：商品总数、计数和总价*/
		$scope.totalPrice = angular.fromJson($stateParams.orderPrice);
		$scope.ShopCarCount = angular.fromJson($stateParams.shopCarCount);
		$scope.IDList = angular.fromJson($stateParams.IDList);
		$log.debug("list", $scope.IDList);

		/*获取产品ID List*/
		var shopCartIDList = [];
		angular.forEach($scope.IDList, function(data, index, arr) {
			shopCartIDList.push(data.ID);
		});
		var list = angular.toJson(shopCartIDList);
		/*获取运费信息*/
		$scope.Get = {
			feight: 0
		};
		//默认地址信息
		$scope.addressMessage = {};
		$scope.$on('$stateChangeSuccess', function() {
			
			//$log.debug('$scope.addressMessage',$scope.addressMessage);
			receivingService.getDefaultReceiving().then(function(data) {
					$scope.addressMessage = data;
					$log.debug("address", data);
					if(data == null) {
						return false;
					}
					return true;
				})
				.then(function(result) { //Province//shopCarID:[int],province:string
					if(result) {
						$http({
								method: 'post',
								url: url_getFreight,
								params: {
									shopCarID: list,
									province: $scope.addressMessage.Province
								}
							})
							.success(function(rep) { //Freight:decimal, result:boolean
								$log.debug('get feight', rep);
								if(rep.result) {
									$scope.Get.feight = rep.Freight;
								}

							})
							.error(function(error) {
								$log.warn('error get feight');
							})
					}
				});
				
		});

		/*备注信息*/
		$scope.invoiceText = {};

		/*商品总重*/
		$scope.totalWeight = 0;
		angular.forEach($scope.IDList, function(data, index, arr) {
			$scope.totalWeight += data.NetWeight / 1000;

		});

		/*选择方式*/
		$scope.logistics = {
			name: "",
			price: "",
			isChecked: false
		}; //配送

		$scope.payStyle = {}; //支付

		//选择物流
		// 弹窗形式
		$scope.showPopup_wuliu = function() {
			$ionicPopup.show({
				scope: $scope,
				templateUrl: "templates/main/shopCart/wuliu.html",
				title: "选择配送方式",
				buttons: [{
					text: '<b>确定</b>',
					type: 'button button-positive'
				}]
			});
		};
		$scope.$on("get_wuliu", function(event, data) { //监听广播事件
			$scope.logistics.name = data.name;
			$scope.logistics.price = data.price;
			$scope.logistics.isChecked = true;
			$log.debug("$scope.logistics", $scope.logistics);
		});

		//选择支付。暂时设置为默认值*************************************************
		$scope.payStyle.title = "微信支付";

		//钉箱
		$scope.BingBoxTotalCost = 0;
		var IsBindingBoxCost = false;
		$scope.isBingBox = false;
		$scope.boxState = [];
		$scope.boxName = [];

		//设置钉箱状态，数据等
		var setState = function() {
			$scope.boxName = [];
			$scope.BingBoxTotalCost = 0;
			$scope.isBingBox = false;
			angular.forEach($scope.IDList, function(data, index, arr) {
				$scope.boxState[index] = false;
				if(data.IsBindingBoxCost) {
					$scope.BingBoxTotalCost += data.BindingBoxCost;
					IsBindingBoxCost = true;
					$scope.isBingBox = true;
					$scope.boxState[index] = true;
					$scope.boxName.push(data.Name);
				}
			});
		};
		setState();

		//选择钉箱
		$ionicModal.fromTemplateUrl('templates/main/shopCart/bingBox.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal_bingbox = modal;
		});
		$scope.openModal_bingbox = function() {
			//$log.debug("open model");
			$scope.modal_bingbox.show();
		};
		//隐藏
		$scope.closeModal_bingbox = function() {
			$scope.modal_bingbox.hide();
		};
		// （当不使用时销毁，在离开控制器时被执行）
		$scope.$on('$destroy', function() {
			//$log.debug("remove model");
			$scope.modal_bingbox.remove();
		});
		// Execute action on hide modal
		$scope.$on('modal.hidden', function() {
			// Execute action
		});
		// Execute action on remove modal
		$scope.$on('modal.removed', function() {
			// Execute action
		});
		$scope.showPopup_bingBox = function() {
			$scope.openModal_bingbox();
		};
		$scope.submit_bingbox = function() {
			$scope.closeModal_bingbox();
			$log.debug("IsBindingBoxCost", $scope.BingBoxTotalCost, $scope.isBingBox);
		};
		//根据钉箱状态取得钉箱费用
		$scope.$on("get_bingboxList", function(event, data) {
			setState();
			$log.debug("get_bingboxList data", data);
		});

		/*选择发票类型*/
		//设置默认值
		var invoiceMessage = {
			type: "",
			invoiceHeader: "",
			invoiceNumber: "",
			invoiceAddress: ""
		};
		$scope.invoiceStrss = "";
		/*		$scope.form = {
					need: false,
					Itype: true,
					invoiceHeader: "",
					invoiceNumber: "",
					invoiceAddress: ""
				};*/

		$ionicModal.fromTemplateUrl('templates/main/shopCart/invoice.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal;
		});
		$scope.openModal = function() {
			//$log.debug("open model");
			$scope.modal.show();
		};
		//隐藏
		$scope.closeModal = function() {
			$scope.modal.hide();
			//$scope.modal.remove();
		};
		// （当不使用时销毁，在离开控制器时被执行）
		$scope.$on('$destroy', function() {
			//$log.debug("remove model");
			$scope.modal.remove();
		});
		// Execute action on hide modal
		$scope.$on('modal.hidden', function() {
			// Execute action
		});
		// Execute action on remove modal
		$scope.$on('modal.removed', function() {
			// Execute action
		});
		//确定发票信息

		$scope.$on("get_invoiceMessage", function(event, data) {
			$log.debug("get_invoiceMessage", data);
			//$scope.form = data;
			if(data.need == true) { //需要发票

				if(data.Itype == true) { //个人发票
					invoiceMessage.type = "个人";
				} else { //单位发票
					invoiceMessage.type = "单位";
					invoiceMessage.invoiceNumber = data.invoiceNumber;
					invoiceMessage.invoiceAddress = data.invoiceAddress;
				}
				invoiceMessage.invoiceHeader = data.invoiceHeader;
				$scope.invoiceStrss = invoiceMessage.type + " " + invoiceMessage.invoiceHeader;
			} else {
				$scope.invoiceStrss = "";
			}

			$log.debug("$scope.invoiceStrss", $scope.invoiceStrss);
			$scope.closeModal();
		});

		//备注信息
		$scope.invoiceText = {
			str: ""
		};

		/*唤起支付*/
		$ionicModal.fromTemplateUrl('templates/main/shopCart/pay.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal_pay = modal;
		});
		$scope.openModal_pay = function() {
			//$log.debug("open model");
			$scope.modal_pay.show();
		};
		//隐藏
		$scope.closeModal_pay = function() {
			$scope.modal_pay.hide();
			//$scope.modal.remove();
		};
		// （当不使用时销毁，在离开控制器时被执行）
		$scope.$on('$destroy', function() {
			//$log.debug("remove model");
			$scope.modal_pay.remove();
		});
		// Execute action on hide modal
		$scope.$on('modal.hidden', function() {
			// Execute action
		});
		// Execute action on remove modal
		$scope.$on('modal.removed', function() {
			// Execute action
		});
		$scope.$on('isPayOK', function(event, data) {
			$scope.closeModal_pay();
			//$ionicHistory.goBack();
					/*状态切换*/
			/*if($rootScope.flag_address == 0) {
				$state.go('tab.orderlist',{index:data});
			}
			if($rootScope.flag_address == 1) {
				$state.go('tab.orderlist_main',{index:data});
			}*/
	
		});

		/*订单提交*/
		//显示正在加载动画
		var loadingShow = function() {
			// Setup the loader
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			});
		};
		//关闭正在加载动画
		var loadingClose = function() {
			$ionicLoading.hide();
		};

		$scope.submit_Order = function() {
			loadingShow();

			//条件判断
			/*			if(!$scope.logistics.isChecked) {
							$ionicPopup.alert({
								title: "请选择配送方式"
							});
						} else */
			if($scope.addressMessage == null) {
				loadingClose();
				$ionicPopup.alert({
					title: "请选择收货地址"
				});
				
			} else {
				var s = 0;
				s = $scope.Get.feight;
				totalPrice = $scope.BingBoxTotalCost + s + $scope.totalPrice;
				$log.debug("totalPrice:", totalPrice);

				/*获取当前时间*/
				var date = new Date();
				var dateC = $filter("date")(date, "yyyy-MM-ddTHH:mm:ss");
				//$log.debug("datac", dateC, $scope.invoiceText);

				//$log.debug("$scope.InvoiceMessage", $scope.InvoiceMessage);
				console.log("UserID:" + UserID + ",ShopCarsID:" + list + ",Address:" + $scope.addressMessage.Address + ",Mobile:" + $scope.addressMessage.Mobile +
					",ExpresPrice:" + totalPrice + ",Name:" + $scope.addressMessage.Name + ",InvoiceType:" + invoiceMessage.type +
					",InvoiceAddress:" + invoiceMessage.invoiceAddress + ",InvoiceName:" + invoiceMessage.invoiceHeader +
					",InvoiceTariff:" + invoiceMessage.invoiceNumber + ",BookingDate:" + dateC + ",Description:" + $scope.invoiceText.str +
					",IsShopper:" + $rootScope.isShopper + ",IsBindingBoxCost:" + IsBindingBoxCost + ",LogisticsCompany:" + $scope.logistics.name + ",PaymentID:" + 10 +
					",PayMethod:" + $scope.payStyle.title + ",PostCode:" + $scope.addressMessage.PostCode + ",TypeValue:" + "送货上门" + ",IsShopToBooking:" + false);

				//提交订单
				orderService.addOrder(UserID, list, $scope.addressMessage.Address,
						$scope.addressMessage.Mobile, totalPrice, $scope.addressMessage.Name,
						"" + invoiceMessage.type, "" + invoiceMessage.invoiceAddress,
						"" + invoiceMessage.invoiceHeader, "" + invoiceMessage.invoiceNumber,
						"" + dateC, "" + $scope.invoiceText.str, $rootScope.isShopper, IsBindingBoxCost,
						"" + $scope.logistics.name, 10, "" + $scope.payStyle.title, "" + $scope.addressMessage.PostCode, '送货上门', false)
					.then(function(data) {
						$log.debug("add Order result:" + data.result + ",OrderNO:" + data.OrderNO);
						if(data.result == false) {
							$ionicPopup.alert({
								title: "订单提交失败"
							});
						}
						return data;
					}, function(error) {
						$log.error("error to add order");
					})
					.then(function(datas) {
						loadingClose();
						if(datas.result) {
							$scope.$broadcast('orderData', datas);
							$scope.openModal_pay();
							/*							if($rootScope.flag_address == 0) {
															$state.go('tab.pay2');
														}
														if($rootScope.flag_address == 1) {
															$state.go('tab.pay');
														}*/
						}
					});
			}
		}
	})
	.controller('wuliuCtrl', function($scope, $log) { //选择物流的子控制器

		$scope.WuLiu = [{
			name: "物流公司1",
			price: 100.0
		}, {
			name: "物流公司2",
			price: 200.0
		}];
		$scope.choiceWuLiu = {
			index: ""
		};

		var tmp = $scope.WuLiu[0];
		$scope.$emit("get_wuliu", tmp);
		//监听变量的变化
		$scope.$watch('choiceWuLiu.index', function(newValue, oldValue, scope) {
			tmp = $scope.WuLiu[newValue];
			$scope.$emit("get_wuliu", tmp);
		});
	})
	.controller('bingBoxCtrl', function($scope, $log) { //选择钉箱的子控制器
		$log.debug("state", $scope.boxState);
		$scope.setBingBox = function(index) {
			$scope.IDList[index].IsBindingBoxCost = !$scope.IDList[index].IsBindingBoxCost;
			$log.debug("box", index);
			$scope.$emit("get_bingboxList", "yes");
		};
	})
	.controller('invoiceCtrl', function($scope, $state, $ionicHistory, locals, $rootScope, $log) { //选择发票的子控制器

		$log.debug("run invoiceCtrl");
		$scope.form = {
			need: false,
			Itype: true,
			invoiceHeader: "",
			invoiceNumber: '',
			invoiceAddress: ""
		};
		$scope.submitInvoice = function() {
			$scope.$emit("get_invoiceMessage", $scope.form);
			$log.debug("invoiceMessage", $scope.form);
		};

	})
	.controller('payCtrl', function($scope, $rootScope, $http, $ionicPopup, $ionicHistory, $log, wechatPayService) {
		var url_getOrder = $rootScope.host + '/ASHX/MobileAPI/Order/Get.ashx';
		var datas = [];
		var orderNO;
		$scope.$on('orderData', function(event, msg) {
			$log.debug('msg', msg);
			orderNO = msg.OrderNO;
			$http({
					method: 'post',
					url: url_getOrder,
					params: {
						UserID: $rootScope.UserID,
						OrderNO: msg.OrderNO
					}
				})
				.success(function(rep) {
					$log.debug('order data', $rootScope.UserID, rep);
					if(rep.message != '请求成功') {
						$ionicPopup.alert({
							title: rep.message
						});
					}
					datas = rep.data; //get OrderID
					$log.debug('ID', rep.data[0].ID, datas[0].ID);

				})
				.error(function(error) {
					$log.warn("getroder error");
				});
		});

		$scope.pay = function() {
			$log.debug('order', datas[0].ID);
			//唤起微信支付
			wechatPayService.payOrder(datas[0].ID);
			//$ionicHistory.goBack();
			$scope.$emit('isPayOK', orderNO);
		};
	});