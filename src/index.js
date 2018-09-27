const nodePath = require('path')
import visit from './visit'

export default function({ types: t }) {
  let cloneNode = t.cloneNode || t.cloneDeep

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
      },
      JSXAttribute(path, state) {
        if (path.node.name.name !== 'tw') return

        const sourceRoot = state.file.opts.sourceRoot || '.'
        const configPath = nodePath.resolve(
          sourceRoot,
          state.opts.config || './tailwind.js'
        )

        if (path.node.value.type === 'StringLiteral') {
          path
            .get('value')
            .replaceWith(t.jSXExpressionContainer(cloneNode(path.node.value)))
        }

        path.traverse({
          StringLiteral(path) {
            visit({ path, configPath, t, outputFormat: state.opts.format })
            path.skip()
          }
        })
      }
    }
  }
}
