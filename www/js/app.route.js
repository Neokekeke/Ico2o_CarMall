angular.module('ico2o.route', [])
	.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
		$ionicConfigProvider.platform.ios.tabs.style('standard');
		$ionicConfigProvider.platform.ios.tabs.position('bottom');
		$ionicConfigProvider.platform.android.tabs.style('standard');
		$ionicConfigProvider.platform.android.tabs.position('standard');
		$ionicConfigProvider.platform.ios.navBar.alignTitle('center');
		$ionicConfigProvider.platform.android.navBar.alignTitle('center');
		$ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
		$ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');
		$ionicConfigProvider.platform.ios.views.transition('ios');
		$ionicConfigProvider.platform.android.views.transition('android');

		// Ionic uses AngularUI Router which uses the concept of states
		// Learn more here: https://github.com/angular-ui/ui-router
		// Set up the various states which the app can be in.
		// Each state's controller can be found in controllers.js

		$httpProvider.defaults.withCredentials = true;
		//$httpProvider.defaults.headers.common['Cookie'] = '333';

		//$httpProvider.defaults.withCredentials = true;
		//$httpProvider.defaults.headers.common['cookie'] = "aaaaaa=3333333;";

		//$httpProvider.interceptors.push(HttpInterceptor);

		$stateProvider

		// setup an abstract state for the tabs directive
			.state('tab', {
			url: '/tab',
			abstract: true,
			templateUrl: 'templates/tabs.html'
		})

		// Each tab has its own nav history stack:
		//主页
		.state('tab.main', {
				url: '/main',
				cache: 'false',
				views: {
					'tab-main': {
						templateUrl: 'templates/main/tab-main.html',
						controller: 'tabMainCtrl'
					}
				}
			})
			.state('tab.searchPro', {
				url: '/main/searchPro',
				views: {
					'tab-main': {
						templateUrl: 'templates/main/SearchProduct/searchPro.html',
						controller: 'searchProCtrl'
					}
				}
			})
			//用户登录
			.state('tab.login2', {
				url: '/login2',
				views: {
					'tab-main': {
						templateUrl: 'templates/person/login/login.html',
						controller: 'personMessageCtrl'
					}
				}
			})

		//注册新用户
		.state('tab.register2', {
			url: '/register2',
			views: {
				'tab-main': {
					templateUrl: 'templates/person/login/register.html',
					controller: 'register'
				}
			}
		})

		//找回密码
		.state('tab.forgotPassword2', {
			url: '/forgotPassword2',
			views: {
				'tab-main': {
					templateUrl: 'templates/person/login/forgotPassword.html',
					controller: 'forgotPassword'
				}
			}
		})

		//设置新密码
		.state('tab.setNewPassword2', {
				url: '/setNewPassword2',
				params: {
					"Phone": null
				},
				views: {
					'tab-main': {

						templateUrl: 'templates/person/login/setNewPassword.html',
						controller: 'setNewPassword'
					}
				}
			})
			.state('tab.setCarType', { //选择车型
				url: '/setCarType',
				views: {
					'tab-main': {
						templateUrl: 'templates/main/CarType/setCarType.html',
						controller: 'carTypeCtrl'
					}
				}
			})
			.state('tab.shopCart', { //购物车
				url: '/main/shopCart',
				views: {
					'tab-main': {
						templateUrl: 'templates/main/shopCart/shopCart.html',
						controller: 'shopCartCtrl'
					}
				}
			})
			.state('tab.order_check', { //购物车->确认订单
				url: '/order_check?orderPrice&shopCarCount&IDList',
				cache: false,
				views: {
					'tab-main': {
						templateUrl: 'templates/main/shopCart/order_check.html',
						controller: 'orderCheckCtrl'
					}
				}
			})
			.state('tab.invoice', {
				url: '/invoice',
				views: {
					'tab-main': {
						templateUrl: 'templates/main/shopCart/invoice.html'
							//controller:'invoiceCtrl'
					}
				}
			})
			.state('tab.pay', { //购物车->确认订单->支付订单
				url: '/pay',
				views: {
					'tab-main': {
						templateUrl: 'templates/main/shopCart/pay.html',
						controller: 'payCtrl'
					}
				}
			})
			//添加收货地址
			.state('tab.addAddress2', {
				url: '/addAddress2',
				views: {
					'tab-main': {
						templateUrl: 'templates/person/ShippingAddress/addAddress.html',
						controller: 'addAddress'
					}
				}
			})

		//选择省市区
		.state('tab.addArea2', {
			url: '/addArea2',
			views: {
				'tab-main': {
					templateUrl: 'templates/person/ShippingAddress/AddArea.html',
					controller: 'addArea'
				}
			}
		})

		//收货地址
		.state('tab.shippingAddress2', {
			url: '/shippingAddress2',
			cache: false,
			views: {
				'tab-main': {
					templateUrl: 'templates/person/ShippingAddress/shippingAddress.html',
					controller: 'shippingAddress'
				}
			}
		})

		//更改收货地址
		.state('tab.updateAddress2', {
				url: '/updateAddress2?gml',
				views: {
					'tab-main': {
						templateUrl: 'templates/person/ShippingAddress/updateAddress.html',
						controller: 'updateAddress'
					}
				}
			})
			.state('tab.maintenanceItem', { //常规保养
				url: '/main/maintenanceItem',
				cache: false,
				views: {
					'tab-main': {
						templateUrl: 'templates/main/MaintenanceItem/maintenanceItem.html',
						controller: 'maintenanceItemCtrl'
					}
				}
			})
			.state('tab.maintenanceItem_next', { //常规保养->保养下一步
				url: '/maintenanceItem_next',
				cache: false,
				views: {
					'tab-main': {
						templateUrl: 'templates/main/MaintenanceItem/maintenanceItem_next.html',
						controller: 'maintenanceItemNextCtrl'
					}
				}
			})
			.state('tab.beautyCare', { //美容护理
				url: '/beautyCare',
				views: {
					'tab-main': {
						templateUrl: 'templates/main/BeautyCare/beautyCare.html',
						controller: 'beautyCareCtrl'
					}
				}
			})
			.state('tab.beautyCare_next', { //美容护理->美容护理下一步
				url: '/beautyCare_next',
				views: {
					'tab-main': {
						templateUrl: 'templates/main/BeautyCare/beautyCare_next.html',
						controller: 'beautyCareNextCtrl'
					}
				}
			})
			.state('tab.repairShop1', { //附近维修店
				url: '/repairShop1',
				views: {
					'tab-main': {
						templateUrl: 'templates/main/RepairShop/repairShop.html',
						controller: 'repairShop1Ctrl'
					}
				}
			})
			.state('tab.product_depth_0', { //查找配件0
				url: '/product_depth_0',
				views: {
					'tab-main': {
						templateUrl: 'templates/main/SearchProduct/product_depth_0.html',
						controller: 'productDepthCtrl'
					}
				}
				/*        onEnter: function(){//进入时执行

				        },
				        onExit: function(){//退出时执行
				        }*/
			})
			.state('tab.product_depth_0.subheader', {
				url: '/subheader',
				templateUrl: 'templates/main/SearchProduct/pro_subheader.html',
				controller: 'proSubHeaderCtrl'
			})
			.state('tab.product_depth_1', { //查找配件0->查找配件1
				url: '/product_depth_1?Name&listd1',
				views: {
					'tab-main': {
						templateUrl: 'templates/main/SearchProduct/product_depth_1.html',
						controller: 'productDepth1Ctrl'
					}
				}
			})
			.state('tab.product_depth_1.subheader', {
				url: '/subheader',
				templateUrl: 'templates/main/SearchProduct/pro_subheader.html',
				controller: 'proSubHeaderCtrl'
			})
			.state('tab.product_depth_2', { //查找配件0->查找配件1->查找配件2
				url: '/product_depth_2?Name&listd2',
				views: {
					'tab-main': {
						templateUrl: 'templates/main/SearchProduct/product_depth_2.html',
						controller: 'productDepth2Ctrl'
					}
				}
			})
			.state('tab.product_depth_2.subheader', {
				url: '/subheader',
				templateUrl: 'templates/main/SearchProduct/pro_subheader.html',
				controller: 'proSubHeaderCtrl'
			})
			.state('tab.product_depth_3', { //查找配件0->查找配件1->查找配件2->查找配件3
				url: '/product_depth_3?Name&listd3',
				views: {
					'tab-main': {
						templateUrl: 'templates/main/SearchProduct/product_depth_3.html',
						controller: 'productDepth3Ctrl'
					}
				}
			})
			.state('tab.product_depth_3.subheader', {
				url: '/subheader',
				templateUrl: 'templates/main/SearchProduct/pro_subheader.html',
				controller: 'proSubHeaderCtrl'
			})
			.state('tab.productList', { //查找配件0->查找配件1->查找配件2->查找配件3->配件列表
				url: '/productList',
				/*cache:false,*/
				views: {
					'tab-main': {
						templateUrl: 'templates/main/SearchProduct/productList.html',
						controller: 'productListCtrl'
					}
				}
			})
			// .state('tab.product_detail', {//查找配件0->查找配件1->查找配件2->查找配件3->配件列表->配件详情
			.state('tab.product_detail', {
				url: '/product_detail/:productID',
				views: {
					'tab-main': {
						templateUrl: 'templates/person/order/orderMessage.html',
						controller: 'orderMessage'
					}
				}
			})
			.state('tab.share', { //晒单
				url: '/share',
				views: {
					'tab-main': {
						templateUrl: 'templates/main/Share/share.html',
						controller: 'shareCtrl'
					}
				}
			})
			.state('tab.addHistory', { //添加加油记录
				url: '/addHistory',
				views: {
					'tab-main': {
						templateUrl: 'templates/main/OilHistory/addHistory.html',
						controller: 'addHistoryCtrl'
					}
				}
			})
			.state('tab.oilHistory', { //添加加油记录->查看加油历史
				url: '/oilHistory',
				views: {
					'tab-main': {
						templateUrl: 'templates/main/OilHistory/oilHistory.html',
						controller: 'oilHistoryCtrl'
					}
				}
			})
			//爱车档案
			.state('tab.car', { //爱车列表
				url: '/car',
				cache: 'false',
				views: {
					'tab-car': {
						templateUrl: 'templates/car/tab-carList.html',
						controller: 'tabCarCtrl'
					}
				}
			})
      //爱车详情中的加油记录
      .state('tab.carOilHistory', { //爱车列表
        url: '/carOilHistory',
        cache: 'false',
        views: {
          'tab-car': {
            templateUrl: 'templates/car/oilHistory.html',
            controller: 'carOilHistoryCtrl'
          }
        }
      })
			.state('tab.addMyCar', { //爱车列表->添加我的爱车
				url: '/car',
				views: {
					'tab-car': {
						templateUrl: 'templates/car/addMyCar.html',
						controller: 'addMyCarCtrl'
					}
				}
			})
			.state('tab.carRecord', { //爱车列表->爱车档案
				url: '/carRecord/?car',
				views: {
					'tab-car': {
						templateUrl: 'templates/car/carRecord.html',
						controller: 'carRecordCtrl'
					}
				}
			})
			.state('tab.carMessage', {
				url: '/carMessage',
				views: {
					'tab-car': {
						templateUrl: 'templates/car/carMessage.html',
						controller: 'carMessageCtrl'
					}
				}
			})
			//客服中心
			.state('tab.chats', {
				url: '/chats',
				views: {
					'tab-chats': {
						templateUrl: 'templates/chat/tab-chats.html',
						controller: ''
					}
				}
			})

		//QQ客服
		.state('tab.QQCustom', {
			url: '/QQCustom',
			views: {
				'tab-chats': {
					templateUrl: 'templates/chat/QQCustom.html'
				}
			}
		})

		//在线客服
		.state('tab.OnlineCustom', {
			url: '/OnlineCustom',
			views: {
				'tab-chats': {
					templateUrl: 'templates/chat/OnlineCustom.html'
				}
			}
		})

		//个人中心
		.state('tab.person', {
			url: '/person',
			cache: 'false',
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/person/tab-personCenter.html',
					controller: 'personCenter'
				}
			}
		})

		//个人中心/购物车
		.state('tab.shopCart1', {
			url: '/shopCart1',
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/main/shopCart/shopCart.html',
					controller: 'shopCartCtrl'
				}
			}
		})

		.state('tab.order_check2', { //购物车->确认订单
				url: '/order_check2?orderPrice&shopCarCount&IDList',
				views: {
					'tab-personCenter': {
						templateUrl: 'templates/main/shopCart/order_check.html',
						controller: 'orderCheckCtrl'
					}
				}
			})
			.state('tab.invoice2', {
				url: '/invoice2',
				views: {
					'tab-personCenter': {
						templateUrl: 'templates/main/shopCart/invoice.html'
							//controller:'invoiceCtrl'
					}
				}
			})
			.state('tab.pay2', { //购物车->确认订单->支付订单
				url: '/pay2',
				views: {
					'tab-personCenter': {
						templateUrl: 'templates/main/shopCart/pay.html',
						controller: 'payCtrl'
					}
				}
			})

		//个人中心/选择车型
		.state('tab.setCarType1', { //选择车型
			url: '/setCarType1',
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/main/CarType/setCarType.html',
					controller: 'carTypeCtrl'
				}
			}
		})

		//个人信息/设置
		.state('tab.setting', {
			url: '/setting',
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/person/PersonMessage/setting.html',
					controller: 'personMessageCtrl'
				}
			}
		})

		//个人信息/绑定QQ
		.state('tab.bindQQ', {
			url: '/bindQQ',
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/person/PersonMessage/bindQQ.html',
					controller: 'personMessageCtrl'
				}
			}
		})

		//个人信息/绑定微信
		.state('tab.bindWechat', {
			url: '/bindWechat',
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/person/PersonMessage/bindWechat.html',
					controller: 'personMessageCtrl'
				}
			}
		})

		//个人信息/昵称
		.state('tab.editName', {
			url: '/editName',
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/person/PersonMessage/editName.html',
					controller: 'personMessageCtrl'
				}
			}
		})

		//个人信息/个人资料
		.state('tab.personMessage', {
			url: '/personMessage',
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/person/PersonMessage/personMessage.html',
					controller: 'personMessageCtrl'
				}
			}
		})

		//个人信息/手机
		.state('tab.bindPhone', {
			url: '/bindPhone',
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/person/PersonMessage/changePhone.html',
					controller: 'personMessageCtrl'
				}
			}
		})

		//用户登录
		.state('tab.login', {
			url: '/login',
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/person/login/login.html',
					controller: 'personMessageCtrl'
				}
			}
		})
      //微信新用户注册
      .state('tab.newlogin', {
        url: '/newlogin',
        views: {
          'tab-personCenter': {
            templateUrl: 'templates/person/login/newlogin.html',
            controller: 'newoldlogin'
          }
        }
      })

      .state('tab.newoldlogin', {
        url: '/newoldlogin',
        views: {
          'tab-personCenter': {
            templateUrl: 'templates/person/login/newoldlogin.html',
            controller: 'newoldlogin'
          }
        }
      })

      //微信绑定老帐户
      .state('tab.oldlogin', {
        url: '/oldlogin',
        views: {
          'tab-personCenter': {
            templateUrl: 'templates/person/login/oldlogin.html',
            controller: 'newoldlogin'
          }
        }
      })

		//注册新用户
		.state('tab.register', {
			url: '/register',
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/person/login/register.html',
					controller: 'register'
				}
			}
		})

		//找回密码
		.state('tab.forgotPassword', {
			url: '/forgotPassword',
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/person/login/forgotPassword.html',
					controller: 'forgotPassword'
				}
			}
		})

		//设置新密码
		.state('tab.setNewPassword', {
			url: '/setNewPassword',
			params: {
				"Phone": null
			},
			views: {
				'tab-personCenter': {

					templateUrl: 'templates/person/login/setNewPassword.html',
					controller: 'setNewPassword'
				}
			}
		})

		//微信二维码
		.state('tab.wechatlogin', {
			url: '/wechatlogin',
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/person/login/wechatlogin.html',
					controller: 'wechatlogin'
				}
			}
		})

		//我的收藏
		.state('tab.collection', {
			url: '/collection',
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/person/collect/collection.html',
					controller: 'collection'
				}
			}
		})

		//代购车
		.state('tab.OnBehalOfTheCar', {
				url: '/OnBehalOfTheCar',
				views: {
					'tab-personCenter': {
						templateUrl: 'templates/person/OnBehalOfTheCar/OnBehalOfTheCar.html',
						controller: 'OnBehalOfTheCar'
					}
				}
			})
			//代购车,在主页显示的订购车
			.state('tab.OnBehalOfTheCar2', {
				url: '/OnBehalOfTheCar2',
				views: {
					'tab-main': {
						templateUrl: 'templates/person/OnBehalOfTheCar/OnBehalOfTheCar.html',
						controller: 'OnBehalOfTheCar'
					}
				}
			})

		//已收货
		.state('tab.getProduct', {
			url: '/getProduct',
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/person/order/getProduct.html',
					controller: 'getProduct'
				}
			}
		})

		/*//我的订单
		.state('tab.myOrder', {
			url: '/myOrder',
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/person/order/myOrder.html',
					controller: 'myOrder'
				}
			}

		})*/

		//我的订单
		.state('tab.my_Order', {
			url: '/my_Order',
			cache: 'false',
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/person/order/my_Order.html',
					controller: 'myOrder'
				}
			}

		})

		/*//全部订单
      .state('tab.allOrder', {
        url: '/allOrder',
        views: {
          'tab-personCenter': {
            templateUrl: 'templates/person/order/my_Order.html',
            controller: 'myOrder'
          }
        }
      })*/

		//待自提
		.state('tab.needToCarry', {
			url: '/needToCarry',
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/person/order/needToCarry.html',
					controller: 'needToCarry'
				}
			}

		})

		//待付款
		.state('tab.needToPay', {
			url: '/needToPay',
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/person/order/needToPay.html',
					controller: 'needToPay'
				}
			}
		})

		//待付款跳转支付页面
		.state('tab.pay1', { //购物车->确认订单->支付订单
			url: '/pay1',
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/main/shopCart/pay.html',
					controller: 'payCtrl'
				}
			}
		})

		//确认订单
		.state('tab.orderConfirm', {
			url: '/orderConfirm',
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/person/order/orderConfirm.html',
					controller: 'orderConfirm'
				}
			}
		})

		//订单详情
		.state('tab.orderlist', {
			url: '/orderlist/:index',
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/person/order/orderlist.html',
					controller: 'orderlist'
				}
			}
		})
		.state('tab.orderlist_main', {
			url: '/orderlist/:index',
			views: {
				'tab-main': {
					templateUrl: 'templates/person/order/orderlist.html',
					controller: 'orderlist'
				}
			}
		})
		//订单详情2
		.state('tab.orderlist2', {
			url: '/orderlist2',
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/person/order/orderlist2.html',
					controller: 'orderlist2'
				}
			}
		})

		//订单信息
		.state('tab.orderMessage', {
			url: '/orderMessage/:productID',
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/person/order/orderMessage.html',
					controller: 'orderMessage'
				}
			}
		})

		//已发货
		.state('tab.sendProduct', {
			url: '/sendProduct',
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/person/order/sendProduct.html',
					controller: 'sendProduct'
				}
			}
		})

		//退货
		.state('tab.returnGoods', {
			url: '/returnGoods/:index',
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/person/order/returnGoods.html',
					controller: 'returnGoods'
				}
			}
		})

		//商品评价
		.state('tab.commodity', {
			url: '/commodity',
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/person/ReservationCommodity/commodity.html'
						//controller: 'commodity'
				}
			}
		})

		//商品评价列表
		.state('tab.evaluateList', {
			url: '/evaluateList',
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/person/ReservationCommodity/evaluateList.html'
						/*controller: 'evaluateList'*/
				}
			}
		})

		//预约记录
		.state('tab.bookRecord', {
			url: '/bookRecord',
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/person/ReservationRecord/bookRecord.html',
					controller: 'bookRecord'
				}
			}
		})

		//附近维修店
		.state('tab.Maintenance', {
			url: '/Maintenance',
			cache: "false",
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/person/ReservationRepairShop/Maintenance.html',
					controller: 'Maintenance'
				}
			}
		})

		//保养项目
		.state('tab.MaintenanceItem', {
			url: '/MaintenanceItem',
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/person/ReservationRepairShop/MaintenanceItem.html',
					controller: 'MaintenanceItem'
				}
			}
		})

		//选择对应订单
		.state('tab.repair_order', {
			url: '/repair_order',
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/person/ReservationRepairShop/repair_order.html',
					controller: 'repair_order'
				}
			}
		})

		//选择维修店
		.state('tab.repairShops', {
			url: '/repairShops',
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/person/ReservationRepairShop/repairShop.html',
					controller: 'repairShops'
				}
			}
		})

		//预约维修
		.state('tab.reservationService', {
			url: '/reservationService?RShop',
			cache: 'false',
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/person/ReservationRepairShop/reservationService.html',
					controller: 'reservationService'
				}
			}
		})

		//退款管理
		.state('tab.returnsManagement', {
			url: '/returnsManagement/:UserID/:PageNO/:PageSize',
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/person/ReturnsManagement/returnsManagement.html',
					controller: 'returnsManagement'
				}
			}
		})

		//添加收货地址
		.state('tab.addAddress', {
			url: '/addAddress',
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/person/ShippingAddress/addAddress.html',
					controller: 'addAddress'
				}
			}
		})

		//选择省市区
		.state('tab.addArea', {
			url: '/addArea',
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/person/ShippingAddress/AddArea.html',
					controller: 'addArea'
				}
			}
		})

		//收货地址
		.state('tab.shippingAddress', {
			url: '/shippingAddress',
			cache:false,
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/person/ShippingAddress/shippingAddress.html',
					controller: 'shippingAddress'
				}
			}
		})

		//更改收货地址
		.state('tab.updateAddress', {
			url: '/updateAddress?gml',
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/person/ShippingAddress/updateAddress.html',
					controller: 'updateAddress'
				}
			}
		})

		//我的消息
		.state('tab.myMessage', {
				url: '/myMessage',
				views: {
					'tab-personCenter': {
						templateUrl: 'templates/person/SystemNotification/myMessage.html',
						controller: 'myMessage'
					}
				}
			})
			/*我的消息/留言*/
			.state('tab.leaveMessage', {
				url: '/leaveMessage',
				views: {
					'tab-personCenter': {
						templateUrl: 'templates/person/SystemNotification/leaveMessage.html',
						controller: 'leaveMessage'
					}
				}
			})

		/*我的消息/系统通知*/
		.state('tab.systemNotification', {
			url: '/systemNotification',
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/person/SystemNotification/systemNotification.html',
					controller: 'systemNotification'
				}
			}
		})

		//关于我们
		.state('tab.aboutUs', {
			url: '/aboutUs',
			views: {
				'tab-personCenter': {
					templateUrl: 'templates/person/aboutUs/aboutUs.html',
					//	            controller:''
				}
			}
		});

		// if none of the above states are matched, use this as the fallback
		$urlRouterProvider.otherwise('/tab/main');

	})
/*	.factory('initDataFactory', ['$q', '$http', 'locals', '$log', function($q, $http, locals, $log) {
		var url_updateMaintenanceItem = $rootScope.host + "/ASHX/MobileAPI/MaintenanceItem/Update.ashx";
		var url_getMaintenanceItemVersion = $rootScope.host + "/ASHX/MobileAPI/MaintenanceItem/Version.ashx";
		var v = locals.get('MainItemVersion') ? locals.get('MainItemVersion') : -1;
		var getVersion = function() {
			deff = $q.defer();
			$http({
					method: 'post',
					url: url_getMaintenanceItemVersion,
					cache: true
				})
				.success(function(res) {
					deff.resolve(res.MainItemVersion);
					$log.debug('version', res);
					//return v.MainItemVersion;
				})
				.error(function(error) {
					$log.warn("error getVersion");
				});
			return deff.promise;
		};
		var updateMaintenance = function() {
			deff = $q.defer();
			$http({
					method: 'post',
					url: url_updateMaintenanceItem,
					cache: true
				})
				.success(function(result) {
					angular.forEach(result, function(data, index, arr) {
						locals.setObject("MaintianceItem" + index, data);
						MaintenanceList[index] = data;
					});
					locals.set("MaintianceItemLength", result.length);
					deff.resolve(true);
				})
				.error(function(error) {
					deff.reject(false);
					$log.warn("error update maintenance");
				});
			$log.debug('update');
			return deff.promise;
		};
		return {
			getV:function(){
				return v;
			},
			getVersion: getVersion,
			updateMaintenance: updateMaintenance
		}
	}]);*/
