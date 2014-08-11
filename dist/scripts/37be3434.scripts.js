"use strict";var app=angular.module("pizzaSharerApp",["ngCookies","ngResource","ngSanitize","ngRoute","firebase"]);app.config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/order",{templateUrl:"views/order.html",controller:"OrderCtrl"}).when("/orders/:orderid",{templateUrl:"views/orderview.html",controller:"OrderCtrl"}).otherwise({redirectTo:"/"})}]).constant("FIREBASE_URL","https://sharpizza.firebaseio.com/"),app.controller("MainCtrl",["$scope","Auth","FIREBASE_URL","$firebaseSimpleLogin","$location","$firebase",function(a,b,c,d,e){var f=new Firebase(c),g=(d(f),new Firebase(c+"orders"));a.loginWithFacebook=function(){b.login("facebook").then(function(){})},a.logout=function(){b.logout()},a.newOrder=function(){e.path("/order")},a.$on("$firebaseSimpleLogin:login",function(){b.signedIn()&&(a.username=b.getUsername())}),a.showOrders=function(){b.signedIn()&&g.startAt(b.getUid()).endAt(b.getUid()).once("value",function(a){var b=a.val();console.log("obj"+b)})}}]),app.factory("Auth",["$firebaseSimpleLogin","FIREBASE_URL","$rootScope",function(a,b,c){var d=new Firebase(b),e=a(d),f={login:function(a){return e.$login(a)},signedIn:function(){return null!==e.user},logout:function(){e.$logout()},getUid:function(){return e.user.uid},getUsername:function(){return e.user.displayName}};return c.signedIn=function(){return f.signedIn()},c.logout=function(){return f.logout().then(function(){$location.path("/")})},c.$on("$firebaseSimpleLogin:login",function(){c.username=e.user.displayName,c.uid=f.getUid()}),f}]),app.controller("OrderCtrl",["$scope","$firebase","FIREBASE_URL","$location","$routeParams","Auth","Order",function(a,b,c,d,e,f,g){var h=e.orderid,i=new Firebase(c+"orders/"+h),j=new Firebase(c+"orders/"+h+"/suborders/"),k=b(i).$asObject(),l=b(j).$asArray(),m=!1,n=!1;a.numbersArray=[1,2,3,4,5],a.typesArray=["Olives","Onions","Mushrooms"],a.subOrders=[],a.addSubOrder=function(){a.subOrders.push({num:a.numSlices,type:a.sliceType}),a.isOrderView()&&(g.addSubOrderToOrder(i,f.getUid(),f.getUsername(),a.subOrders),a.subOrders=[])},a.deleteSubOrder=function(b){a.subOrders.splice(b,1)},a.shareOrder=function(){f.signedIn()&&g.create(f.getUid(),f.getUsername(),a.order.name).then(function(b){var c=new Firebase(b).name();g.addSubOrderToOrder(b,f.getUid(),f.getUsername(),a.subOrders),a.subOrders=[],d.path("/orders/"+c)})},a.isOrderView=function(){return h},a.isOwner=function(){return m&&h?f.signedIn()&&f.getUid()===a.order.ownerid?!0:!1:void 0},k.$loaded().then(function(){a.order=k,m=!0}),l.$loaded().then(function(){a.subOrdersArray=l,n=!0})}]),app.factory("Order",["$firebase","FIREBASE_URL","$q",function(a,b,c){var d=new Firebase(b+"orders"),e=a(d),f={create:function(a,b,d){var f={ownerid:a,username:b,ordername:d},g=e.$ref(),h=g.push().name(),i=g+"/"+h,j=c.defer();return g.child(h).setWithPriority(f,a,function(a){a?j.reject(a):j.resolve(i)}),j.promise},addSubOrderToOrder:function(b,c,d,e){angular.forEach(e,function(e){var f={userid:c,displayname:d,numslices:e.num,slicetype:e.type},g=new Firebase(b+"/suborders"),h=a(g);h.$push(f)})}};return f}]);