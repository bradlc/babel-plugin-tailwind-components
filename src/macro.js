import { createMacro } from 'babel-plugin-macros'
import { resolve, relative, dirname } from 'path'
import findIdentifier from './findIdentifier.js'
import parseTte from './parseTte.js'
import transformString from './transformString.js'
import resolveConfig from 'tailwindcss/lib/util/resolveConfig.js'
import defaultTailwindConfig from 'tailwindcss/stubs/defaultConfig.stub.js'
import addImport from './addImport.js'

export default createMacro(
  ({ babel: { types: t }, references, state, config }) => {
    let sourceRoot = state.file.opts.sourceRoot || '.'
    let configFile = config && config.config
    let configPath = resolve(sourceRoot, configFile || './tailwind.config.js')

    state.tailwindConfigIdentifier = state.file.path.scope.generateUidIdentifier(
      'tailwindConfig'
    )
    state.tailwindUtilsIdentifier = state.file.path.scope.generateUidIdentifier(
      'tailwindUtils'
    )
    state.isProd = process.env.NODE_ENV === 'production'
    state.isDev = !state.isProd

    if (state.isProd) {
      state.config = resolveConfig([require(configPath), defaultTailwindConfig])
    }

    let styledImport =
      config && config.styled
        ? {
            import: config.styled.import || 'default',
            from: config.styled.from || config.styled
          }
        : { import: 'default', from: '@emotion/styled' }

    state.existingStyledIdentifier = false
    state.styledIdentifier = findIdentifier({
      program: state.file.path,
      mod: styledImport.from,
      name: styledImport.import
    })
    if (state.styledIdentifier === null) {
      state.styledIdentifier = state.file.path.scope.generateUidIdentifier(
        'styled'
      )
    } else {
      state.existingStyledIdentifier = true
    }

    references.default.forEach(path => {
      let parent = path.findParent(x => x.isTaggedTemplateExpression())
      if (!parent) return

      let parsed = parseTte({
        path: parent,
        types: t,
        styledIdentifier: state.styledIdentifier,
        state
      })
      if (!parsed) return

      transformString({
        path: parsed.path,
        str: parsed.str,
        types: t,
        state
      })

      return

      visit({
        path: parsed.path,
        str: parsed.str,
        t,
        configPath,
        outputFormat: config && config.format,
        state
      })
    })

    if (state.shouldImportStyled && !state.existingStyledIdentifier) {
      addImport({
        types: t,
        program: state.file.path,
        mod: styledImport.from,
        name: styledImport.import,
        identifier: state.styledIdentifier
      })
    }

    if (state.shouldImportConfig) {
      let configImportPath =
        './' + relative(dirname(state.file.opts.filename), configPath)
      let originalConfigIdentifier = state.file.path.scope.generateUidIdentifier(
        'tailwindConfig'
      )

      state.file.path.unshiftContainer(
        'body',
        t.variableDeclaration('const', [
          t.variableDeclarator(
            state.tailwindConfigIdentifier,
            t.callExpression(
              t.memberExpression(
                state.tailwindUtilsIdentifier,
                t.identifier('resolveConfig')
              ),
              [originalConfigIdentifier]
            )
          )
        ])
      )
      state.file.path.unshiftContainer(
        'body',
        t.importDeclaration(
          [t.importDefaultSpecifier(originalConfigIdentifier)],
          t.stringLiteral(configImportPath)
        )
      )
      state.file.path.unshiftContainer(
        'body',
        t.importDeclaration(
          [t.importDefaultSpecifier(state.tailwindUtilsIdentifier)],
          t.stringLiteral('tailwind.macro/utils.umd.js')
        )
      )
    }
  },
  { configName: 'tailwind' }
)
