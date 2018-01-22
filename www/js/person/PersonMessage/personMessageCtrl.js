/**
 * Created by Happy Every Day on 2016/9/20.
 */
angular.module('ico2o.controllers.personMessageCtrl',[])
  .controller('personMessageCtrl',function($scope,$ionicActionSheet,$http,$ionicPopup,$location,locals,$state,Util,$rootScope,$log,cookieService){
    //显示登录状态,true代表未登录，false代表已登录
    $scope.loginState = true;

    /*绑定手机*/
    $scope.bindPhone1 ='';
    $scope.BindPhoneComplete = function(bindPhone1){
      $scope.bindPhone = bindPhone1;
    }

    /*用户上传头像*/
    $scope.photo = function()
    {
      $ionicActionSheet.show({
        buttons: [
          { text: '<b>拍照</b>' },
          { text: '<b>从相册里面选择<b>' }
        ],
        titleText: '上传图片',
        cancelText: '取消',
        cancel: function() {
          console.log("取消上传照片！");
        },
        buttonClicked: function(index) {
          if(index == 0)
          {
            console.log("拍照");
          }
          else if(index == 1)
          {
            console.log("选择相册照片");
          }
        }
      });
    };

    /*用户上传头像*/
    $scope.reader = new FileReader();   //创建一个FileReader接口
    $scope.form = {     //用于绑定提交内容，图片或其他数据
      image:{}
    };
    $scope.thumb = {};      //用于存放图片的base64

    $scope.img_upload = function(files) {       //单次提交图片的函数
      $scope.guid = (new Date()).valueOf();   //通过时间戳创建一个随机数，作为键名使用
      $scope.reader.readAsDataURL(files[0]);  //FileReader的方法，把图片转成base64
      $scope.reader.onload = function(ev) {
        $scope.$apply(function(){
          $scope.thumb[$scope.guid] = {
            imgSrc : ev.target.result //接收base64
          }

          var data = new FormData();      //以下为像后台提交图片数据
          data.append('File1', files[0]);
          //data.append('guid',$scope.guid);
          $http({
            method: 'post',
            url: $rootScope.host +'/ASHX/MobileAPI/ImageUpload2.ashx',
            /*params:{
              imgStr:$scope.thumb[$scope.guid].imgSrc
            }*/
            data:data
            //headers: {'Content-Type': undefined},
            //transformRequest: angular.identity
          }).success(function(data) {
            if (data.result_code == 'SUCCESS') {
              console.log($scope.form);
              $scope.form.image[data.guid] = data.result_value;
              $scope.thumb[data.guid].status = 'SUCCESS';

            }
            if(data.result_code == 'FAIL'){
              console.log(data)
            }
          })

        });
      };


    };

    $scope.submit_form = function(){
      $http({
        method: 'post',
        url: $rootScope.host +'/ASHX/MobileAPI/ImageUpload.ashx',
        params:{
          imgStr:$scope.thumb[$scope.guid].imgSrc
        },
        data:$scope.form
      }).success(function(data) {
        console.log(data);

      }).error(function(data){
        console.log(data);
      })
    };

    /*用户修改性别*/
    $scope.sex = " ";
    $scope.selectSex = function(){
      $ionicActionSheet.show({
        buttons: [
          { text: '<b>男</b>' },
          { text: '<b>女<b>' }
        ],
        titleText: '选择性别',
        cancelText: '确认',
        cancel: function() {
          console.log("取消！");
        },
        buttonClicked: function(index) {
          if(index == 0)
          {
            $scope.sex = "男";
            console.log("男");
          }
          else if(index == 1)
          {
            $scope.sex = "女";
            console.log("女");
          }
          locals.set("sex",$scope.sex);
        }
      });

    };

    /*清空昵称*/
    $scope.nickName1 = locals.get("nickName");
    $scope.empty = function()
    {
      document.getElementById("form").reset();//清空表单数据，不存储
      $scope.nickName = " ";
      $scope.nickName = locals.set("nickName",$scope.nickName);
      console.log("清空"+$scope.nickName1);
    };

    /*完成修改昵称*/
    $scope.Namecomplete = function(nickName1){
      $scope.nickName = nickName1;
      $scope.nickName = locals.set("nickName",$scope.nickName);
      console.log(nickName1,$scope.nickName);
    };

    /*绑定QQ*/
    $scope.BindQQComplete = function(bindQQ1){
      $scope.bindQQ = bindQQ1;
      locals.set("bindQQ",$scope.bindQQ);
    };


    /*绑定微信*/
    $scope.BindWechatComplete = function(){
      var bw = $rootScope.host +"/ASHX/MobileAPI/WeChat/BingData.ashx";
      $http({
        method: 'POST',
        url: bw,
        params: {
          'openid': locals.get("OpenId")
        }
      }).success(function(res){
          alert("进入"+locals.get("OpenId"));
          if(res.error_code == 00){
            alert("成功");
            $bindWechat = "绑定成功"
          }
      }).error(function(err){
        alert("没获取openid");
        if(res.error_code == 01 ||res.error_code == 10||res.error_code == 20){
          alert("失败了");
          }
        });
    };


    //更换手机号
    //$scope.checkPhone = "hello";
    $scope.getVerification = function(){


    };


    //显示登录状态,true代表未登录，false代表已登录
    $scope.loginState = true;
    $scope.user={
      username:"",
      password:""

    };

    if(locals.get("username")){
      $scope.user.username = locals.get("username");
      $scope.user.password = locals.get("password");
      $scope.UserID = locals.get("UserID", $scope.UserID);
    }

    if($rootScope.UserID != null)
    {
      $scope.loginState = false;
    }

    /*登陆界面*/
    $scope.fail = false; // 登陆失败提示
    $scope.login = function() {
      var url4 = $rootScope.host +"/ASHX/MobileAPI/Login.ashx";
      $http({
        method: 'POST',
        url: url4,
        withCredentials: true,

        params: {
          'UserName': $scope.user.username,
          'Pwd': $scope.user.password
        }
      })
        .success(function(response) {
          if(response.result == true) {
            $scope.fail = false;
            $scope.loginState = false;
            $scope.incomplete = true;
            //存储数据
            locals.set("username", $scope.user.username);
            //locals.set("password", $scope.user.password);
            //locals.set("UserID", response.UserID);
            $rootScope.UserID = response.UserID;//定义全局的UserID

            cookieService.set('username',$scope.user.username);
            cookieService.set('password',$scope.user.password);

            //读取数据
            //console.log(locals.get("username", ""));


            //console.log("success", $rootScope.UserID);
            //console.log($scope.user.username, $scope.user.password);
            //$scope.closeModal_login();

            if($rootScope.flag_address == 0){
              $location.path("/tab/person");
            }
            else{
            	$location.path("/tab/main");
            }

            /*修改登录后的状态--黄*/
            //$ionicHistory.goback();
           /* alertPopup = $ionicPopup.alert({
              title: response.tip
            });*/
            //console.log(response.UserID);
            //$scope.UserID = response.UserID;
            //当登录成功后关闭当前model

            /* alertPopup.then(function (response) {
             //用户点击确认登录后跳转
             $state.go('tab.person',{'username':$scope.user.username,'password':$scope.user.password});
             });*/

          } else {
            //console.log((md5.createHash($scope.user.username)).toUpperCase());
            if(response.result == false) {
              $scope.edit = true;
             /* alertPopup = $ionicPopup.alert({
                title: response.tip
              });*/
              $scope.fail = true;
              $scope.loginFail = "账号或密码错误";
              console.log("error", response);
            }
          }

          //绑定我的车型


          /* console.log("success",response);
           console.log($scope.user.username,$scope.user.password);*/
        })
        .error(function(response) {
          console.log("error", response)
        });

      /*var alertPopup = $ionicPopup.alert({
       title: '登录成功',
       template: '恭喜您登录成功！'
       });
       alertPopup.then(function (response) {
       //用户点击确认登录后跳转
       $state.go("tab.person");
       });*/

    };


    //用户退出登录
    $scope.logout = function () {
      $scope.user={
        username:'',
        password:''
      };
      //$scope.closeModal_login();
      $scope.loginState = true;
      locals.clear();

      $rootScope.UserID = null;

      locals.removeObject("CarCode");
      if($rootScope.flag_address == 0){
        $location.path("/tab/person");

      }
      else{
        $location.path("/tab/main");
      }

      cookieService.delete('authBSG');
    };

    //微信登陆
    /*$scope.wechatLogin = function(){
      alertPopup = $ionicPopup.alert({
        title: cookieService.get("OpenId")
      });
      var weurl = $rootScope.host+"/ASHX/MobileAPI/WeChat/Login.ashx";
      $http({
        method: 'POST',
        url: weurl,
        params: {
          openid:cookieService.get("OpenId")
        }
      })
        .success(function(res){
          alertPopup = $ionicPopup.alert({
            title: res
          });
          $location.path("/tab/person");
        })
      .error(function(res){
        alertPopup = $ionicPopup.alert({
          title: res
        });
      });
    };*/

    //微信授权登陆
   /* $scope.wechatAuth = function(){
      var wechatUrl = 'https://open.weixin.qq.com/connect/qrconnect';
      $http({
        method: 'POST',
        url: wechatUrl,
        params: {
          appid : 'wx9a9d92fafb13171e',
          redirect_uri : 'www.ico2o.cn',
          response_type : 'code',
          scope : 'snsapi_login',
          state: 'STATE#wechat_redirect'
        }
      })
        .success(function(res){
         console.log("成功");
          $location.path("/tab/person");
        })
        .error(function(res){
          console.log("失败");
        });
    };*/

    //微信登录切换
    /*$scope.weLogin = function(){
      //console.log("2222222"+locals.get("OpenId"));
      /!*var weUrl = "http://www.ico2o.cn/ASHX/MobileAPI/Pay/GetOpenid.ashx?WxIndexUrl=http://m.ico2o.cn/^/tab/newoldlogin";
*!/
      /!*$http({
        method: 'POST',
        url: weUrl
      }).success(function(res){
          var getOpenid = "www.ico2o.cn/ASHX/MobileAPI/Pay/GetWXUserinfo.ashx";
          $http({
            method: 'POST',
            url: getOpenid
          }).success(function(response){
            $scope.openid = response.openid;
            locals.set("openid",$scope.openid);
            $state.go('tab.newoldlogin');
          }).error(function(res){
            $ionicPopup.alert({
              title: '微信登录失败',
              okText: '确定'
            });
          });
        })
        .error(function(res){
          $ionicPopup.alert({
            title: '微信登录失败',
            okText: '确定'
          });
        });*!/
    };*/

    //判断openid是否存在
   /* $scope.isRegister = true;
    if(cookieService.get("OpenId")){
      $scope.isRegister = false;//微信直接登录按钮显示
    }
    else {
      $scope.isRegister = true;//微信注册按钮显示
    }*/

    //微信跳转到新用户注册或登录界面
    $scope.goOpenid = function(){
      location.href="http://www.ico2o.cn/ASHX/MobileAPI/Pay/GetOpenid.ashx?WxIndexUrl=http://m.ico2o.cn/!/tab/newoldlogin";
    };

    /*$ionicPopup.alert({
      title: cookieService.get("OpenId"),
      okText: '确定'
    });*/

    //微信登录接口
    $scope.weLogin = function(){
      var weLogin = $rootScope.host+"/ASHX/MobileAPI/WeChat/Login.ashx";
      $http({
        method:'POST',
        url: weLogin,
        params: {
          'openid': cookieService.get("OpenId")
        }
      }).success(function(datas){
        $rootScope.UserID = datas.data[0].UserID;
        $scope.loginState = false;
        $ionicPopup.alert({
          title: datas.message,
          okText: '确定'
        });
        locals.set("username",datas.data[0].UserName);
        $state.go("tab.person");
      }).error(function(res){
        $ionicPopup.alert({
          title: res.message,
          okText: '确定'
        });
        $state.go("tab.person");
      });
    };


    //存储的数据
    var getMessage = function(){
      $scope.bindQQ = locals.get("bindQQ");
      $scope.bindWechat = locals.get("bindWechat");
      $scope.nickName = locals.get("nickName");
      $scope.sex = locals.get("sex");
    };
    // getCarCode();

    //监听状态变化
    $scope.$on('$stateChangeSuccess', getMessage);

    /*$scope.$watch('email' ,function() {
      $scope.message = 'Your email Hash is: ' + md5.createHash("123" || '');
    });*/


    //https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9a9d92fafb13171e&redirect_uri=http://www.ico2o.cn&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect
  });
