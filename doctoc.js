'use strict';

var path = require('path'),
  fs = require('fs'),
  minimist = require('minimist'),
  file = require('./lib/file'),
  transform = require('./lib/transform'),
  files;

function transformAndSave(files, mode, maxHeaderLevel, title, notitle, entryPrefix, stdOut) {
  console.log('\n==================\n');

  var transformed = files
    .map(function (x) {
      var content = fs.readFileSync(x.path, 'utf8'),
        result = transform(content, mode, maxHeaderLevel, title, notitle, entryPrefix);
      result.path = x.path;
      return result;
    });
  var changed = transformed.filter(function (x) {
      return x.transformed;
    }),
    unchanged = transformed.filter(function (x) {
      return !x.transformed;
    }),
    toc = transformed.filter(function (x) {
      return x.toc;
    })

  if (stdOut) {
    toc.forEach(function (x) {
      console.log(x.toc)
    })
  }

  unchanged.forEach(function (x) {
    console.log('"%s" is up to date', x.path);
  });

  changed.forEach(function (x) {
    if (stdOut) {
      console.log('==================\n\n"%s" should be updated', x.path)
    } else {
      console.log('"%s" will be updated', x.path);
      //      fs.writeFileSync(x.path, x.data, 'utf8');
      console.log(x.data);
    }
  });
}

function dummyFunc() {
  console.log("dummy!");
}

module.exports.transform = transform;