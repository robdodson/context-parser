var generate = require('../index.js');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');

var FIXTURES = path.join(__dirname, 'fixtures');
var OUTPUT = path.join(__dirname, 'tmp');

function clean() {
  rimraf.sync(OUTPUT);
}

function reset() {
  clean();
  mkdirp.sync(OUTPUT);
  generate(FIXTURES, OUTPUT, { merge: true });
}

describe('merge mixins', function() {

  before(function() {
    reset();
  });

  var pathToXMerger = path.join(OUTPUT, 'x-merger.json');

  describe('output', function() {
    
    it('should generate a JSON file for x-merger', function() {
      var exists = fs.existsSync(pathToXMerger);
      assert.ok(exists);
    });

  });

  describe('x-merger content', function() {
    var content;

    before(function() {
      content = JSON.parse(fs.readFileSync(pathToXMerger, 'utf-8'))
    });

    it('should contain a mixins section', function() {
      assert.ok(content.mixins);
      assert.ok(content.mixins.length);
    });

    it('should mixin Polymer.IsAnotherMixin', function() {
      assert.ok(content.mixins[0].name == 'Polymer.IsAnotherMixin');
    });

    describe('parentMethods', function() {
      
      it('should contain a parentMethods section', function() {
        assert.ok(content.parentMethods);
        assert.ok(content.parentMethods.length);
      });

      it('should contain methods from mixin elements', function() {
        var mixinMethods;
        content.parentMethods.forEach(function(methods) {
          if (methods.name == 'IsAnotherMixin') {
            mixinMethods = methods;
          }
        });

        assert.ok(mixinMethods);
        assert.ok(mixinMethods.methods.length);
        assert.ok(mixinMethods.methods[0].name == 'doFoo');
      });

    });

  });
  
});