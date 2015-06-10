(function() {
    'use strict';

    describe("A suite is just a function", function() {
        var $compile, $rootScope, $timeout;

        beforeEach(module('holyscroll'));

        var scope, element;

        beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_) {
            // The injector unwraps the underscores (_) from around the parameter names when matching
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $timeout = _$timeout_;


            element = "<div holy-scroll scroll-template=\"page.html\" scroll-callback=\"loadItems(page, cb)\" scroll-page=\"currentPage\"></div>";
            scope = $rootScope.$new();

            /** Define the "scroll-callback" for loading a holyscroll's page of items */
            scope.loadItems = function(page, cb) {
                var perPage = 10;
                var items = [];
                for (var i = page * perPage - perPage + 1; i <= page * perPage; i++) {
                    items.push('Phone ' + i);
                }
                cb(items);
            };

            element = $compile(element)(scope);
        }));

        it('Assigns pages to an array with index corresponding to page number', function() {
            /** Upon loading page 1, it should have "undefined" for page 0 **/
            expect(element.isolateScope().array[0]).toBe(undefined);

            /** Since page 1 is created with index 1; total length of array should be 2 */
            expect(element.isolateScope().array.length).toBe(2);

            $timeout.flush();

            /** It should render a DOM element for each index in the pages array */
            expect(element.find('>div.scrollPagesWrapper>div').length).toBe(2);
        });
    });
})();
