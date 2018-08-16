const nodePath = require('path')
import visit from './visit'

export default function({ types: t }) {
  return {
    visitor: {
      TaggedTemplateExpression(path, state) {
        if (path.node.tag.name !== 'tw') return

        const sourceRoot = state.file.opts.sourceRoot || '.'
        const configPath = nodePath.resolve(
          sourceRoot,
          state.opts.config || './tailwind.js'
        )

        visit({ path, configPath, t, outputFormat: state.opts.format })
      }
    }
  }
}
