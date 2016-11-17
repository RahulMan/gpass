'use strict';

angular.module('App')

.controller('RegisterController', ['$scope', 'authorize', '$state', function ($scope, authorize, $state) {
    $scope.register = {
		username: "",
		password: "", 
		color: ""
		};
    
    //$scope.login = true;

    $scope.doRegister = function(){
        authorize.doRegister($scope.register.username,$scope.register.password,$scope.register.color, function(user){
        //console.log ('success is '+success);
        if(user !=null){
            console.log('successful register');
        }
        else
            alert('Register failed');
        });
    };


}])

.controller('LoginController', ['$scope', 'authorize', '$state', function ($scope, authorize, $state) {
    $scope.credentials = {username: "", password: "", color: ""};
    //$scope.login = true;
	$scope.username="";

    $scope.doLogin = function(){
		//if(authorize.isLoggedIn===false){
			
        authorize.doAuth($scope.credentials.username,$scope.credentials.password,$scope.color, function(user){
        //console.log ('success is '+success);
        if(user !=null){
            console.log('successful login in controller');
			    $scope.login = true;

						$scope.username=authorize.getUsername();
						console.log('scope.username= '+$scope.username);
						//if(authorize.isLoggedIn() === true)
						$state.go('app.home', {}, {reload: true});
						//updateUsernameLabel();

        }
        else
            alert('Login failed');
        });
		//}
		//else
			//alert('Already signed In');
    };


}])

.controller('HomeManagementController', ['$scope', '$state', 'authorize', function ($scope, $state, authorize) {
  
	if(authorize.isLoggedIn() === true)
        {
			console.log('logged in username = ' +authorize.getUsername());
			$scope.username=authorize.getUsername();
        }
}])

.controller('HeaderController', ['$scope', '$state', 'authorize', '$uibModal', function ($scope, $state, authorize, $uibModal) {
   
   if(authorize.isLoggedIn() === true)
        {
			console.log('logged in username = ' +authorize.getUsername());
			$scope.username=authorize.getUsername();
        }
   
   


		/*
    else if(!$state.is('app.login'))
        $state.go('app.login', {}, {reload: true});
    $scope.stateis = function(curstate) {
       return $state.includes(curstate);  
    }; */
    $scope.loggedIn = authorize.isLoggedIn();
    $scope.username = authorize.getUsername();


    $scope.doLogout = function(){
	//if(authorize.isLoggedIn===true){

		authorize.logout();
        $state.go('app', {}, {reload: true});
	//}else
	//	alert('Not logged-In');
    };
}])

;