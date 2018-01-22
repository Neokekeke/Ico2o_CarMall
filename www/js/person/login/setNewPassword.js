/**
 * Created by Happy Every Day on 2016/9/27.
 */
angular.module('ico2o.controllers.setNewPassword',[])
  .controller('setNewPassword',function($scope,$state,$ionicPopup,$http,$stateParams,locals,$rootScope,md5){
	$scope.user = {
			username: "",
			password: "",
			number: "",
			confirmPassword:""
		};
		$scope.user.username = $stateParams.Phone;
    $scope.updatePassword = function(){
    	var url = $rootScope.host +'/ASHX/MobileAPI/UserInfor/ForgetPassword.ashx';
    	$http({
					method: 'POST',
					url: url,
					params: {//(md5.createHash($scope.user.password)).toUpperCase(),
            Pwd: (md5.createHash($scope.user.password)).toUpperCase(),
						UserName: $scope.user.username
					}
				})
				.success(function(response) {

					alertPopup = $ionicPopup.alert({
                	title: response.tip
              		});
              		if(response.result==true){
              			/*修改状态切换--黄*/
              			if($rootScope.flag_address == 0) {
                      $state.go("tab.login");
                    }
                    if($rootScope.flag_address == 1) {
                      $state.go("tab.login2");
                    }
              		}
				});
    };

  });
