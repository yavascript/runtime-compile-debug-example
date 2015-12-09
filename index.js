var vm = require('vm')
var path = require('path')
var fs = require('fs')
var babel = require('babel-core')

var prefix = '(function (__dirname, __filename, require, module, exports) {'
var filename = path.resolve(__dirname, 'foo.es6')
var filedata = fs.readFileSync(filename)

var babelified = babel.transform(filedata, {
  sourceMaps: true,
  sourceFileName: filename,
  sourceRoot: __dirname
})

var withSourcemap = babelified.code +
  '\n//# sourceMappingURL=data:application/json;base64,' +
  new Buffer(JSON.stringify(babelified.map)).toString('base64')

var module = {exports: {}, require: require}

vm.runInThisContext(
  prefix + withSourcemap + '\n})',
  {filename: filename + '.foo'}
)(__dirname, filename, require, module, module.exports)

module.exports()
module.exports()
