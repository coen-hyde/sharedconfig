var assert = require('assert'),
    sharedconfig = require('..'),
    testdb = require('./helpers/testdb'),
    config;

describe('follow changes tests', function() {
    before(testdb.prepare);

    it('should be able to connect to the config endpoint', function() {
        config = sharedconfig('http://damonoehlman.iriscouch.com/sharedconfig-test');
    });
    
    it('should be able to use the development environment', function(done) {
        config.use('dev', done);
    });

    it('should be able to detect a change in the dev config', function(done) {
        config.once('a.change', function(newValue) {
            assert.equal(newValue, 10);
            done();
        });
        
        testdb.update('dev', { a: 10 });
    });
    
    it('should be able to detect a change in the default config', function(done) {
        config.once('b.change', function(newValue) {
            assert.equal(newValue, 5);
            done();
        });
        
        testdb.update('default', { b: 5 });
    });
    
    it('should ignore changes to the default config when overriden by the environment specified config', function(done) {
        var changed = false;
        
        config.once('a.change', function(newValue) {
            changed = true;
        });
        
        testdb.update('default', { a: 5 }, function(err) {
            setTimeout(function() {
                assert(! changed);
                assert.equal(config.a, 10);
                done();
            }, 500);
        });
    });
});