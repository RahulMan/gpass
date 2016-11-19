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
        if($scope.register.username.length==0)
        {
            alert('Enter login');return;
        }
        if($scope.register.password.length==0)
        {
            alert('Enter password');return;
        }
        if($scope.register.color.length==0)
        {
            alert('Enter color');return;
        }
        for(var i =0;i<$scope.register.password.length;i++)
        {
            if(!$scope.register.password[i].match(/[a-z]/))
            {
                alert('Only lowercase alphabets allowed in password!')
                $scope.register.password = '';
                return;
            }
        }
        authorize.doRegister($scope.register.username,$scope.register.password,$scope.register.color, function(user){
        //console.log ('success is '+success);
        if(user !=null){
            console.log('successful register');
            $state.go('app.home', {}, {reload: true});            
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

.controller('GLoginController', ['$scope', 'authorize', '$state','$http', function ($scope, authorize, $state, $http) {
    $scope.credentials = {username: ""};
    var baseURL = authorize.getBaseURL();
    //$scope.login = true;
    $scope.username="";
    $scope.secondStep = false;
    $scope.proceedLogin = function(){
       $http({
            method: 'GET',
            url: baseURL+'users/glogin/'+$scope.username
          }).then(function successCallback(response) {
                if(response.status==200){
                    $scope.secondStep = true;
                    // console.log(response);
                    $scope.config = response.data;
                    console.log($scope.config);


                    var canvas = document.getElementById("canvas");
                    var ctx = canvas.getContext("2d");
                    var radius = canvas.height / 2;
                    ctx.translate(radius, radius);
                    radius = radius * 0.90
                    var cx=0.0,cy=0.0;


                    letterCount = -1;
                    answers = [];
                    var DIVISION_COUNT = 12;
                    var unit = (2*Math.PI)/DIVISION_COUNT;
                    var offset = unit/2.0;
                    // colors = assignColors(colors);
                    
                    var clicked = 0;


                    var drawLetters = function (ctx, radius, letters) {
                        var ang;
                        var num;
                        ctx.font = radius*0.2 + "px arial";
                        ctx.textBaseline="middle";
                        ctx.textAlign="center";
                        for(num= 0; num < 12; num++){
                            ang = (num+1) * Math.PI / 6;
                            ctx.rotate(ang);
                            ctx.translate(0, -radius*0.85);
                            ctx.rotate(-ang);
                            ctx.fillStyle = "black";
                            ctx.fillText(letters[num].toString(), 0, 0);
                            ctx.rotate(ang);
                            ctx.translate(0, radius*0.85);
                            ctx.rotate(-ang);
                        }
                    }

                    var drawSector = function(radius, start, end, color) {
                        ctx.beginPath();
                        ctx.moveTo(cx,cy);
                        ctx.arc(0,0,radius,start,end);
                        ctx.lineTo(0,0);
                        ctx.closePath();
                        ctx.fillStyle=color;
                        ctx.fill();
                    }
                    var assignColors = function(colors){
                        var randomColors = [];
                        var length = colors.length;
                        for(var i=0;i<length;i++){
                            var index = Math.floor(Math.random()*colors.length);
                            randomColors.push(colors[index]);
                            colors.splice(index,1);
                        }
                        return randomColors;
                    }
                    var drawCircle = function(radius, offset, unit, colors){
                        for(var i=0;i<12;i++)
                            drawSector(radius, offset+ i*unit, offset+ (i+1)*unit, colors[i]);
                    }
                    $scope.next = function(){
                        clicked+=2;
                        clicked=clicked%24;
                        drawCircle(radius, (clicked+1)*offset, unit, colors);
                        drawLetters(ctx,radius, letters1);
                        drawLetters(ctx,radius/1.5,letters2);
                    }
                    $scope.previous = function(){
                        clicked-=2;
                        clicked=clicked%24;
                        drawCircle(radius, (clicked+1)*offset, unit, colors);
                        drawLetters(ctx,radius, letters1);
                        drawLetters(ctx,radius/1.5,letters2);
                    }
                    var original_colors = ["yellow","green","blue","red","violet","orange","brown","aqua", "gray","white","olive","fuchsia"];

                    mapColors = function(mapping){
                        var mappedColors = original_colors.slice();
                        for(var i=0;i<mapping.length;i++)
                            mappedColors[i] = original_colors[mapping[i]];
                        console.log(mappedColors);
                        var newmappedColors = mappedColors.slice(3,13);
                        newmappedColors = newmappedColors.concat(mappedColors.slice(0,3));
                        console.log(newmappedColors);
                        return newmappedColors;

                    }
                    $scope.save = function(){
                        if(letterCount!=-1 && letterCount<$scope.config.length)
                            answers.push(clicked/2);
                        if(letterCount<$scope.config.length)
                            letterCount++;
                        if(letterCount==$scope.config.length)
                        {
                            console.log(answers);
                            $http({
                                method: 'POST',
                                url: baseURL+'users/glogin',
                                data: {answers: answers}
                              }).then(function successCallback(response) {
                                if(response.status==200){
                                        alert('successful!');
                                        authorize.setLogged_in_user($scope.username);
                                        $state.go('app.home', {}, {reload: true});
                                    }
                                    else
                                     {
                                        alert('Non 200 status code!');
                                     }
                                }, function errorCallback(response) {
                                      {
                                        alert('Incorrect password');
                                     }
                                });
                            return;
                        }
                        
                        clicked = 0;
                        // console.log($scope.config[letterCount]);
                        // console.log($scope.config[letterCount].randomColor);
                        // console.log($scope.config[letterCount].randomText);

                        colors = mapColors($scope.config[letterCount].randomColor);
                        // console.log(colors);
                        drawCircle(radius, offset, unit, colors);
                        letters1 = $scope.config[letterCount].randomText.substring(0,12).split('');
                        drawLetters(ctx,radius, letters1);
                        letters2 = $scope.config[letterCount].randomText.substring(12,24).split('');
                        drawLetters(ctx,radius/1.5,letters2);
                        
                    }
                    $scope.save();
                    





                }
                else
                 {
                    alert('User not found!');
                 }
            }, function errorCallback(response) {
                  {
                    alert('User not found!');
                 }
            });
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