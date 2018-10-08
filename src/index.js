const nodePath = require('path')
import visit from './visit'
import parseTte from './parse-tte.js'
import findOrCreateImport from './find-or-create-import.js'

export default function({
  types: t,
  transformTaggedTemplateExpression = true,
  transformJSXAttribute = true
}) {
  let cloneNode = t.cloneNode || t.cloneDeep

  return {
    visitor: {
      Program(path, state) {
        let cssIdentifier

        if (transformJSXAttribute) {
          cssIdentifier = findOrCreateImport(t, path, 'emotion', 'css')
        }

        let styledIdentifier = findOrCreateImport(t, path, 'emotion', 'styled')

        function TaggedTemplateExpression(path) {
          let parsed = parseTte(path, t, styledIdentifier)
          if (!parsed) return

          let sourceRoot = state.file.opts.sourceRoot || '.'
          let configPath = nodePath.resolve(
            sourceRoot,
            state.opts.config || './tailwind.js'
          )

          visit({
            path: parsed.path,
            str: parsed.str,
            configPath,
            t,
            outputFormat: state.opts.format
          })
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
                str: path.node.value,
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
