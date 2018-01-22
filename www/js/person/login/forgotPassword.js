/**
 * Created by fan on 2016/9/18 .
 */
angular.module('ico2o.controllers.forgotPassword', [])
	.controller('forgotPassword', function($scope, $http, $ionicPopup,$state, locals,$rootScope,$interval) {
		$scope.user = {
			username: "",
			password: "",
			number: ""
		};

		//获取验证码
    $scope.codetime = "获取验证码";
		$scope.get_verification_code = function() {
			var url3 = $rootScope.host +"/ASHX/MobileAPI/PhoneVaildate/ForgetPwd.ashx";
			$http({
					method: 'POST',
					url: url3,

					params: {
						'PhoneNumber': $scope.user.username
					}
				})
				.success(function(response) {
					//locals.set("user.username", $scope.user.username);

          /*柯尊仁完成验证码倒计时*/
          if(response.result == true)
          {
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
            console.log("成功");
          }

          else {
            console.log(response);
          }
            alertPopup = $ionicPopup.alert({
              title: response.tip
            });


				})
				.error(function(response) {
					console.log("error")
				})
		};

		//验证验证码
		$scope.confirm_verification_code = function() {

			var url = $rootScope.host +"/ASHX/MobileAPI/PhoneVaildate/ForgetPasswordValidate.ashx";
			$http({
					method: 'POST',
					url: url,

					params: {
						'Phone': $scope.user.username,
						'Vaildate':$scope.user.number

					}
				})
				.success(function(response) {
					locals.set("user.username", $scope.user.username);
					if($rootScope.flag_address == 0){
						$state.go("tab.setNewPassword",{Phone:$scope.user.username});
					}
					if($rootScope.flag_address == 1){
						$state.go("tab.setNewPassword2",{Phone:$scope.user.username});
					}

				})
				.error(function(response) {
          if(response.result==false){
            alertPopup = $ionicPopup.alert({
              title: response.tip

            });
            return;
          }
					console.log("error");
				})
		};
	});
