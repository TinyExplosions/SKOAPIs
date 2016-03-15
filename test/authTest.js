var should = require('chai').should(),
    expect = require('chai').expect,
    nock = require('nock'),
    supertest = require('supertest'),
    fs = require('fs'),
    api = supertest('http://localhost:8052'),
    https = require('https'),
    mockserver = require('mockserver');

describe('Authentication and Authorization', function() {

    it('should return a 400 response with no params', function(done) {
        api.post('/login')
            .expect(400, done);
    });

    it('should return a JWT as email is valid', function(done) {
        api.post('/login')
            .set('Accept', 'application/x-www-form-urlencoded')
            .send({
                email: "test@user.com"
            })
            .expect(200, done);
    });

    it('should return a 400 as email is invalid', function(done) {
        api.post('/login')
            .set('Accept', 'application/x-www-form-urlencoded')
            .send({
                email: "testuser.com"
            })
            .expect(400, done);
    });

    // teardown
    after(function() {
        // server.close();
        nock.cleanAll();
    });

});
