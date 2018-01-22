/**
 * Created by fan on 2016/9/18 .
 */
angular.module('ico2o.controllers.personCenter', [])
  .controller('personCenter',function($cacheFactory,$scope,locals,$state,$http,$location,$rootScope,checkLogin,$ionicPopup){
    if ($cacheFactory.get("reservationService_cache")) {
      $cacheFactory.get("reservationService_cache").destroy();
    }
    $cacheFactory("reservationService_cache");

    $scope.UserID = locals.get("UserID");
  	$scope.loginState = true;
  	$scope.balance = 0;
  	$scope.integral = 0;
  	$scope.couponNum = 0;
    $scope.UserName = locals.get("username");

  	//console.log( locals.get("username")!=null);
	if($rootScope.UserID !=null){
		$scope.loginState = false;
		$http({
			url:$rootScope.host +"/ASHX/MobileAPI/balance/get.ashx",
			method: 'POST',
			params: {
	          'userId': $rootScope.UserID
	        }
		}).success(function(data){
			$scope.balance = data.balance;
		});
		//获取积分
		$http({
			url:$rootScope.host +"/ASHX/MobileAPI/integral/get.ashx",
			method: 'POST',
			params: {
	          'userId': $rootScope.UserID
	        }
		}).success(function(data){
			$scope.integral = data.integral;
		});
	}

    /*车型更正需要登陆后才能选择--柯*/
    if($rootScope.UserID)
    {
      $scope.changeCars = false;
    }
    else {
      $scope.changeCars = true;
    }

	/*获取车型数据*/
    var getCarCode = function(){
      $scope.CarCode = locals.getObject("carCode");
      $rootScope.flag_address = 0;
    };
    getCarCode();

    $scope.$on('$stateChangeSuccess', getCarCode);


    //我的订单
    $scope.myOder1 = function(){
      checkLogin.checkLog("tab.my_Order");
    };

    //我的收藏
    $scope.collection1 = function(){
      checkLogin.checkLog("tab.collection");
    };

    //预约维修店
    $scope.Maintenance1 = function(){
     /* checkLogin.checkLog("tab.Maintenance");*/
      $ionicPopup.alert({
        title: '该功能即将推出，敬请期待',
        okText: '确定'
      });
    };

    //商品评价
    $scope.ReservationCommodity1 = function(){
      /*checkLogin.checkLog("tab.evaluateList");*/
      $ionicPopup.alert({
        title: '该功能即将推出，敬请期待',
        okText: '确定'
      });
    };

    //商品评价暂无
    $scope.notFinish = function(){
      var alertPopup = $ionicPopup.alert({
        title: '<b>商品评价</b>',
        template: '<center>商品评价功能即将开放！</center>'
      });
    };

    //收货地址
    $scope.shippingAddress1 = function(){
      checkLogin.checkLog("tab.shippingAddress");
    };

    //退换货管理
    $scope.returnsManagement1 = function(){
      checkLogin.checkLog("tab.returnsManagement");
    };

    //代购车
    $scope.OnBehalOfTheCar1 = function(){
      checkLogin.checkLog("tab.OnBehalOfTheCar");
    };

    //预约记录
    $scope.ReservationRecord1 = function(){
      /*checkLogin.checkLog("tab.bookRecord");*/
      $ionicPopup.alert({
        title: '该功能即将推出，敬请期待',
        okText: '确定'
      });
    };

    //系统通知
   $scope.SystemNotification1 = function(){
     /*checkLogin.checkLog("tab.systemNotification");*/
     $ionicPopup.alert({
       title: '该功能即将推出，敬请期待',
       okText: '确定'
     });
    };

    //购物车
    $scope.shopCart1 = function(){
      checkLogin.checkLog("tab.shopCart1");
    };

    //预约商品
    $scope.bookGoods = function(){
      $ionicPopup.alert({
        title: '该功能即将推出，敬请期待',
        okText: '确定'
      });
    }

  });
