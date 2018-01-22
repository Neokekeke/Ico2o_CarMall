/**
 * Created by fan on 2016/9/18 .
 */
angular.module('ico2o.controllers.Maintenance', [])
  .controller('Maintenance', function ($state, $cacheFactory, $scope, $http, $ionicLoading, $rootScope, $ionicHistory) {

    $scope.locationRecord={};
    var lat;
    var lng;

    $http({
      method: 'post',
      url: "http://api.map.baidu.com/highacciploc/v1",
      params: {
        ak: "rFz2vjNTyjDqlCs0i3AhU8IRLWIsS6d1",
        qterm:"mb",
        coord: "bd09ll"
      }
    }).success(function (response) {
      $scope.locationRecord = response;
      console.log(response);
    }).error(function(){
      lat = 113.542256;
      lng = 22.356717;
    });

      $http({
        method: 'post',
        url: $rootScope.host + "/ASHX/MobileAPI/Maintenance/NearMaintenance.ashx",
        params: {
          longitude: 113.542256,
          latitude: 22.356717
        }
      })
        .success(function (response) {
          $scope.repairShop = response;
          var map = new BMap.Map("allmap-third");
          map.centerAndZoom(new BMap.Point(113.53771448718041, 22.354824927994915), 12);

          var data_info = [];
          var RShop; //利用URL传递的维修店对象
          for (var i = 0; i < $scope.repairShop.length; i++) {
            RShop = JSON.stringify($scope.repairShop[i]);
            data_info[i] = [$scope.repairShop[i].Longitude, $scope.repairShop[i].Latitude, $scope.repairShop[i].Garage +
            "<br>地址:" + $scope.repairShop[i].Address +
            "<br><a class='button button-block button-small button-assertive' href=\'#/tab/reservationService?RShop=" + RShop + "\'>我的预约</a>"
            ];
          }
          var opts = {
            width: 0, // 信息窗口宽度
            height: 0, // 信息窗口高度
            title: "维修店", // 信息窗口标题
            enableMessage: true //设置允许信息窗发送短息
          };
          for (var i = 0; i < data_info.length; i++) {
            var marker = new BMap.Marker(new BMap.Point(data_info[i][0], data_info[i][1])); // 创建标注
            var content = data_info[i][2];
            map.addOverlay(marker); // 将标注添加到地图中
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
            var infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象
            map.openInfoWindow(infoWindow, point); //开启信息窗口
          }

        });

    $scope.goBackUp = function () {
      $state.go("tab.person");
    }
  });
