/**
 * Created by zhang on 2016/11/25.
 * 这里的加油记录显示的时候结束时间EndTime查询的时候要加一天，否则查不到当天的记录，例如11月30日的记录，EndTime必须是要12月1日才能查询到
 */
angular.module('ico2o.controllers.carOilHistoryCtrl', [])
  .controller('carOilHistoryCtrl',function($timeout,$state,$cacheFactory,$scope,$stateParams,$rootScope,$http,$ionicHistory,locals){
    $scope.car = $cacheFactory.get("carCache").get("car");
    var date = new Date();
    var date2 = new Date();
    date2.setMonth(date.getMonth() - 3);
    var dateEnd = new Date();
    dateEnd.setDate(date.getDate()+1);
    $scope.OilRecord = {
      UserID: $rootScope.UserID,
      PageNo: 1,
      PageSize: 5,
      EndTime: date,
      StartTime: date2
    };
    $scope.OilRecord_got = [];
    $scope.PageNO = 1;
    $scope.hasmore = false;


    //查看加油记录
    $scope.selectOil = function () {
      if($scope.OilRecord.PageNo<=1){
        $http({
          method: 'post',
          url: $rootScope.host + "/ASHX/MobileAPI/Oilhistory/Get.ashx",
          params: {
            UserID: $rootScope.UserID,
            CarID: $scope.car.ID,
            StartTime: $scope.OilRecord.StartTime.getFullYear() + "-" + ($scope.OilRecord.StartTime.getMonth() + 1) + "-" + $scope.OilRecord.StartTime.getDate(),
            EndTime: dateEnd.getFullYear() + "-" + (dateEnd.getMonth() + 1) + "-" + dateEnd.getDate(),
            PageNO: $scope.OilRecord.PageNo,
            PageSize: $scope.OilRecord.PageSize
          }
        }).success(function (response) {
          for (var i = 0; i < response.length; i++) {
            $scope.OilRecord_got.push(response[i]);
          }
          $scope.hasmore = true;
          $scope.OilRecord.PageNo++;
        }).error(function () {
          alert("网络异常");
        })
      }
    };

    $scope.selectOil();

    //通过购油金额和油的单价计算油量
    $scope.calculate = function () {
      $scope.AddOil.Total = parseFloat(($scope.AddOil.Amount / $scope.AddOil.Price).toFixed(2));
    };

    //删除加油记录
    $scope.deleteOilRecord = function (ID, index) {
      $http({
        method: 'post',
        url: $rootScope.host + "/ASHX/MobileAPI/Oilhistory/Delete.ashx",
        params: {
          UserID: $rootScope.UserID,
          OilHistoryID: ID
        }
      }).success(function () {
        $scope.OilRecord_got.splice(index, 1);
      }).error(function () {
        alert("网络异常");
      })
    };

    $scope.loadMore1 = function () {
      $scope.PageNO++;
      var timer = null;
      var start = $scope.OilRecord.StartTime.getFullYear() + "-" + ($scope.OilRecord.StartTime.getMonth() + 1) + "-" + $scope.OilRecord.StartTime.getDate();
      var end = dateEnd.getFullYear() + "-" + (dateEnd.getMonth() + 1) + "-" + dateEnd.getDate();
      $http({
        method: 'post',
        url: $rootScope.host + "/ASHX/MobileAPI/Oilhistory/Get.ashx",
        params: {
          UserID: $rootScope.UserID,
          CarID: $scope.car.ID,
          StartTime: start,
          EndTime: end,
          PageNO: $scope.PageNO,
          PageSize: $scope.OilRecord.PageSize
        }
      })
        .success(function (data) {
          console.log("当前页码数" + $scope.PageNO);
          var _data = [];
          _data = data;

          console.log("每页的长度" + _data.length);
          if (_data.length != 0) {
            for (var i = 0; i < _data.length; i++) {
              $scope.OilRecord_got.push(_data[i]);
            }

            timer = $timeout(function () {
              $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 1500);
          } else {
            /*$scope.myloading = $ionicLoading.hide();
             return false;*/
            $scope.hasmore = false;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');

        }).error(function (error) {
        console.log("error", error);
      });
      $scope.$on("$destroy", function () {
        //clearTimeout(timer.$$timeoutId);
        $timeout.cancel(timer);
        //清除配置,不然scroll会重复请求
      });
    };
  });
