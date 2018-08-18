const createMacro = require('babel-plugin-macros').createMacro
const nodePath = require('path')
import visit from './visit'

export default createMacro(
  ({ babel: { types: t }, references, state, config }) => {
    const sourceRoot = state.file.opts.sourceRoot || '.'
    const configFile = config && config.config
    const configPath = nodePath.resolve(
      sourceRoot,
      configFile || './tailwind.js'
    )

    references.default.forEach(path => {
      visit({
        path: path.parentPath,
        t,
        configPath,
        outputFormat: config && config.format
      })
    })
  }
)
