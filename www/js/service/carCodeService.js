/**
 * Created by huang on 2016/9/26 0026.
 */
angular.module('ico2o.services.carCodeService', [])
  .service('carCodeService',function ($q,$http,locals,$rootScope,$log) {
    var url_getModelCodenotLogin = $rootScope.host+"/ASHX/MobileAPI/CarType/GetModelCode.ashx";
    var url_getModelCodelogin = $rootScope.host + "/ASHX/MobileAPI/MyCars/GetMyCars.ashx";
    var deff;
    /*string CarXi,string Year,string Engine,string Gearbox*///获取车款代码
    var get_ModelCode_notLogin = function(carCode){
      deff = $q.defer();
      $http(
        {
          method:'post',
          url:url_getModelCodenotLogin,
          params:{
            CarXi:carCode.CarXi,
            Year:carCode.Year,
            Engine:carCode.Engine,
            Gearbox:carCode.Gearbox
          }
        }
      )
        .success(function(result){
          $log.debug('get modelCode',result);
          deff.resolve(result);
        })
        .error(function(error){
          $log.error("获取车型错误");
        });
      return deff.promise;
    };

    var get_ModelCode_login = function(UserID){
      deff = $q.defer();
      $http(
        {
          method:'post',
          url: url_getModelCodelogin,
          params:{
            UserID:UserID
          }
        }
      )
        .success(function(result){
          $log.debug("123",result[0]);
          locals.setObject("ModelCode1",result[0]);
          deff.resolve(result);
          //ModelCode = result[0].ModelCode;
          //$log.debug("ModelCode",ModelCode);
        })
        .error(function(error){
          //$log.debug("error get ModelCode");
          $log.error("获取车型错误");
        });
      return deff.promise;
    };

    return{
      //获取车款代码
      get_ModelCode_notLogin:get_ModelCode_notLogin,
      get_ModelCode_login:get_ModelCode_login
    }
  });
