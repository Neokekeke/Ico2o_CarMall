/**
 * Created by huang on 2016/9/13 0013.
 */
angular.module('ico2o.controllers.repairShop1Ctrl', [])
  .controller('repairShop1Ctrl',function($scope,$http,$ionicLoading){

    $scope.load = $ionicLoading.show();
    /*  $http({
     method: 'post',
     url: "http://api.map.baidu.com/location/ip",
     params: {
     ak:"vG4efWKLR0eVGwHR2S6FCNGR87LMOQ2R",
     coor:"bd09ll"
     }
     }).success(function (response) {
     $scope.locationRecord = response;*/
    $http({
      method: 'post',
      url: "http://www.ico2o.cn/ASHX/MobileAPI/Maintenance/NearMaintenance.ashx",
      params: {
        longitude: 113.53771448718041,
        latitude: 22.354824927994915
      }
    })
      .success(function (response) {
      $scope.repairShop = response;
      var map = new BMap.Map("allmap-first");
      map.centerAndZoom(new BMap.Point(113.53771448718041, 22.354824927994915), 12);

      var data_info = [];
      for (var i = 0; i < $scope.repairShop.length; i++) {
        data_info[i] = [$scope.repairShop[i].Longitude, $scope.repairShop[i].Latitude, $scope.repairShop[i].Garage
        + "<br>地址:" + $scope.repairShop[i].Address
        + "<br><button onclick='alert(11);'>预约</button>"];
      }
      data_info[$scope.repairShop.length] = [113.53771448718041, 22.354824927994915, "测试"];
      var opts = {
        width: 0,     // 信息窗口宽度
        height: 0,     // 信息窗口高度
        title: "维修店", // 信息窗口标题
        enableMessage: true//设置允许信息窗发送短息
      };
      for (var i = 0; i < data_info.length; i++) {
        var marker = new BMap.Marker(new BMap.Point(data_info[i][0], data_info[i][1]));  // 创建标注
        var content = data_info[i][2];
        map.addOverlay(marker);               // 将标注添加到地图中
        addClickHandler(content, marker);
      }
      function addClickHandler(content, marker) {
        marker.addEventListener("click", function (e) {
          openInfo(content, e)
        });
      }
      function openInfo(content, e) {
        var p = e.target;
        var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
        var infoWindow = new BMap.InfoWindow(content, opts);  // 创建信息窗口对象
        map.openInfoWindow(infoWindow, point); //开启信息窗口
      }

      $scope.load = $ionicLoading.hide();
      /*     });*/
    });
  })
