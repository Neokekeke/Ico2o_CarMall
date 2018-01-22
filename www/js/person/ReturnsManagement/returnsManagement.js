/**
 * Created by fan on 2016/9/18 .
 */
/*退款管理*/
angular.module('ico2o.controllers.returnsManagement', [])
  .controller('returnsManagement',function($scope,$stateParams,$ionicLoading,$http,locals,$timeout,$rootScope){
    $scope.tuihuoLists = [];
    $scope.UserID = locals.get("UserID");

    $scope.hasmore = true;
    $scope.PageNO = 1;
    $scope.PageSize = 3;
    var url = $rootScope.host +"/ASHX/MobileAPI/ReturnGood/Lists.ashx";
    $scope.myloading = $ionicLoading.show();
    $http({
      method: 'get',
      url: url,
      params: {
        UserID: $rootScope.UserID,
        PageNO:  $scope.PageNO,
        PageSize: $scope.PageSize
      }
    }).success(function (data) {
      $scope.tuihuoLists = data;
      $scope.myloading = $ionicLoading.hide();
      console.log("success", data);
    }).error(function (error) {
      console.log("error", error);
    });


    $scope.loadMore1 = function() {
      $scope.PageNO++;
      var timer = null;
      $http({
        method: 'get',
        url: url,
        params: {
          UserID: $rootScope.UserID,
          PageNO:$scope.PageNO,
          PageSize: $scope.PageSize
        }
      })
        .success(function(data) {
          console.log("当前页码数"+$scope.PageNO);
          var _data = [];
          _data = data;
          if(_data.count!=0) {
            for(var i=0;i<_data.count;i++){
              $scope.tuihuoLists.data.push(_data.data[i]);
            }


            timer = $timeout(function() {
              $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 1500);
          } else {
            /*$scope.myloading = $ionicLoading.hide();
             return false;*/
            $scope.hasmore = false;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');

        }).error(function(error) {
        console.log("error", error);
      });
      $scope.$on("$destroy", function() {
        //clearTimeout(timer.$$timeoutId);
        $timeout.cancel(timer);
        //清除配置,不然scroll会重复请求
      });
    };

  });
