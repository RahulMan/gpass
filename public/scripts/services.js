'use strict';

angular.module('App')
.constant("baseURL","http://localhost:3000/api/")
.factory('$localStorage', ['$window', function ($window) {
    return {
        store: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        remove: function (key) {
            $window.localStorage.removeItem(key);
        },
        storeObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key, defaultValue) {
            return JSON.parse($window.localStorage[key] || defaultValue);
        }
    };
}])
.service('authorize', ['$localStorage','baseURL', '$http', '$cookies', '$resource', function ($localStorage, baseURL, $http, $cookies, $resource) {

    var logged_in = false;
    var logged_in_user = '';
    var logged_in_user_object={};
    logged_in_user = $cookies.get('usernamelocal');
    var users = $resource(baseURL+"users/:username",null,  {'update':{method:'PUT' }});
    if(logged_in_user!=null && logged_in_user!='')
    {
        logged_in=true;
        console.log('login detected');
    }
    if(logged_in== true){
        users.get({username: logged_in_user})
        .$promise.then(function(user){
            logged_in_user_object=user;
            console.log('saved user obj retrieval successful. '+logged_in_user_object.username+' logged in');
        },function(response){
            console.log("Error" + response.status +" " + response.statusText);
            console.log('failed to get saved user');
        }
        );
    }

  this.doAuth = function(username,password,rememberme,next){
        $http({
            method: 'POST',
            url: baseURL+'users/login',
            data: {username: username, password: password, rememberme: rememberme}
          }).then(function successCallback(response) {
                if(response.status==200){
                       logged_in_user=username;
                       logged_in=true;
                       console.log('successful login in services :'+logged_in);
                       users.get({username: username})
                        .$promise.then(function(user){
                            logged_in_user_object=user;
                          next(user);
                          },function(response){
                            console.log("Error" + response.status +" " + response.statusText);
                            next(null);
                          }
                        );
                       
                }
                else
                 {
                    //alert('login failed services');
                    next(null);
                 }
            }, function errorCallback(response) {
                  {
                    //alert('login failed services');
                    next(null);
                 }
            });
    };
    this.getUserResource = function(){
        return users;
    }
    this.getUsername = function(){
        return logged_in_user;
    };
    this.getActiveUserObject = function(next){
        return logged_in_user_object;
    }

    this.isLoggedIn = function(){
        console.log("Logged in: "+logged_in+" "+logged_in_centre);
        return logged_in;
    };
    this.logout = function(){
        logged_in=false;
        logged_in_user='';
        $http({
            method: 'POST',
            url: baseURL+'users/logout'
        }).then(function successCallback(response) {
            if(response.status==200){
                logged_in_user='';
                logged_in=false;
            }
            else
            {
                alert('logout failed in services');
                next(null);
            }
        }, function errorCallback(response) {
            {
                alert('logout failed in services');
                next(null);
            }
        });
    };
}])
;
