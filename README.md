Holyscroll - Infinite pagination hybrid for Angular JS
==========
- Standalone Demo - http://joshribakoff.github.io/holyscroll/demo1.html
- Paginated Demo - http://joshribakoff.github.io/holyscroll/demo2.html

![demo gif](http://i.imgur.com/CMRofAh.gif)

#What#
This is "hybrid" pagination/infinite scrolling. It is an AngularJS directive that lets you add infinite scrollers. It has these benefits:
- Scroll up & down "infinite scrolling" style.
- Current page is highlighted in the page number links.
- Click on the page number links to navigate to a specific page (forwards/backwards).
- Easily add the current page to the URL (html5 push state), so users can direct link to a specific page, and not break the "back" button.

#Install#
This package is available via bower & follows standard conventions. Manually save `directive.js` or use bower to install it:

```
bower install holyscroll --save
```

Include the JS in your HTML sources, after Angular:
```
<script src="bower_components/holyscroll/directive.js"></script>
```

Tell Angular to add it as a dependency to your app:
```
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
  scroll-callback="loadPhones(page, cb)"
  scroll-page="currentPage"></div>
```


#scroll-callback#
This function on your controller will be called for loading each page object.

in your template: 
```html
<div holy-scroll scroll-callback="loadPhones(page, cb)"
```

in your controller - Syncronous (offline):
```js
$scope.loadPhones = function(page, cb) {
    // build an array of items for the requested page
    var items = [];
    for(i=page*perPage-perPage+1; i<=page*perPage; i++) {
        items.push('Phone '+i);
    }
    
    // return items
    cb(items);
}
```

in your controller - Asynchronous (remote ajax):
```js
$scope.loadPhones = function(page, cb) {
    // build an array of items for the requested page
    $http.get('/items?page='+page).success(function(r) {
      // return items
      cb(items);
    });
}
```

#scroll-template#
This template filename will be loaded & used to render each page fetched from the server. A page can be any json serializable object. It's normally supposed to be an array of item array/objects.

```html
 <div holy-scroll scroll-template="page.html"></div>
 ```

Example "page.html" for when your page object is an array of item strings:
```html
<div ng-repeat="item in page" class="item">{{item}}</div>
```

Example "page.html" for when your page object is an array of item objects
```html
<div ng-repeat="item in page" class="item">
  <h1>{{item.name}}</h1>
  <img ng-src="{{item.img}}" />
  <!-- etc.. -->
</div>
```

# roadmap #
- replace non visible pages with empty space of appropriate height (remove non visible DOM nodes).
- for convenience, should be able to pass URL as a string instead of callback, if you do this, it assumes your page object is an array of items, and you can avoid the boilerplate hell of wiring up all the asyncronous logic every time. would also export a flag to calling scope to indicate status (1=loading, 0=idle), can then use this value with ng-show on your loading indicator, etc.
- should the directive modify the URL, or leave it up the calling scope/some kind of wrapper directive?
- ability to scroll right & left, instead of up & down? could be kinda fun.
- jquery plugin version of this thing?
- MeteorJS plugin ("smart package") for this thing? Ability to paginate reactive collections could be fun.

