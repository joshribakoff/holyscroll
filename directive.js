phonecatApp.directive('myScroll', function() {

    function link(scope, element, attrs) {

    }

    function controller($scope, $element, $http, $timeout, $interval, $location) {

        var scrollAreaHeight = $element.height();

        $scope.array = [];
        $scope.appendPage = function(pageToLoad) {
            $scope.scrollCallback({
                page: pageToLoad,
                cb: function (r) {
                    if (0 != r.length) {
                        $scope.array.push(r);
                    }
                }
            });
        }

        $scope.prependPage = function(pageToLoad) {
            $scope.scrollCallback({
                page: pageToLoad,
                cb: function (r) {
                    if (0 != r.length) {
                        $scope.array.unshift(r);
                        // after the new DOM node page is added to the top, scroll down by it's height.
                        $timeout(function() {
                            var firstPageHeight = $element.find('.scrollPagesWrapper div.scrollPage').height();
                            var newHeight = $($element).scrollTop()+firstPageHeight;
                            $($element).scrollTop(newHeight);
                        });
                    }
                }
            });
        }

        var appendPage = 1;
        var prependPage = appendPage;
        $scope.appendPage(appendPage);

        var last_scroll = null;
        var onScroll = function() {
            position = $element.scrollTop();
            height = $element.find('.scrollPagesWrapper').height() - scrollAreaHeight;

            // throttle the calculations to every 10px
            if (null == last_scroll || Math.abs(position - last_scroll) >= 10) {
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

        var promise = $interval(function() {
            if ($element.height() >= $element.find('.scrollPagesWrapper').height()) {
                appendPage = appendPage + 1;
                $scope.loadPage(appendPage);
            } else {
                $interval.cancel(promise);
            }
        }, 100);
    }

    return {
        restrict: 'A',
        templateUrl: 'directive.html',
        link: link,
        controller: controller,
        scope: {
            page: '=',
            scrollCallback: '&',
            scrollTemplate: '='
        }
    }
});