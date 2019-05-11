let pluginTester = require('babel-plugin-tester')
let plugin = require('babel-plugin-macros')
let path = require('path')
let glob = require('glob-all')
let fs = require('fs')
let prettier = require('prettier')

pluginTester({
  plugin,
  pluginName: 'tailwind.macro',
  babelOptions: {
    filename: __filename,
    babelrc: true
  },
  snapshot: false,
  formatResult(code) {
    return prettier
      .format(code, {
        parser: 'babel',
        semi: false,
        singleQuote: true
      })
      .trim()
  },
  tests: glob.sync('__fixtures__/*').map(dir => {
    return {
      title: path.basename(dir),
      code: fs.readFileSync(path.join(dir, 'code.js'), 'utf-8'),
      output: fs.readFileSync(path.join(dir, 'output.js'), 'utf-8')
    }
  })
})
