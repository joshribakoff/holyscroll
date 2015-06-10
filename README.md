Holyscroll - Infinite pagination hybrid for Angular JS
==========
- Simple infinite scrolling div - http://joshribakoff.github.io/holyscroll/demo1.html
- Combine with ui.bootstrap pagination - http://joshribakoff.github.io/holyscroll/demo2.html
- Reddit API feed with negative scrolling - http://joshribakoff.github.io/holyscroll/demo3.html

![demo gif](http://i.imgur.com/CMRofAh.gif)

#What#
This is "hybrid" pagination/infinite scrolling. It is an AngularJS directive that lets you add infinite scrollers. Inspired by this example - http://scrollsample.appspot.com/items

It has these benefits:
- Scroll up to "negative" pages infinitely
- Scroll down infinitely
- Stores the current page number on your scope
- Ability to define a callback for loading your data
- Ability to define custom template for rendering each page.
- Easy to add pagination links
- Easy to bind the current page to the URL/back button.
- Provides an API for jumping to arbitrary pages.

#Install#
This package is available via bower & follows standard conventions. Manually save `directive.js` or use bower to install it:

```
bower install holyscroll --save
```

Include the JS in your HTML sources, after Angular:
```html
<script src="bower_components/holyscroll/directive.js"></script>
```

Tell Angular to add it as a dependency to your app:
```js
var app = angular.module('app', ['holyscroll']);
```

#Usage#
Anywhere you want a scrolling div, call the directive `holy-scroll`. 
```html
<div holy-scroll>
```

You must also pass in some additional HTML attributes - You must tell the directive what template to use to render each page, where to fetch each page, and what variable to store the "current page" number in on your scope. 
```html
<div holy-scroll
  scroll-template="page.html" 
  scroll-callback="loadItems(page, cb)"
  scroll-page="currentPage"></div>
```


#scroll-callback#
This function on your controller will be called for loading each page object.

in your template: 
```html
<div holy-scroll scroll-callback="loadItems(page, cb)"
```

synchronous (offline) callback:
```js
$scope.loadItems = function(page, cb) {
    var items = [];
    // do something here to get the items for the requested page ....
    
    cb(items); // then, return items
}
```

asynchronous (remote ajax) callback:
```js
$scope.loadItems = function(page, cb) {
    // do an ajax call to fetch from the server the items for the requested page
    $http.get('items?page='+page).success(function(r) {
      // then, return items
      cb(items);
    });
}
```

#scroll-template#
This template filename will be loaded & used to render each page fetched from the server.

Usage:
```html
 <div holy-scroll scroll-template="page.html"></div>
 ```

Example "page.html" - example template for when your `page` returned by the callback is an array of item objects, each item having keys "name", & "img".
```html
<div ng-repeat="item in page" class="item">
  <h1>{{item.name}}</h1>
  <img ng-src="{{item.img}}" />
  <!-- etc.. -->
</div>
```

You can structure your page object any way you want. For simplicity, its recommended that a page be an array of items. How you structure the "items" is up to you.


#isLoading#
The model assigned to this attribute will be set to `true` if an ajax call is pending, and set back to `false` when all network requests have completed. Use it to show/hide a loading indicator.

# roadmap #
- for convenience, should be able to pass URL as a string instead of callback, if you do this, it assumes your page object is an array of items, and you can avoid the boilerplate hell of wiring up all the asyncronous logic every time.
