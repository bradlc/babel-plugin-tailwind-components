const nodePath = require('path')
import visit from './visit'

export default function({
  types: t,
  transformTaggedTemplateExpression = true,
  transformJSXAttribute = false
}) {
  let cloneNode = t.cloneNode || t.cloneDeep

  function TaggedTemplateExpression(path, state) {
    if (path.node.tag.name !== 'tw') return

    let sourceRoot = state.file.opts.sourceRoot || '.'
    let configPath = nodePath.resolve(
      sourceRoot,
      state.opts.config || './tailwind.js'
    )

    visit({ path, configPath, t, outputFormat: state.opts.format })
  }

  function JSXAttribute(path, state) {
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
        visit({ path, configPath, t, outputFormat: state.opts.format })
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

  return { visitor }
}
