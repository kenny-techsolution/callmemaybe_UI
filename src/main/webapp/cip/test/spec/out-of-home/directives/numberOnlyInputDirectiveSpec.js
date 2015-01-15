'use strict';
describe('number-only-input directive', function () {
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
    el = angular.element('<form name="form"><input number-only-input  ng-model="model.inputValue" name="testNumberInput" input-lessthan="100" input-decimals="2" type="text"></form>');
    $compile(el)(scope);
    scope.$digest();
    form = scope.form;
  }));

  it('should restrict input to numeric value only', function () {
    form.testNumberInput.$setViewValue('12');
    scope.$apply();
    expect(scope.model.inputValue).toEqual('12');

    form.testNumberInput.$setViewValue('12a');
    scope.$apply();
    expect(scope.model.inputValue).toEqual('12');

    form.testNumberInput.$setViewValue('');
    scope.$apply();
    expect(scope.model.inputValue).toEqual('');

    form.testNumberInput.$setViewValue('b');
    scope.$apply();
    expect(scope.model.inputValue).toEqual('');
  });

  it('should limit the number of digits based on input-lessthan attribute', function () {
    form.testNumberInput.$setViewValue('99');
    scope.$apply();
    expect(scope.model.inputValue).toEqual('99');

    form.testNumberInput.$setViewValue('100');
    scope.$apply();
    expect(scope.model.inputValue).toEqual('99');
  });

  it('should limit the number of decimal digits based on input-decimals attribute', function () {
    form.testNumberInput.$setViewValue('12.45');
    scope.$apply();
    expect(scope.model.inputValue).toEqual('12.45');

    form.testNumberInput.$setViewValue('12.456');
    scope.$apply();
    expect(scope.model.inputValue).toEqual('12.45');
  });
});
