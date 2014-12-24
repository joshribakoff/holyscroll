holyscroll
==========

This is a work in progress.

Goals:
- allow scrolling up & down "infinite" pagination style
- easily display page "links" so the user can see which page they are on, and click to a specific page.
- changing the current page from outside the directive causes the directive to scroll to that page.
- as the user scrolls pages within the directive, the directive updates the current page model for observers outside the directive to update pagination links.
- the directive doesn't need to handle rendering the page links. That warrants a separate wrapper directive which observes & mutates the "currentPage" model that the directive exports.

Anywhere you want a scroll container:
```
<div my-scroll id="container"
  scroll-template="page.html" 
  scroll-callback="loadPhones(page, cb)"
  scroll-page="currentPage"></div>
```

#scroll-callback#
Directive will call this function on your controller for loading each page object.

#scroll-template#
The template to bind to each page object. In this template, iterate your items. Usually your page would be an array of item objects you'd iterate in the page template.
```
<div ng-repeat="item in page" class="item">{{item}}</div>
```

#Implementation Notes#
User passes in template file, callback for loading a page, and current page binding (changing this outside directive causes scroll animation). Scrolling within the directive updates this for outside observers.

When user hits top or bottom edge of container, call callback for prev/next page. If it returns false we are at the results boundary. Display a "no more items" message if applicable (not applicable if we started on 1st page and user tried scrolling up).

The load page callback returns a page object. This can be any JS object the user chooses. Its anticipated it would usually be an array of "item" objects/array, which are also user defined.

As user scrolls, figure out which page is visible and update the `currentPage` binding.

To find the current page, iterate all pages in DESC order until we find one where the page's top edge is above the containers bottom edge.

$watch `currentPage`, if it changes outside the directive, find the bound page <div>, calculate it's scrollTop() then scroll() the container to that value.

When not enough items on 1st page to get a scrollbar, 2nd page will never load - Set a flag at startup. When loadPage calls back, set a $timeout for 0ms to run after DOM update. If height of loaded pages doesn't exceed container (eg. there's no scrollbar), trigger the next page to load. If the height is sufficient, unset the flag (currently uses an interval, works but prone to race condition).



