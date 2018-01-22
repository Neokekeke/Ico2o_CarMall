/**
 * Created by huang on 2016/9/13 0013.
 */
angular.module('ico2o.controllers.addMyCarCtrl', [])
  .controller('addMyCarCtrl',function($scope,$http,$state,locals,$rootScope){
    var url_addMyCars = $rootScope.host + "/ASHX/MobileAPI/MyCars/SaveByHorse.ashx";
    $scope.AddCars = {};
    $scope.submit = function () {
      $http({
        method: 'post',
        url: url_addMyCars,
        params: {
          UserID: $rootScope.UserID,
          Horse: $scope.AddCars.Horse,
          Drive_KM: $scope.AddCars.Drive_KM,
          LastMaintenance_KM: $scope.AddCars.LastMaintenance_KM,
          LastMaintenanceDate: $scope.AddCars.LastMaintenanceDate,
          LicenseDate: $scope.AddCars.LicenseDate,
          Motor_LastSixNumber: $scope.AddCars.Motor_LastSixNumber
        }
      }).success(function (response) {
        alert("success");
        $scope.saveCar = response;
        $state.go('tab.car');
      });
    }
  });
