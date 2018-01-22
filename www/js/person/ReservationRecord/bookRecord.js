/**
 * Created by fan on 2016/9/18 .
 */
angular.module('ico2o.controllers.bookRecord', [])
  .controller('bookRecord',function($scope,$http,locals,$timeout,$rootScope,$log){
    $scope.PageNO = 1;
    $scope.PageSize = 3;
    $scope.UserID = $rootScope.UserID;
    $scope.hasmore = true;
    $scope.bookRecord = [];

    $http({
      method: "post",
      url: $rootScope.host +"/ASHX/MobileAPI/Booking/List.ashx",
      params: {
        UserID:$rootScope.UserID,
        PageNO:$scope.PageNO,
        PageSize:$scope.PageSize,
        OrderBy:"CreatedDate"
      }
    }).success(function (response) {
      $scope.bookRecord= response;
      $scope.hasmore=true;
     $scope.tranStatus($scope.bookRecord.data);
      $log.debug($scope.bookRecord.data[0].Status);
      for(var i=0;i<$scope.bookRecord.count;i++){
        var date = new Date($scope.bookRecord.data[i].BookingDate);
        $scope.bookRecord.data[i].BookingDate = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
    /*    $scope.bookRecord.data[i].ItemName = "";
        for(var j=0;j<$scope.bookRecord.data[i].MaintenanceItemName.length;j++){
          $scope.bookRecord.data[i].ItemName += ("<br />"+$scope.bookRecord.data[i].MaintenanceItemName[j]);
        }*/
      }

      //显示预约记录对应的维修店
      $scope.Maintenance_match = [];
      $http({
        method: "post",
        url: $rootScope.host +"/ASHX/MobileAPI/Maintenance/GetDetail.ashx",
        params: {
          MaintenanceID:$scope.bookRecord.data[0].MaintenanceID
        }
      }).success(function (response) {
        $scope.Maintenance_match[0]= response;
        $scope.bookRecord.data[0].Maintenance_match = $scope.Maintenance_match[0];
        for(var i=1;i<$scope.bookRecord.data.length;i++){
          if($scope.bookRecord.data[i-1].MaintenanceID == $scope.bookRecord.data[i].MaintenanceID){
            $scope.Maintenance_match[i] = $scope.Maintenance_match[i-1];
          }
          else{
            $http({
              method: "post",
              url: $rootScope.host +"/ASHX/MobileAPI/Maintenance/GetDetail.ashx",
              params: {
                MaintenanceID:$scope.bookRecord.data[i]
              }
            }).success(function (response) {
              $scope.Maintenance_match[i]= response;
            });
          }
          $scope.bookRecord.data[i].Maintenance_match = $scope.Maintenance_match[i];
        }
      });
    });

    $scope.loadMore1 = function() {

      $scope.PageNO++;
      var timer = null;
      $http({
        method: 'get',
        url: $rootScope.host +"/ASHX/MobileAPI/Booking/List.ashx",
        params: {
          UserID: $rootScope.UserID,
          IsShopper: false,
          PageNO:$scope.PageNO,
          PageSize: $scope.PageSize,
          OrderBy:"CreatedDate"
        }
      })
        .success(function(response) {
          console.log("当前页码数"+$scope.PageNO);
          var _data = [];
          _data = response;
          $scope.tranStatus(_data.data);
          //console.log("每页的长度"+JSON.stringify(_data) );
          if(_data.count!=0) {
            for(var i=0;i<_data.count;i++){
              var date = new Date(_data.data[i].BookingDate);
              _data.data[i].BookingDate = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
              $scope.bookRecord.data.push(_data.data[i]);
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
    }

    $scope.tranStatus = function(data){
      for(var i=0;i<data.length;i++)
      {
        if(data[i].Status == "Appointment")
        {
          data[i].Status = "预约中";
        }
      }
    };
  });
