'use strict';

describe('Controller: FileSharingCtrl', function () {

  // load the controller's module
  beforeEach(module('cgeUploaderApp'));

  var FileSharingCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FileSharingCtrl = $controller('FileSharingCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(FileSharingCtrl.awesomeThings.length).toBe(3);
  });
});
