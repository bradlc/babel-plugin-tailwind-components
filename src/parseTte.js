export default function parseTte({ path, types: t, styledIdentifier, state }) {
  let cloneNode = t.cloneNode || t.cloneDeep

  if (
    path.node.tag.type !== 'Identifier' &&
    path.node.tag.type !== 'MemberExpression' &&
    path.node.tag.type !== 'CallExpression'
  )
    return null

  let str = path.get('quasi').get('quasis')[0].node.value.cooked

  if (path.node.tag.type === 'CallExpression') {
    path
      .get('tag')
      .get('callee')
      .replaceWith(cloneNode(styledIdentifier))
    state.shouldImportStyled = true
  } else if (path.node.tag.type === 'MemberExpression') {
    path
      .get('tag')
      .replaceWith(
        t.callExpression(cloneNode(styledIdentifier), [
          t.stringLiteral(path.node.tag.property.name)
        ])
      )
    state.shouldImportStyled = true
  }

  if (
    path.node.tag.type === 'CallExpression' ||
    path.node.tag.type === 'MemberExpression'
  ) {
    path.replaceWith(
      t.callExpression(cloneNode(path.node.tag), [
        t.identifier('placeholder'),
        t.arrowFunctionExpression(
          [t.identifier('p')],
          t.memberExpression(t.identifier('p'), t.identifier('tw'))
        )
      ])
    )

    path = path.get('arguments')[0]
  }

  return { str, path }
}
