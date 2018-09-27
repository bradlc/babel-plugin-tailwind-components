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
          ArrayExpression(path) {
            let program = path.findParent(p => p.isProgram())
            let id = program.scope.generateUidIdentifier('cx')
            program.unshiftContainer(
              'body',
              t.importDeclaration(
                [t.importSpecifier(id, t.identifier('cx'))],
                t.stringLiteral('emotion')
              )
            )

            path.replaceWith(
              t.callExpression(
                cloneNode(id),
                path.get('elements').map(e => cloneNode(e.node))
              )
            )
            path.skip()
          }
        })

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
