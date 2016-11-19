'use strict';
//add resolve objects
angular.module('App', ['ui.router','ngResource','ngDialog','ui.bootstrap','ngMaterial', 'ngMessages','ngCookies'])
.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
            // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                        controller : 'HeaderController'
                    },
                    'content': {
                        controller  : 'HomeManagementController'
                    },
                    'footer': {
                        templateUrl : 'views/footer.html',
                        //controller : 'FooterController'
                    }
                }

            })
			.state('app.home', {
                url:'home',
                views: {
					'header': {
                        templateUrl : 'views/header.html',
                        controller : 'HeaderController'
                    },
                    'content@': {
                        templateUrl : 'views/home.html',
                       // controller: 'HeaderController'           
                    }
                }

            })
            .state('app.login', {
                url:'login/',
                views: {
                    'content@': {
                        templateUrl : 'views/login.html',
                        controller  : 'LoginController'        
                    }
                }

            })

            .state('app.glogin', {
                url:'glogin/',
                views: {
                    'content@': {
                        templateUrl : 'views/glogin.html',
                        controller  : 'GLoginController'        
                    }
                }

            })

            .state('app.register', {
                url:'register/',
                views: {
                    'content@': {
                        templateUrl : 'views/register.html',
                        controller  : 'RegisterController'
                    }
                }

            })

            

            ;
            $urlRouterProvider.otherwise('/');
        })
;
