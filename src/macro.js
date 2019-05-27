import { createMacro } from 'babel-plugin-macros'
import { resolve, relative, dirname } from 'path'
import { existsSync } from 'fs'
import findIdentifier from './findIdentifier.js'
import parseTte from './parseTte.js'
import resolveConfig from 'tailwindcss/lib/util/resolveConfig.js'
import defaultTailwindConfig from 'tailwindcss/stubs/defaultConfig.stub.js'
import addImport from './addImport.js'
import getStyles from './getStyles.js'
import replaceWithLocation from './replaceWithLocation.js'

export default createMacro(
  ({ babel: { types: t }, references, state, config }) => {
    let sourceRoot = state.file.opts.sourceRoot || '.'
    let program = state.file.path
    let configFile = config && config.config
    let configPath = resolve(sourceRoot, configFile || './tailwind.config.js')
    let configExists = existsSync(configPath)

    if (configFile && !configExists) {
      throw new Error(`Couldn’t find Tailwind config ${configPath}`)
    }

    state.tailwindConfigIdentifier = program.scope.generateUidIdentifier(
      'tailwindConfig'
    )
    state.tailwindUtilsIdentifier = program.scope.generateUidIdentifier(
      'tailwindUtils'
    )
    state.isProd = process.env.NODE_ENV === 'production'
    state.isDev = !state.isProd

    if (state.isProd) {
      state.config = configExists
        ? resolveConfig([require(configPath), defaultTailwindConfig])
        : resolveConfig([defaultTailwindConfig])
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
      program,
      mod: styledImport.from,
      name: styledImport.import
    })
    if (state.styledIdentifier === null) {
      state.styledIdentifier = program.scope.generateUidIdentifier('styled')
    } else {
      state.existingStyledIdentifier = true
    }

    program.traverse({
      JSXAttribute(path) {
        if (path.node.name.name !== 'tw') return
        let styles = getStyles(path.node.value.value, t, state)
        let attrs = path
          .findParent(p => p.isJSXOpeningElement())
          .get('attributes')
        let cssAttr = attrs.filter(p => p.node.name.name === 'css')

        if (cssAttr.length) {
          path.remove()
          let expr = cssAttr[0].get('value').get('expression')
          if (expr.isArrayExpression()) {
            expr.pushContainer('elements', styles)
          } else {
            expr.replaceWith(t.arrayExpression([expr.node, styles]))
          }
        } else {
          path.replaceWith(
            t.jsxAttribute(
              t.jsxIdentifier('css'),
              t.jsxExpressionContainer(styles)
            )
          )
        }
      }
    })

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

      replaceWithLocation(parsed.path, getStyles(parsed.str, t, state))
    })

    if (state.shouldImportStyled && !state.existingStyledIdentifier) {
      addImport({
        types: t,
        program,
        mod: styledImport.from,
        name: styledImport.import,
        identifier: state.styledIdentifier
      })
    }

    if (state.shouldImportConfig) {
      let configImportPath =
        './' + relative(dirname(state.file.opts.filename), configPath)
      let originalConfigIdentifier = program.scope.generateUidIdentifier(
        'tailwindConfig'
      )

      program.unshiftContainer(
        'body',
        t.variableDeclaration('const', [
          t.variableDeclarator(
            state.tailwindConfigIdentifier,
            t.callExpression(
              t.memberExpression(
                state.tailwindUtilsIdentifier,
                t.identifier('resolveConfig')
              ),
              [configExists ? originalConfigIdentifier : t.objectExpression([])]
            )
          )
        ])
      )
      if (configExists) {
        program.unshiftContainer(
          'body',
          t.importDeclaration(
            [t.importDefaultSpecifier(originalConfigIdentifier)],
            t.stringLiteral(configImportPath)
          )
        )
      }
      program.unshiftContainer(
        'body',
        t.importDeclaration(
          [t.importDefaultSpecifier(state.tailwindUtilsIdentifier)],
          t.stringLiteral('tailwind.macro/utils.umd.js')
        )
      )
    }

    program.scope.crawl()
  },
  { configName: 'tailwind' }
)
