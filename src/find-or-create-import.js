export default function findOrCreateImport(t, program, mod, name) {
  let identifier

  program.traverse({
    ImportDeclaration(path) {
      if (path.node.source.value !== mod) return
      path.node.specifiers.some(specifier => {
        if (specifier.imported.name === name) {
          identifier = specifier.local
          return true
        }
        return false
      })
    }
  })

  if (!identifier) {
    identifier = program.scope.generateUidIdentifier(name)
    program.unshiftContainer(
      'body',
      t.importDeclaration(
        [t.importSpecifier(identifier, t.identifier(name))],
        t.stringLiteral(mod)
      )
    )
  }

  return identifier
}
