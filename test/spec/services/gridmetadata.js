'use strict';

describe('Service: GridMetadata', function () {

  // load the service's module
  beforeEach(module('cgeUploaderApp'));

  // instantiate service
  var GridMetadata;
  beforeEach(inject(function (_GridMetadata_) {
    GridMetadata = _GridMetadata_;
  }));

  it('should do something', function () {
    expect(!!GridMetadata).toBe(true);
  });

});
