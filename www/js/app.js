// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js//其中，依赖注入控制器
angular.module('ico2o', ['ionic', 'ico2o.directives','ico2o.controllers.tabCarCtrl',/*ui-router*/'ico2o.route',
    'ico2o.controllers.tabMainCtrl','ico2o.controllers.addMyCarCtrl','ico2o.controllers.carRecordCtrl','ico2o.controllers.carMessageCtrl','ico2o.controllers.carOilHistoryCtrl',
  'ico2o.controllers.beautyCareNextCtrl','ico2o.controllers.beautyCareCtrl','ico2o.controllers.carTypeCtrl',/*carCodeService*/'ico2o.services.carCodeService',
  'ico2o.controllers.maintenanceItemCtrl','ico2o.controllers.maintenanceItemNextCtrl',/*pro header*/'ico2o.controllers.proSubHeaderCtrl',/*'ico2o.filter.dateFilter',*/
  'ico2o.controllers.addHistoryCtrl','ico2o.controllers.oilHistoryCtrl','ico2o.controllers.repairShop1Ctrl','ico2o.services.order',
  /*'ico2o.controllers.productDepth0Ctrl',*/'ico2o.controllers.productDepth1Ctrl','ico2o.services.proList','ico2o.services.shopCart',/*配件和购物车服务*/'ico2o.services.receiving',/*收货地址*/
  'ico2o.controllers.productDepth2Ctrl','ico2o.controllers.productDepth3Ctrl','ico2o.controllers.productDepthCtrl',/*保养项目服务*/'ico2o.services.maintenance',
  /*'ico2o.controllers.productDetailCtrl',*/'ico2o.controllers.productListCtrl','ico2o.controllers.shareCtrl',
  'ico2o.controllers.orderCheckCtrl','ico2o.controllers.shopCartCtrl',
  'ico2o.controllers.collection', 'ico2o.controllers.forgotPassword', 'ico2o.controllers.login',
	'ico2o.controllers.register', 'ico2o.controllers.wechatlogin', 'ico2o.controllers.OnBehalOfTheCar',
	'ico2o.controllers.shippingAddress', /*'ico2o.controllers.updateAddress',*/ 'ico2o.controllers.myMessage',
	'ico2o.controllers.repairShop', 'ico2o.controllers.repair_order', 'ico2o.controllers.MaintenanceItem',
	'ico2o.controllers.bookRecord', 'ico2o.controllers.commodity', 'ico2o.controllers.sendProduct',
	'ico2o.controllers.orderMessage', 'ico2o.controllers.orderlist2', 'ico2o.controllers.orderlist',
	'ico2o.controllers.orderConfirm', 'ico2o.controllers.needToPay', 'ico2o.controllers.reservationService',
	'ico2o.controllers.returnsManagement', /*'ico2o.controllers.addAddress', 'ico2o.controllers.AddArea',*/
	'ico2o.controllers.Maintenance', 'ico2o.controllers.Maintenance', 'ico2o.controllers.personCenter',
	'ico2o.controllers.myOrder', 'ico2o.service','ico2o.controllers.getProduct','ico2o.controllers.needToCarry','ico2o.controllers.leaveMessage','ico2o.controllers.systemNotification','ico2o.controllers.personMessageCtrl',
  'ico2o.controllers.setNewPassword','ico2o.controllers.returnGoods','ico2o.productSumService',
    'ico2o.services.photo','ico2o.services.cookie','ico2o.service.wechatPay','ico2o.services.identifyService','newoldCtrl','angular-md5'])

  .run(function ($ionicPlatform,$rootScope,$q,$http,$log,locals,$location,cookieService) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });

	//document.domain = "ico2o.cn";

    /*域名*/
    $rootScope.host = "http://www.ico2o.test";//命名冲突，html页面识别不了
    $rootScope.host_ico2o = "http://www.ico2o.cn/";//图片,html页面使用这个
    $rootScope.ModelCode = '';



    //获取openid
    try{
    	//cookieService.set("OpenId","openid");
    	//cookieService.delete("OpenId");
	    if(!cookieService.get("OpenId")){
			//window.location.href = $rootScope.host + "/ASHX/MobileAPI/Pay/getOpenId.ashx?WxIndexUrl=http://m.ico2o.cn";
		}
	    else{
	    	locals.set("OpenId",cookieService.get("OpenId"));
	    }
    }catch(e){
    	alert(e.message);
    };


    $rootScope.flag_address = 0;//标记入口
		$rootScope.isKmSearch = false;
    /*pro List and ID*/
    $rootScope.list = {
      list:'',
      list_2:'',
      list_3:'',
      list_4:''
    };
    $rootScope.sortID = {
      sortOneID:'',
      sortSecondID:'',
      sortThreeID:'',
      sortFourID:''
    };
    /*获取版本号*/
    /*调试需要*/
    //locals.removeObject("ProVersion");
/*    var url_getVersion = $rootScope.host + "/ASHX/MobileAPI/Product/Version.ashx";
    var d = $q.defer();
    $http.get(url_getVersion)
      .success(function(v){
        d.resolve(v);
      })
      .error(function(error){
        $log.debug("appjs getVersion error",error);
      });
    d.promise
      .then(function(vs){
        $rootScope.proVersion = vs.ProVersion;
        console.log("vs：",vs);
      });*/

    $rootScope.isFirst = true;//调用弹窗方法执行一次，车型选择那里
  })



    /*http拦截请求*/
  .factory('HttpInterceptor', ['$q', HttpInterceptor])


//隐藏一级菜单底部导航栏
.directive('hideTabs', function($rootScope) {
  return {
    restrict: 'A',
    link: function(scope, element, attributes) {
      scope.$on('$ionicView.beforeEnter', function() {
        scope.$watch(attributes.hideTabs, function(value){
          $rootScope.hideTabs = 'tabs-item-hide';
        });
      });
      scope.$on('$ionicView.beforeLeave', function() {
        scope.$watch(attributes.hideTabs, function(value){
          $rootScope.hideTabs = 'tabs-item-hide';
        });
        scope.$watch('$destroy',function(){
          $rootScope.hideTabs = false;
        })
      });
    }
  };
});


function HttpInterceptor($q) {
  return {
    // 请求发出之前，可以用于添加各种身份验证信息
    request: function(config){
    	//config.params['USERID'] = 11111111;
//  	config.headers.cookie = '111';
		config.headers.tokenStr = 'aaa';
		config.headers.token = localStorage.token;
        console.log("拦截:",config.url);

      return config;
    },
    // 请求发出时出错
    requestError: function(err){
      return $q.reject(err);
    },
    // 成功返回了响应
    response: function(res){
      return res;
    },
    // 返回的响应出错，包括后端返回响应时，设置了非 200 的 http 状态码
    responseError: function(err){
		if(-1 === err.status) {
        // 远程服务器无响应
      } else if(401 === err.status) {
        // 401 错误一般是用于身份验证失败，具体要看后端对身份验证失败时抛出的错误
      } else if(404 === err.status) {
        // 服务器返回了 404
      }
      return $q.reject(err);
    }
  };
}
