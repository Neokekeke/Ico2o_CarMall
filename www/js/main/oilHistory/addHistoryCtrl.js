/**
 * Created by huang on 2016/9/13 0013.
 * 下拉框的默认值由于$http是异步请求，所以加载的时候会有延迟，因此下拉框一开始的加载是比$http要快的，然而这时$http还未获取到数据，
 * 所以select会自动生成一个默认的option，而这个option的value属性是null
 */
angular.module('ico2o.controllers.addHistoryCtrl', [])
  .controller('addHistoryCtrl', function ($ionicPopup,$state, $ionicPopup, $cacheFactory, $rootScope, $scope, $http, locals, $timeout) {
    if ($cacheFactory.get('OilCarCache')) {
      $cacheFactory.get('OilCarCache').destroy();
    }
    var OilCarCache = $cacheFactory('OilCarCache');

    var date = new Date();
    $scope.AddOil = {
      UserID: $rootScope.UserID,
      AddTime: date,
    };
    $scope.DefaultCar = {};
    $scope.car={};
    var carIndex;
    var url_getMyCars = $rootScope.host + "/ASHX/MobileAPI/MyCars/GetMyCars.ashx";
    $http({
      method: 'post',
      url: url_getMyCars,
      params: {
        UserID: $rootScope.UserID
      }
    }).success(function (response) {
      $scope.car = response;
      for (var i = 0; i < response.length; i++) {
        if (response[i].IsDefault == true) {
          $scope.DefaultCar = response[i];
          carIndex = i;
          break;
        }
      }
      OilCarCache.put("DefaultCar", $scope.DefaultCar);
      OilCarCache.put("car", $scope.car);
    });


    $scope.checkDate = function () {
      if ($scope.AddOil.AddTime > (new Date())) {
        $ionicPopup.alert({title: '不能添加未来加油记录'});
        $scope.AddOil.AddTime = new Date();
      }
    };
    //添加加油记录
    $scope.addOil = function () {
      if (!$scope.AddOil.Car) {
        $http({
          method: 'post',
          url: $rootScope.host + "/ASHX/MobileAPI/Oilhistory/Add.ashx",
          params: {
            UserID: $rootScope.UserID,
            AddTime: $scope.AddOil.AddTime,
            Price: $scope.AddOil.Price,
            Amount: $scope.AddOil.Amount,
            PetrolType: $scope.AddOil.PetrolType,
            Total: $scope.AddOil.Total,
            Driver_KM: $scope.AddOil.Driver_KM,
            CarID: $scope.DefaultCar.ID
          }
        }).success(function () {
          $ionicPopup.alert({
            title: '添加成功',
            okText: '确定'
          });
          $state.go('tab.oilHistory');
        }).error(function () {
          alert("网络异常");
        });
      }
      else{
        $http({
          method: 'post',
          url: $rootScope.host + "/ASHX/MobileAPI/Oilhistory/Add.ashx",
          params: {
            UserID: $rootScope.UserID,
            AddTime: $scope.AddOil.AddTime,
            Price: $scope.AddOil.Price,
            Amount: $scope.AddOil.Amount,
            PetrolType: $scope.AddOil.PetrolType,
            Total: $scope.AddOil.Total,
            Driver_KM: $scope.AddOil.Driver_KM,
            CarID: angular.fromJson($scope.AddOil.Car).ID
          }
        }).success(function () {
          alert("success");
          OilCarCache.put("DefaultCar",angular.fromJson($scope.AddOil.Car));
          $state.go('tab.oilHistory');
        }).error(function () {
          alert("网络异常");
        });
      }
    };


    //通过购油金额和油的单价计算油量
    $scope.calculate = function () {
      $scope.AddOil.Total = parseFloat(($scope.AddOil.Amount / $scope.AddOil.Price).toFixed(2));
    };

    //改变下拉框时
    $scope.changeSelect = function(){
      $http({
        method: 'post',
        url: url_getMyCars,
        params: {
          UserID: $rootScope.UserID
        }
      }).success(function (response) {
        $scope.car = response;
      });
    };
    $scope.goOilHistory = function () {
      $state.go('tab.oilHistory');
    }
  });
