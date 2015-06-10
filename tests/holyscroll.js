describe("A suite is just a function", function() {
    var $compile,
        $rootScope;

    beforeEach(module('holyscroll'));

    beforeEach(inject(function(_$compile_, _$rootScope_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));


    it('Replaces the element with the appropriate content', function() {
        // Compile a piece of HTML containing the directive
        var element = $compile("<div holy-scroll></div>")($rootScope);
        $rootScope.$digest();
        expect(element.html()).toBe("<div class=\"scrollPagesWrapper\"><!-- ngRepeat: page in array track by $index --></div>");
    });
});