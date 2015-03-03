var app = angular.module('holyscroll', []);
app.directive('holyScroll', function() {

    function link(scope, element, attrs) {

    }

    function controller($scope, $element, $http, $timeout, $interval, $location) {

        var scrollAreaHeight = $element.height();
        var loading = false;

        $scope.array = [];
        $scope.appendPage = function(pageToLoad) {
            loading = true;
            $scope.scrollCallback({
                page: pageToLoad,
                cb: function (r) {

                    r.page=pageToLoad;
                    $scope.array[pageToLoad] = r;

                    loading = false;
                    $timeout(function(){
                        $scope.setCurrentPage();
                    });
                }
            });
        }

        $scope.prependPage = function(pageToLoad) {
            loading = true;
            $scope.scrollCallback({
                page: pageToLoad,
                cb: function (r) {
                    if (0 != r.length) {
                        r.page=pageToLoad;
                        $scope.array.unshift(r);

                        // @todo - fix this?
                        // after the new DOM node page is added to the top, scroll down by it's height.
                        // prevents getting stuck in recursion when user sits at the top.
                        // however, it does cause a small flicker between when the DOM is updated & Angular runs the $timeout.
                        // only way to fix this may be to do all DOM insertions w/ jquery inside this directive, instead of it using ng-repeat?
                        $timeout(function() {
                            var firstPageHeight = $element.find('.scrollPagesWrapper div.scrollPage').height();
                            var newHeight = $($element).scrollTop() + firstPageHeight;
                            $($element).scrollTop(newHeight);
                        });
                    }
                    loading = false;
                    $timeout(function() {
                        $scope.setCurrentPage();
                    });
                }
            });
        }

        var findPageDiv = function(pageNumToFind) {
            var selector = '.scrollPagesWrapper div.scrollPage-'+pageNumToFind;
            return $element.find(selector)[0];
        }

        $scope.currentPage = function() {
            if($scope.array.length <= 1) {
                return appendPage;
            }

            var theActivePage;

            angular.forEach($scope.array, function(page, index) {
                if(theActivePage > 0) {
                    return;
                }

                var pageDiv = findPageDiv(index);
                if(undefined === pageDiv) {
                    return;
                }

                var pagesBottom = $(pageDiv).offset().top + $(pageDiv).height();

                // if the top of the page clears the bottom of the container, its active.
                if(pagesBottom >= 0) {
                    theActivePage = index;
                }
            });

            return theActivePage;
        }

        var startPage = 1;
        var appendPage = startPage;
        var prependPage = startPage;

        $scope.appendPage(appendPage);

        var last_scroll = null;

        var onScroll = function() {

            position = $element.scrollTop();

            // throttle the calculations to every 10px
            if (null == last_scroll || Math.abs(position - last_scroll) >= 10) {
                scrollAreaHeight = $element.height();
                height = $element.find('.scrollPagesWrapper').height() - scrollAreaHeight;
                $scope.setCurrentPage();

                // if already loading data, do not queue any more data for new pages at this time.
                if(loading) {
                    return;
                }

                // If the user scrolls close to the bottom, append the next page div
                if (position >= 0.9 * height) {
                    appendPage = appendPage + 1;
                    $scope.appendPage(appendPage);
                    return false;
                } else if (position <= 0.1*height) {
                    prependPage = prependPage - 1;
                    $scope.prependPage(prependPage);
                }
                last_scroll = position;
            }
        }

        $element.bind('scroll', function() { $timeout(onScroll) });

        // if the content is too short for there to be a scrollbar, add additional pages or "nudge" it up to 10x or until
        // there is enough content for there to be a scrollbar. Otherwise the user would be stuck on page 1 and unable to
        // to trigger a scroll event to load more pages.
        $scope.nudge = function() {
            var nudgeCount = 0;
            var promise = $interval(function () {
                if (nudgeCount < 10 && $element.height() >= $element.find('.scrollPagesWrapper').height()) {
                    nudgeCount++;
                    appendPage = appendPage + 1;
                    $scope.appendPage(appendPage);
                } else {
                    $interval.cancel(promise);
                }
            }, 100);
        }
        $scope.nudge();

        var scrolledToPage;
        $scope.$watch('scrollCurrentPage', function(newValue, oldValue) {
            if (newValue && typeof oldValue != 'undefined' ) {

                if(newValue == scrolledToPage) {
                    // change was due to scroll events within the directive
                } else {
                    // change was due to change outside directive, reset scope & start out at new page.
                    $scope.array = [];
                    $($element).scrollTop(0);
                    startPage = newValue;
                    appendPage = newValue;
                    prependPage = newValue;
                    $scope.appendPage(appendPage);
                    $scope.nudge();
                }
            }
        });

        $scope.setCurrentPage = function() {
            scrolledToPage = $scope.currentPage();
            $scope.scrollCurrentPage = scrolledToPage;
        }
    }

    return {
        restrict: 'A',
        template: '<div class=\"scrollPagesWrapper\">'+
                    '<div ng-repeat="page in array track by $index">'+
                        '<div ng-if="undefined !== page" class="scrollPage scrollPage-{{page.page}}" ng-include="scrollTemplate"></div>'+
                    '</div>'+
                '</div>',
        link: link,
        controller: controller,
        scope: {
            page: '=',
            scrollCallback: '&',
            scrollTemplate: '=',
            scrollCurrentPage: '='
        }
    }
});