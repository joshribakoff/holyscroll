(function() {
    'use strict';

    angular.module('holyscroll', [])
        .directive('holyScroll', holyScroll);

    holyScroll.$inject = ['$timeout', '$interval'];

    function holyScroll($timeout, $interval) {
        return {
            restrict: 'A',
            template: '<div class=\"scrollPagesWrapper\">' +
                        '<div ng-repeat="page in array track by $index">' +
                            '<div ng-if="undefined !== page" class="scrollPage scrollPage-{{page.page}}" ng-include="scrollTemplate"></div>' +
                         '</div>' +
                      '</div>',
            link: link,
            scope: {
                page: '=',
                loading: '=?isLoading',
                scrollCallback: '&',
                scrollTemplate: '=',
                scrollCurrentPage: '='
            }
        };

        function link($scope, $element) {
            var scrollAreaHeight = $element.height();
            var scrolledToPage;

            var last_scroll = null;

            var startedPage = 1;
            var appendedPage = startedPage;
            var prependedPage = startedPage;

            $scope.loading = false;
            $scope.array = [];

            appendPage(startedPage);
            nudge();

            function appendPage(pageToLoad) {
                $scope.loading = true;
                $scope.scrollCallback({
                    page: pageToLoad,
                    cb: function(r) {
                        $scope.loading = false;
                        if(false === r) {
                            return;
                        }
                        r.page = pageToLoad;
                        $scope.array[pageToLoad] = r;

                        $timeout(function() {
                            setCurrentPage();
                        });
                    }
                });
            }

            // if the content is too short for there to be a scrollbar, add additional pages or "nudge" it up to 10x or until
            // there is enough content for there to be a scrollbar. Otherwise the user would be stuck on page 1 and unable to
            // to trigger a scroll event to load more pages.
            function nudge() {
                var nudgeCount = 0;
                var promise = $interval(function() {
                    if (nudgeCount < 10 && $element.height() >= $element.find('.scrollPagesWrapper').height()) {
                        nudgeCount++;
                        appendedPage = appendedPage + 1;
                        appendPage(appendedPage);
                    } else {
                        $interval.cancel(promise);
                    }
                }, 100);
            }

            function onScroll() {
                var position = $element.scrollTop();
                var height;

                // throttle the calculations to every 10px
                if (null === last_scroll || Math.abs(position - last_scroll) >= 10) {
                    scrollAreaHeight = $element.height();
                    height = $element.find('.scrollPagesWrapper').height() - scrollAreaHeight;
                    setCurrentPage();

                    // if already loading data, do not queue any more data for new pages at this time.
                    if ($scope.loading) {
                        return;
                    }

                    // If the user scrolls close to the bottom, append the next page div
                    if (position >= 0.9 * height) {
                        appendedPage = appendedPage + 1;
                        appendPage(appendedPage);
                        return false;
                    } else if (position <= 0.1 * height) {
                        prependedPage = prependedPage - 1;
                        prependPage(prependedPage);
                    }
                    last_scroll = position;
                }
            }

            function prependPage(pageToLoad) {
                $scope.loading = true;
                $scope.scrollCallback({
                    page: pageToLoad,
                    cb: function(r) {
                        $scope.loading = false;
                        if(false === r) {
                            return;
                        }
                        if (0 != r.length) {
                            r.page = pageToLoad;
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

                        $timeout(function() {
                            setCurrentPage();
                        });
                    }
                });
            }

            function setCurrentPage() {
                scrolledToPage = getCurrentPage();
                $scope.scrollCurrentPage = scrolledToPage;
            }

            function getCurrentPage() {
                var theActivePage;

                if ($scope.array.length <= 1) {
                    return appendedPage;
                }

                angular.forEach($scope.array, function(page, index) {
                    var pageDiv;
                    var pagesBottom;

                    if (theActivePage > 0) {
                        return;
                    }

                    pageDiv = findPageDiv(index);

                    if (undefined === pageDiv) {
                        return;
                    }

                    pagesBottom = $(pageDiv).offset().top + $(pageDiv).height();

                    // if the top of the page clears the bottom of the container, its active.
                    if (pagesBottom >= 0) {
                        theActivePage = index;
                    }
                });

                return theActivePage;

                function findPageDiv(pageNumToFind) {
                    var selector = '.scrollPagesWrapper div.scrollPage-' + pageNumToFind;
                    return $element.find(selector)[0];
                }
            }

            $element.bind('scroll', function() {
                $timeout(onScroll);
            });

            $element.bind('mousemove', function() {
                $timeout(onScroll);
            });

            $scope.$watch('scrollCurrentPage', function(newValue, oldValue) {
                if (newValue && typeof oldValue !== 'undefined') {
                    if (newValue === scrolledToPage) {
                        // change was due to scroll events within the directive
                        return;
                    }

                    // change was due to change outside directive, reset scope & start out at new page.
                    $scope.array = [];
                    $($element).scrollTop(0);
                    appendedPage = newValue;
                    prependedPage = newValue;
                    appendPage(appendedPage);
                    nudge();
                }
            });
        }
    }
})();
