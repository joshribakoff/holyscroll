phonecatApp.directive('myScroll', function() {

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
                    if (0 != r.length) {
                        r.page=pageToLoad;
                        $scope.array.push(r);
                    }
                    loading = false;
                    $timeout(function(){
                        $scope.scrollCurrentPage = $scope.currentPage();
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
                            var newHeight = $($element).scrollTop()+firstPageHeight;
                            $($element).scrollTop(newHeight);
                        });
                    }
                    loading = false;
                    $timeout(function() {
                        $scope.scrollCurrentPage = $scope.currentPage();
                    });
                }
            });
        }

        $scope.currentPage = function() {
            if($scope.array.length == 1) {
                return appendPage;
            }

            var position = $element.scrollTop();
            var containerHeight = $element.height();

            for (var index = $scope.array.length-1; index >= 0; --index) {
                if(prependPage<0) {
                    var page = index - Math.abs(prependPage);
                } else {
                    var page = index;
                }

                var pageDiv = $element.find('.scrollPagesWrapper div.scrollPage')[index];
                var pagesTop = $(pageDiv).offset().top;

                // if the top of the page clears the bottom of the container, its active.
                if(pagesTop<containerHeight) {
                    return page;
                }
            }
        }

        var appendPage = 1;
        var prependPage = appendPage;
        $scope.appendPage(appendPage);

        var last_scroll = null;

        var onScroll = function() {
            if(loading) {
                return;
            }
            position = $element.scrollTop();
            height = $element.find('.scrollPagesWrapper').height() - scrollAreaHeight;

            // throttle the calculations to every 10px
            if (null == last_scroll || Math.abs(position - last_scroll) >= 10) {
                $scope.scrollCurrentPage = $scope.currentPage();

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
        var nudgeCount = 0;
        var promise = $interval(function() {
            if (nudgeCount < 10 && $element.height() >= $element.find('.scrollPagesWrapper').height()) {
                nudgeCount++;
                appendPage = appendPage + 1;
                $scope.loadPage(appendPage);
            } else {
                $interval.cancel(promise);
            }
        }, 100);
    }

    return {
        restrict: 'A',
        template: '<div class=\"scrollPagesWrapper\">'+
                    '<div ng-repeat="page in array">'+
                        '<div class="scrollPage" ng-include="scrollTemplate"></div>'+
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