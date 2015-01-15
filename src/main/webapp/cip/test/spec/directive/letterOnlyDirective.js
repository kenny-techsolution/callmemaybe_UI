'use strict';
describe('letter-only-input directive', function () {
  var el;
  var scope;
  var form;

  // load the controller's module
  beforeEach(module('ngMockE2E'));
  ignoreSvgGets();

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($compile, $rootScope) {

    scope = $rootScope;
    scope.model = {
      inputValue :''
    };
    el = angular.element('<form name="form"><input letter-only-input  ng-model="model.inputValue" name="testLetterInput" type="text"></form>');
    $compile(el)(scope);
    scope.$digest();
    form = scope.form;
  }));

  it('should restrict input to letter or space value only', function () {
    form.testLetterInput.$setViewValue('1');
    scope.$apply();
    expect(scope.model.inputValue).toEqual('');

    form.testLetterInput.$setViewValue('aBc');
    scope.$apply();
    expect(scope.model.inputValue).toEqual('aBc');

    form.testLetterInput.$setViewValue('aBc1');
    scope.$apply();
    expect(scope.model.inputValue).toEqual('aBc');

    form.testLetterInput.$setViewValue('aB.c-d E');
    scope.$apply();
    expect(scope.model.inputValue).toEqual('aBc-d E');

    form.testLetterInput.$setViewValue('aBc D2');
    scope.$apply();
    expect(scope.model.inputValue).toEqual('aBc D');
  });
});
