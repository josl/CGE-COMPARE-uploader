'use strict';

describe('Service: getFiles', function () {

  // load the service's module
  beforeEach(module('cgeUploaderApp'));

  // instantiate service
  var getFiles;
  beforeEach(inject(function (_getFiles_) {
    getFiles = _getFiles_;
  }));

  it('should do something', function () {
    expect(!!getFiles).toBe(true);
  });

});
