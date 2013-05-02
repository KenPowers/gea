var sinon = require('sinon'),
    expect = require('chai').expect,
    path = require('path'),
    acquire = require('acquire');

__appDir = path.join(__dirname, '..');

describe('rate tests', function () {
  var realPg = require('pg'),
      mockPg = sinon.mock(realPg);

  // afterEach(function () {
  //   // mockPg.restore();
  // });

  it('should insert a song and rating into the database when a song does not already exist', function () {
    // Setup
    var mockRdio = {
      doUnauthenticatedRequest: sinon.stub()
    };
    mockRdio.doUnauthenticatedRequest.callsArgWith(1, null, {
      status: 'ok',
      result: {
        id: {
          artist: 'test artist',
          album: 'test album',
          title: 'test title',
          icon: 'test icon'
        }
      }
    });
    acquire.set(path.join(__dirname, '../routes/util/rdio'), mockRdio);
    var stubRequest = sinon.stub();
    acquire.set('request', stubRequest);
    stubRequest.callsArgWith(1, null, null, '{region_name: "test region"}');
    var r = require(path.join(__dirname, '../routes/rate')).post;
    var req = {query: {id: 'id', verdict: 'like'}, ip: '111.111.111.111'};
    var res = {json: sinon.spy()};
    var done = sinon.spy();
    var client = {
      query: sinon.stub()
    };


    // Mock Expectations
    mockPg.expects('connect').once().callsArgWith(0, null, client, done);
    client.query.callsArgWith(1, null, {rows: []});
    client.query.callsArgWith(1, null, {rows: [{id: 'id'}]});
    client.query.callsArgWith(1, null, 1);

    // Run test
    r(req, res);

    // Test expectations
    mockPg.verify();
    expect(client.query.calledThrice).to.be.true;
    expect(done.calledOnce).to.be.true;
  });
});
