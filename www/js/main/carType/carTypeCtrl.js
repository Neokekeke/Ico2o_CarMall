/**
 * Created by huang on 2016/9/13 0013.
 */
angular.module('ico2o.controllers.carTypeCtrl', [])
  .controller('carTypeCtrl',function($scope,$http,$ionicLoading,$ionicPopup,locals,$ionicHistory,$rootScope,$log,carCodeService,$state){
    /*柯尊仁完成功能*/
    /*刘文星修改为级联获取数据*/
    /*选择绑定车系*/
    $scope.select = {
      /*选择的车的信息*/
      Brand: '', /*品牌*/
      CarXi: '', /*车系*/
      Year: '', /*年份*/
      Engine: '', /*排量*/
      Configuration: '', /*版本*/
      Gearbox: ''                 /*波箱*/
    };

    $scope.UpDateCar = ["--请选择--"];/*更新*/
    $scope.CarBrand = [];/*品牌*/
    $scope.CarXi = [];/*车系*/
    $scope.Years = [];/*年份*/
    $scope.Engines = [];/*排量*/
    $scope.Configuration = [];/*版本*/
    $scope.Gearbox = [];/*波箱*/

    var GetBrandUrl = $rootScope.host + "/ASHX/MobileAPI/CarType/GetBrand.ashx";
    var GetCarXiUrl = $rootScope.host + "/ASHX/MobileAPI/CarType/GetCarXi.ashx";
    var GetYearUrl = $rootScope.host + "/ASHX/MobileAPI/CarType/GetYear.ashx";
    var GetEnginesUrl = $rootScope.host + "/ASHX/MobileAPI/CarType/GetEngines.ashx";
    var GetConfigurationUrl = $rootScope.host + "/ASHX/MobileAPI/CarType/GetConfiguration.ashx";
    var GetGearboxUrl = $rootScope.host + "/ASHX/MobileAPI/CarType/GetGearbox.ashx";
    var updateUrl = $rootScope.host + "/ASHX/MobileAPI/CarType/Update.ashx";

    var GetBrand = function () {/*更新*/

      $scope.myloading = $ionicLoading.show();

      /*品牌*/
      $http({
        method: 'get',
        url: GetBrandUrl,
        params: {}
      }).success(function (data) {
        $scope.CarBrand = data;
        $scope.select.Brand = data[0];
//						console.log("品牌：success", data);
        $scope.myloading = $ionicLoading.hide();
      }).error(function (error) {
        console.log("error", error);
      });
    };
    /*车系*/
    $scope.$watch('select.Brand', function (newValue, oldValue, scope) {

      $http({
        method: 'get',
        url: GetCarXiUrl,
        params: {
          Brand: newValue
        }
      }).success(function (data) {
        $scope.CarXi = [];
        angular.forEach(data, function (item) {
          if (item) $scope.CarXi.push(item);
        });

//        console.log("车系：success", $scope.CarXi);

      }).error(function (error) {
        console.log("error", error);
      });
    });


    /*年份*/
    $scope.$watch('select.CarXi', function (newValue, oldValue, scope) {
      if (!newValue) {
        $scope.Years = [];
        return;
      }
      $http({
        method: 'get',
        url: GetYearUrl,
        params: {
          CarXi: newValue
        }
      }).success(function (data) {
          $scope.Years = [];
          angular.forEach(data, function (item) {
            if (item)
              $scope.Years.push(item);
        });
//		    console.log("年份：success", data);
      }).error(function (error) {
        console.log("error", error);
      });

    });

    /*排量*/
    $scope.$watch("select.Year", function () {
      if (!$scope.select.Year) {
        $scope.Engines = [];
        return;
      }

      $http({
        method: "get",
        url: GetEnginesUrl,
        params: {
          CarXi: $scope.select.CarXi,
          Year: $scope.select.Year
        }
      }).success(function (data) {
        $scope.Engines = data;
//	  			console.log("engies 排量:" ,data)
      }).error(function (error) {
        console.log("error", error);
      });

    });

    /*版本*/
    $scope.$watch("select.Engine", function (newData, OldData, scope) {
      if (!newData) {
        $scope.Configuration = [];
        return;
      }
      $http({
        method: "get",
        url: GetConfigurationUrl,
        params: {
          CarXi: $scope.select.CarXi,
          Year: $scope.select.Year,
          Engine: $scope.select.Engine
        }
      }).success(function (data) {
        $scope.Configuration = data;
				//console.log("版本 configuration: ", data);
      }).error(function (error) {
        console.log("error: ", error);
      });
    });

    /*波箱*/
    $scope.$watch("select.Configuration", function () {
      if (!$scope.select.Configuration) {
        $scope.Gearbox = [];
        return;
      }
      $http({
        method: "get",
        url: GetGearboxUrl,
        params: {
          CarXi: $scope.select.CarXi,
          Year: $scope.select.Year,
          Engine: $scope.select.Engine
        }
      }).success(function (data) {
        $scope.Gearbox = data;
//				console.log("波箱 gearbox:" ,data);
      }).error(function (error) {
        console.log("error", error);
      });

    });

    $scope.CarMessage = true;
    /*选择切换车型*/
    //$scope.CarCode = [];
    /*存储用户输入horse号码的车型*/
    $scope.GetModelCodeByHorse = [];
    var url7 = $rootScope.host + "/ASHX/BnuzNewWebAPI/CarType/GetCarByHorse.ashx";
    var url8 = $rootScope.host + "/ASHX/MobileAPI/CarType/GetModelCodeByHorse.ashx";
    $scope.GetCarByHorse = function (GetModelCode) {
      $scope.CarMessage = false;
      /*根据车架号获取车款代码*/
      $http({
        method: 'POST',
        url: url8,
        params: {
          Horse: GetModelCode
        }
      }).success(function (data) {
        $scope.GetModelCodeByHorse = data;
        $scope.myloading = $ionicLoading.hide();
        console.log("success", data);

        /*根据车架号获取车型信息*///方法一
        $http({
          method: 'POST',
          url: url7,
          params: {
            Horse: GetModelCode
          }
        }).success(function (data) {
          //$scope.CarCode = data;

          //两个接口返回数据不一样，做参数赋值处理即可
          $scope.select.Brand = data.Models;
          $scope.select.CarXi = data.carXi;
          $scope.select.Engine = data.Engine;
          $scope.select.Year = data.ProDate;
          $scope.select.Configuration = data.Configuration;


          locals.setObject("carCode",$scope.select);
          $scope.myloading = $ionicLoading.hide();
          console.log("success", data);
          //$scope.func1 = 1;   /*车型选择方式一*/
          //locals.setObject("func1",$scope.func1);
          $state.go('tab.main');
          /*判断车款代码是否一致*/
          if ($scope.GetModelCodeByHorse.ModelCode == $scope.CarCode.ModelCode) {
            var alertPopup = $ionicPopup.alert({
              title: '绑定车型成功！'
            });
          }
        }).error(function (error) {
          console.log("error", error);
        })

      }).error(function (error) {
        var alertPopup = $ionicPopup.alert({
          title: "系统暂未收录您的车架号，我们将会早日补全信息,请选择方法二",
          okText: "确定"
        });
      });
    };

    /*通过级联选择车型*/
    $scope.ModelCode = [];
    var url10 = $rootScope.host + "/ASHX/MobileAPI/CarType/GetModelCode.ashx";
    $scope.GetModelCode1 = function (CarXi, Year, Engine, Gearbox) {
      $http({
        method: 'POST',
        url: url10,
        params: {
          CarXi: CarXi,
          Year: Year,
          Engine: Engine,
          Gearbox: Gearbox
        }
      }).success(function (data) {
        $scope.ModelCode = data;
        locals.set("ModelCode",data[data.length-1]);
        $scope.myloading = $ionicLoading.hide();
        console.log("success", data);
      }).error(function (error) {
        console.log("error", error);
      })
    };

    $scope.CarCode1 = [];
    $scope.bindMycar = [];//提交后绑定我的爱车
    /*存储自定义选择的车型*///方法二
    $scope.Confirm = function () {
      var url11 =$rootScope.host + "/ASHX/MobileAPI/MyCars/SaveByCarXi.ashx";
      $scope.CarMessage = true;
      /*车系选择切换*/
      //ng-model绑定的数值
      $scope.CarCode1.Models = $scope.select.Brand;
      $scope.CarCode1.Gearbox = $scope.select.Gearbox;
      $scope.CarCode1.Engine = $scope.select.Engine;
      $scope.CarCode1.ProDate = $scope.select.Year;
      $scope.CarCode1.Configuration = $scope.select.Configuration;
      $scope.CarCode1.CarXi = $scope.select.CarXi;
      $scope.CarCode1.ModelCode = locals.get("ModelCode");
      /*console.log($scope.select.Brand);
      console.log($scope.select.Gearbox);
      console.log($scope.select.Engine);
      console.log($scope.select.Year);
      console.log($scope.select.Configuration);
      console.log("code"+JSON.stringify($scope.select));*/

      $http({
        method:"post",
        url:url11,
        params:{
          UserID:$rootScope.UserID,
          Brand:$scope.select.Brand,
          CarXi:$scope.select.CarXi,
          Year:$scope.select.Year,
          Engine:$scope.select.Engine,
          Gearbox:$scope.select.Gearbox,
          Configuration:$scope.select.Configuration,
          ModelCode:locals.get("ModelCode")
        }
      }).success(function(data){
        $scope.bindMycar = data;
        //locals.set("bindMycar",$scope.bindMycar);
        $log.debug("绑定我的爱车",data,locals.get("ModelCode"));
      }).error(function(error){
        $log.debug(error);
      });




      $scope.GetModelCode1($scope.select.CarXi,$scope.select.Year,$scope.select.Engine,$scope.select.Gearbox);
      locals.setObject("carCode1",JSON.stringify($scope.CarCode1));  //保存

      locals.set("CarMessage",$scope.CarMessage);
      locals.setObject("carCode",$scope.select);

      $log.debug("carcode cartype",$scope.CarCode);
      $ionicHistory.goBack();
    };
    GetBrand();

  });
