const nodePath = require('path')
import visit from './visit'

export default function({
  types: t,
  transformTaggedTemplateExpression = true,
  transformJSXAttribute = false
}) {
  let cloneNode = t.cloneNode || t.cloneDeep

  return {
    visitor: {
      Program(path, state) {
        let cssIdentifier

        if (transformJSXAttribute) {
          path.traverse({
            ImportDeclaration(path) {
              if (path.node.source.value !== 'emotion') return
              path.node.specifiers.some(specifier => {
                if (specifier.imported.name === 'css') {
                  cssIdentifier = specifier.local
                  return true
                }
                return false
              })
            }
          })

          if (!cssIdentifier) {
            cssIdentifier = path.scope.generateUidIdentifier('css')
            path.unshiftContainer(
              'body',
              t.importDeclaration(
                [t.importSpecifier(cssIdentifier, t.identifier('css'))],
                t.stringLiteral('emotion')
              )
            )
          }
        }

        function TaggedTemplateExpression(path) {
          if (path.node.tag.name !== 'tw') return

          let sourceRoot = state.file.opts.sourceRoot || '.'
          let configPath = nodePath.resolve(
            sourceRoot,
            state.opts.config || './tailwind.js'
          )

          visit({ path, configPath, t, outputFormat: state.opts.format })
        }

        function JSXAttribute(path) {
          if (path.node.name.name !== 'tw') return

          let sourceRoot = state.file.opts.sourceRoot || '.'
          let configPath = nodePath.resolve(
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
              visit({
                path,
                configPath,
                t,
                outputFormat: state.opts.format,
                cssIdentifier
              })
              path.skip()
            }
          })
        }

        let visitor = {}

        if (transformTaggedTemplateExpression) {
          visitor.TaggedTemplateExpression = TaggedTemplateExpression
        }

        if (transformJSXAttribute) {
          visitor.JSXAttribute = JSXAttribute
        }

        path.traverse(visitor)
      }
    }
  }
}
