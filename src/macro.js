const createMacro = require('babel-plugin-macros').createMacro
const nodePath = require('path')
import visit from './visit'
import parseTte from './parse-tte.js'
import findOrCreateImport from './find-or-create-import.js'

export default createMacro(
  ({ babel: { types: t }, references, state, config }) => {
    const sourceRoot = state.file.opts.sourceRoot || '.'
    const configFile = config && config.config
    const configPath = nodePath.resolve(
      sourceRoot,
      configFile || './tailwind.js'
    )

    references.default.forEach(path => {
      let parent = path.findParent(x => x.isTaggedTemplateExpression())
      if (!parent) return

      let styledIdentifier = findOrCreateImport(
        t,
        path.findParent(x => x.isProgram()),
        'emotion',
        'styled'
      )

      let parsed = parseTte(parent, t, styledIdentifier)
      if (!parsed) return

      visit({
        path: parsed.path,
        str: parsed.str,
        t,
        configPath,
        outputFormat: config && config.format
      })
    })
  },
  { configName: 'tailwind' }
)
