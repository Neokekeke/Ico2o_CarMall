/**
 * Created by fan on 2016/9/18 .
 */
angular.module('ico2o.controllers.register', [])
	.controller('register', function( $rootScope,$scope,$ionicPopup,$http,$interval,$state) {
		$scope.tip="";
		//注册
		$scope.user = {
			username: "",
			password: "",
			number: "",
			confirmPassword:""
		};

		//注册
      $scope.register = function () {
      	console.log($scope.user.username+"  "+$scope.user.password+"  "+$scope.user.number+"  "+$scope.user.confirmPassword+"  ");
      	if($scope.user.username==""||$scope.user.password==""||$scope.user.number==""||$scope.user.confirmPassword==""){
      		$scope.tip="请检查各个输入框不能为空";
      		return;
      	}

      	if($scope.user.confirmPassword!=""&&$scope.user.confirmPassword!=null&&$scope.user.password!=$scope.user.confirmPassword){
      		$scope.tip="两次密码不一致";
      		return;
      	}


        var url2 = $rootScope.host +"/ASHX/MobileAPI/PhoneVaildate/Validate.ashx";

        $http(
          {
            method: 'POST',
            url: url2,


            params: {
              'Phone': $scope.user.username,
              'Vaildate': $scope.user.number,
              'Pwd': $scope.user.password
            }
          })
          .success(function (response) {
            if (response.result == true) {
              alertPopup = $ionicPopup.alert({
                title: response.tip
              });
              console.log("sccess", response);
              console.log($scope.user.username, $scope.user.password);

              /*跳转--柯*/
              if($rootScope.flag_address == 0) {
                $state.go("tab.login");
              }
              if($rootScope.flag_address == 1) {
                $state.go("tab.login2");
              }
            }

            else {
              if (response.result == false) {
                alertPopup = $ionicPopup.alert({
                  title: response.tip
                });
                $state.go("tab.person");
              }
              console.log("error", response);
            }
            //console.log("sccess",response);
            //console.log($scope.user.username,$scope.user.password)
          })
          .error(function (response) {
            console.log("error")
          });

        /*/!*注册成功提示*!/
         var alertPopup = $ionicPopup.alert({
         title: '注册成功',
         template: '恭喜您注册成功！'
         });
         alertPopup.then(function (response) {
         //用户点击确认登录后跳转
         $state.go("tab.person");
         });*/

      };

		//获取验证码
    $scope.codetime = "获取验证码";
    //禁用验证码按钮
    $scope.codeNum = false;
		$scope.get_verification_code = function() {
			var url1 = $rootScope.host +"/ASHX/MobileAPI/PhoneVaildate/GetValidate.ashx";
			$http({
					method: 'POST',
					url: url1,

					params: {
						'PhoneNumber': $scope.user.username
					}
				})
				.success(function(response) {
					if(response.result == true) {
						alertPopup = $ionicPopup.alert({
							title: response.tip
						});
						console.log("sccess", response);
						console.log($scope.user.username);

            /*柯尊仁完成验证码倒计时*/
            $scope.time = 60;
            var timer = null;
            timer = $interval(function(){
              $scope.codeNum = true;
              $scope.time = $scope.time - 1;
              $scope.codetime = $scope.time+"秒后可重发";
              if($scope.time === 0) {
                $scope.codetime = "获取验证码";
                $scope.codeNum = false;
                $interval.cancel(timer);
              }
            }, 1000);

            $scope.user.number = "";

          }
          else {
            if (response.result == false) {
              if(response.tip == "您已注册过,无法再次注册,可以通过忘记密码来找回密码")
              {
                alertPopup = $ionicPopup.alert({
                title: response.tip
                });
                $state.go("tab.forgotPassword");
              }
             else {
                alertPopup = $ionicPopup.alert({
                  title: response.tip
                });
              }
            }
            console.log("error", response);
          }
        })
				.error(function(response) {
					console.log("error")
				})
		}
	})

/*控制按钮禁用指令*/
.directive('clickAndDisable', function() {
  return {
    scope: {
      clickAndDisable: '&'
    },
    link: function(scope, iElement, iAttrs) {
      iElement.bind('click', function() {
        iElement.prop('disabled',true);
        scope.clickAndDisable().finally(function() {
          iElement.prop('disabled',false);
        })
      });
    }
  }
});


