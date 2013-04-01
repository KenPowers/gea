/*global describe it require __appDir*/
var path = require('path'),
    expect = require('chai').expect,
    sinon = require('sinon');

__appDir = path.join(__dirname, '../');

describe('GEA Server Tests', function () {
  // Dependencies for testing
  var response = require('express/lib/response');
  // var client = require('pg/lib/client');
  var rate = require(path.join(__appDir, 'routes/rate'));
  // First test
  describe('/rate tests', function () {
    it('should POST', function () {
      debugger;
      // Create mock request
      var mReq = mockRequest();
      var mRes = sinon.mock(response);
      mRes.expects('json').withExactArgs([{id: 1}]);

      // Call method
      rate.post(mReq, mRes);

      // Verify
      mReq.verify();
      mRes.verify();
    });
  });

  // Creates mock request
  function mockRequest() {
    // var dbDone = function () {};
    var dbDone = sinon.mock();
    dbDone.once();
    var mock = sinon.mock({
      dbConnect: function (cb) {
        cb(null, mockClient(), dbDone);
      }
      // dbConnect: sinon.stub().callsArgWith(0, null, mockClient(), dbDone),
      // query: {}
    });
    mock.query = {};
    mock.expects('dbConnect').once();
    return mock;
  }

  // Creates mock pg client
  function mockClient() {
    var mock = sinon.mock({
      query: function (args, cb) {
        expect(args).to.exist;
        expect(args.values).to.be.an(Array);
        if (args.name === 'get_song') {
          expect(args.values.length).to.equal(1);
          cb(null, {
            rows: []
          });
        } else if (args.name === 'insert_song') {
          expect(args.values.length).to.equal(4);
          cb(null, {
            rows: [{id: 1}]
          });
        } else {
          expect(args.values.length).to.equal(2);
          cb(null, {
            rows: [{id: 1}]
          });
        }
      }
    });
    mock.expects('query').exactly(3);
  }
});
