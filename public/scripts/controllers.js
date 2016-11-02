'use strict';

angular.module('App')

.controller('LoginController', ['$scope', 'authorize', '$state', function ($scope, authorize, $state) {
    $scope.credentials = {username: "", password: "", color: ""};
    $scope.display_centre = false;
    $scope.rememberme=false;
    $scope.login = true;

    $scope.doLogin = function(){
        authorize.doAuth($scope.credentials.username,$scope.credentials.password,$scope.rememberme, function(user){
        //console.log ('success is '+success);
        if(user !=null){
            console.log('successful login in controller');
        }
        else
            alert('Login failed');
        });
    };


}])

.controller('HomeManagementController', ['$scope', '$state', 'authorize', function ($scope, $state, authorize) {
    if(authorize.isLoggedIn() === true)
        $state.go('app.home', {}, {reload: true});
    else
        $state.go('app.login', {}, {reload: true});
}])

.controller('HeaderController', ['$scope', '$state', 'authorize', '$uibModal', function ($scope, $state, authorize, $uibModal) {
    if(authorize.isLoggedIn() === true)
        {

        }
    else if(!$state.is('app.login'))
        $state.go('app.login', {}, {reload: true});
    $scope.stateis = function(curstate) {
       return $state.includes(curstate);  
    }; 
    $scope.loggedIn = authorize.isLoggedIn();
    $scope.username = authorize.getUsername();

    $scope.changePasswordOpen = function(){
            var user = authorize.getActiveUser();
            var modalInstance = $uibModal.open({
              templateUrl: 'views/changePasswordModal.html',
              controller: 'ChangePasswordModalController',
              size:'sm' 
            });
        };

    $scope.logout = function(){
        authorize.logout();
        $state.go('app', {}, {reload: true});
    };
}])

;