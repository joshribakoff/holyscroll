Holyscroll - Infinite pagination hybrid
==========
- Standalone Demo - http://joshribakoff.github.io/holyscroll/demo1.html
- Paginated Demo - http://joshribakoff.github.io/holyscroll/demo2.html

![demo gif](http://i.imgur.com/CMRofAh.gif)

#Goals#
- allow scrolling up & down "infinite" pagination style
- easily display page "links" so the user can see which page they are on, and click to a specific page.
- changing the current page from outside the directive (clicking on pages) makes the directive to scroll to that page.
- as the user scrolls pages within the directive, the directive updates the current page model for observers outside the directive to update pagination links (current page is highlighted).

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
Anywhere you want a scrolling div, call the directive `my-scroll`. 
```html
<div my-scroll id="container"
  scroll-template="page.html" 
  scroll-callback="loadPhones(page, cb)"
  scroll-page="currentPage"></div>
```
You must tell the directive what template to use to render each page, how to fetch each page, and what variable to store the "current page" number in. Below is more info on these arguments.

#scroll-callback#
This function on your controller will be called for loading each page object.

Syncronous (offline):
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

Asynchronous (remote ajax):
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
This template will render each page fetched from the server. A page can be any json serializable object. It's normally supposed to be an array of item array/objects.

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

