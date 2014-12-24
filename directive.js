phonecatApp.directive('myScroll', function() {

    function link(scope, element, attrs) {

    }

    function controller($scope, $element, $http, $timeout, $interval, $location) {

        var scrollAreaHeight = $element.height();

        $scope.array = [];
        $scope.loadPage = function(pageToLoad) {
            $scope.scrollCallback({
                page: pageToLoad,
                cb: function (r) {
                    if (0 != r.length) {
                        $scope.array.push(r);
                    }
                }
            });
        }

        var page = 1;
        $scope.loadPage(page);

        var last_scroll = null;
        var onScroll = function() {
            position = $element.scrollTop();
            height = $element.find('.scrollPagesWrapper').height() - scrollAreaHeight;

            // throttle the calculations to every 10px
            if (null == last_scroll || Math.abs(position - last_scroll) >= 10) {
                // If the user scrolls close to the bottom, append the next page div
                if (position >= 0.9 * height) {
                    page = page + 1;
                    $scope.loadPage(page);
                    return false;
                }
                last_scroll = position;
            }
        }

        $element.bind('scroll', function() { $timeout(onScroll) });

        var promise = $interval(function() {
            if ($element.height() >= $element.find('.scrollPagesWrapper').height()) {
                console.error('content too short, triggering next page!');
                page = page + 1;
                $scope.loadPage(page);
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