angular.module('ico2o.service', [])
	//本地存储数据===================================
	.factory('locals', ['$window', function($window) {
		return {
			//存储单个属性
			set: function(key, value) {
				$window.localStorage[key] = value;
				console.log("set_O");
			},
			//读取单个属性
			get: function(key, defaultValue) {
				return $window.localStorage[key] || defaultValue;
			},
			//存储对象，以JSON格式存储
			setObject: function(key, value) {
				$window.localStorage[key] = JSON.stringify(value);
				console.log("set_OO");
			},
			//读取对象
			getObject: function(key) {
				return JSON.parse($window.localStorage[key] || '{}');
			},
			clear: function() {
				$window.localStorage.clear();
			},
			/*************/
			getDDD: function(key) {
				return $window.localStorage[key] || null;
			},
			setJSONData: function(key, value) {
				//console.log("set_OO");
				$window.localStorage[key] = JSON.stringify(value);
			},
			getJSONData: function(key) {
				//console.log("get_OO");
				return JSON.parse($window.localStorage[key] || '{}');
			},
			removeObject: function(key) {
				$window.localStorage.removeItem(key);
			},
			removeAll: function() {
				$window.localStorage.clear();
			}
		}
	}])

//处理三级联动的菜单--第四页控制器
/*.factory('findAddressService',['$http','$timeout','$q','locals','$rootScope','JSONDataService', function ($http,$timeout,$q,locals,$rootScope,JSONDataService) {
  var dataList;
  var resultID;
  var DefailReceiving;
  var GetReceivingList;
  return {
    getReceivingID:function () {
    	var defer=$q.defer();
      //获取当前列表的默认收货地址(范明炜修改)
      var url = $rootScope.host+'/ASHX/MobileAPI/Receiving/GetDefaultReceiving.ashx';
      $http({
        method: 'get',
        url: url
      }).success(function (data) {
      	defer.resolve(data);
      }).error(function (error) {
      	defer.reject();
        console.log("getReceiving error", error);
      })
      return defer.promise;
    },
    getDefaultReceiving:function(){
      return DefailReceiving;
    },
    getReceivingList:function () {
    var defer=$q.defer();
    //获取收货地址列表(范明炜修改)
    var url = $rootScope.host+'/ASHX/MobileAPI/Receiving/GetReceiving.ashx';
      var UserID = $rootScope.UserID;
    $http({
      method: 'get',
      url: url
    }).success(function (data) {
      	console.log("收货列表：", data);
        defer.resolve(data);

    }).error(function (error) {
      defer.reject();
    })
      return defer.promise;
  },
    //更改默认收货地址
    setCheckedID:function (ID) {
    var url = $rootScope.host+'/ASHX/MobileAPI/Receiving/UpdateDefaultReceiving.ashx';
    $http({
      method: 'get',
      url: url,
      params: {
        UserID: $rootScope.UserID,
        ReceivingID: ID
      }
    }).success(function (result) {
      console.log(result.result);
    })
  },
    submit_UpdateReceivingMessage:function(UpdateReceiving) {
      var url = $rootScope.host+'/ASHX/MobileAPI/Receiving/UpdateReceiving.ashx';

      $http({
        method: 'get',
        url: url,
        params: {
          //UserID: locals.get("UserID"),
          ReceivingID: UpdateReceiving.ID,
          Name: UpdateReceiving.Name,
          PostCode: UpdateReceiving.PostCode,
          Province: UpdateReceiving.Province,
          City: UpdateReceiving.City,
          District: UpdateReceiving.District,
          Address: UpdateReceiving.Address,
          Mobile: UpdateReceiving.Mobile
        }
      }).success(function (result) {
        console.log("更改收货地址:", result.result);
      })
    },
    deleteReceivingMessage:function (id, tmp) {
    var url = $rootScope.host+'/ASHX/MobileAPI/Receiving/DeleteReceiving.ashx';
    $http({
      method: 'get',
      url: url,
      params: {
        UserID: $rootScope.UserID,
        ReceivingID: id
      }
    }).success(function (result) {
      console.log("删除地址:", id, tmp, result.result);
    })
  },
    submit_addressMessgae:function (AddReceiving) {
    var url = $rootScope.host+'/ASHX/MobileAPI/Receiving/AddReceiving.ashx';
    $http({
      method: 'get',
      url: url,
      params: {
        UserID: $rootScope.UserID,
        Name: AddReceiving.Name,
        PostCode: AddReceiving.PostCode,
        Province: AddReceiving.Province,
        City: AddReceiving.City,
        District: AddReceiving.District,
        Address: AddReceiving.Address,
        Mobile: AddReceiving.Mobile
      }
    }).success(function (result) {
      console.log(AddReceiving+"AddReceiving result:" + result.result);
    })

  },
    getAddressList:function(){
    	var defer=$q.defer();
      var data = JSONDataService.getAddressDatas();
      defer.resolve(data);
      return defer.promise;
    }
  }//return

}])*/

//登录拦截判断
.factory('checkLogin', function(locals, $state, $rootScope) {
	return {
		checkLog: function(state) {//checklog是一个方法

			/*点击首页或者个人中心登录没有回退按钮*/
			if($rootScope.UserID == null) {
				if($rootScope.flag_address == 0) {
					$state.go("tab.login");
				} else if($rootScope.flag_address == 1) {
					$state.go("tab.login2");
				}
			} else {
				$state.go(state);
			}
		}
	}
})

.factory('doSum', function() {

});

/*   //上拉加载商品信息
.factory('loadMore',function($http,locals,$timeout,$rootScope){
  return {
    loadmore:function(url,PageNO,hasmore) {
      var PageSize=15;
    var timer = null;
    $http({
      method: 'get',
      url: url,
      params: {
        UserID:locals.get("UserID"),
        IsShopper: false,
        PageNO: PageNO,
        PageSize: PageSize,
        Status: ''
      }
    })
      .success(function (data) {
        console.log(PageNO);
        var _data = [];
        _data = data;
        console.log(_data.length);
        if (_data.length != 0) {
          for (var i = 0; i < _data.length; i++) {
            data.push(_data[i]);
          }


          timer = $timeout(function () {
            $rootScope.$broadcast('scroll.infiniteScrollComplete');
          }, 1500);
        } else {
       /!* $scope.myloading = $ionicLoading.hide();
           return false;*!/
          hasmore = false;
          $rootScope.$broadcast('scroll.infiniteScrollComplete');
        }
        $rootScope.$broadcast('scroll.infiniteScrollComplete');

      }).error(function (error) {
      console.log("error", error);
    });
      $rootScope.$on("$destroy", function () {
      //clearTimeout(timer.$$timeoutId);
      $timeout.cancel(timer);
      //清除配置,不然scroll会重复请求
    });
  }
}*/
