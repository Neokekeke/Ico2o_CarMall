/**
 * Created by HappyEveryDay on 2016/12/2.
 */
angular.module('newoldCtrl', [])
  .controller('newoldlogin',function($scope,locals,$ionicPopup,$http,$rootScope,$location,cookieService,$state){

      //获取微信openid
      //获取用户信息

    /*  var getUserInfo = "www.ico2o.cn/ASHX/MobileAPI/Pay/GetOpenidJson.ashx";
      $http({
        method: 'get',
        url: getUserInfo
      }).success(function(response){
        $rootScope.openid = response;
        //locals.set("OpenID",$scope.openid);
        //$state.go('tab.newoldlogin');
        $ionicPopup.alert({
          title: response,
          okText: '确定'
        });
        $ionicPopup.alert({
          title: response,
          okText: '确定'
        });
      }).error(function(res){
        $ionicPopup.alert({
          title: '微信登录失败',
          okText: '确定'
        });
      });
*/
    //微信登录切换注册
    $scope.weRegister = function(nickname){
      $scope.nickname = nickname;
      //o5eX5svH3TZ6dknaPh0fSNO1hkYk
      var weUrl = $rootScope.host +'/ASHX/MobileAPI/WeChat/Register.ashx';
      $http({
        method: 'POST',
        url: weUrl,
        params: {
          'openid': cookieService.get("OpenId"),
          'NickName': $scope.nickname
        }
      }).success(function(datas){
          $scope.loginState = false;
          $rootScope.UserID = datas.data[0].UserID;
          $ionicPopup.alert({
            title: datas.message,
            okText: '确定'
          });
          locals.set("username",$scope.nickname);
          $location.path("/tab/person");
        })
        .error(function(res){
          $ionicPopup.alert({
            title: res.message,
            okText: '确定'
          });
          $location.path("/tab/person");
        });
    };

    //绑定
    $scope.weBindLogin = function(un,pwd){
      //un,up分别代表用户名和密码
      var webindurl = $rootScope.host+"/ASHX/MobileAPI/WeChat/RegisterBindData.ashx";
      $http({
        method:'POST',
        url: webindurl,
        params: {
          'openid': cookieService.get("OpenId"),
          'UserName': un,
          'Pwd':pwd
        }
      }).success(function(datas){
        $scope.loginState = false;
        $rootScope.UserID = datas.data[0].UserID;
        $ionicPopup.alert({
          title: '绑定成功了',
          okText: '确定'
        });
        $ionicPopup.alert({
          title: datas.data[0].UserID,
          okText: '确定'
        });
        locals.set("username",un);
        $state.go("tab.person");
      }).error(function(res){
        $ionicPopup.alert({
          title: '绑定失败了',
          okText: '确定'
        });
        $state.go("tab.person");
      });
    };
  });
