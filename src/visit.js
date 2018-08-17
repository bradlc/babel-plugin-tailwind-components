const babylon = require('@babel/parser')
const generate = require('@babel/generator').default
import staticStyles from './static-styles'
import dynamicStyles from './dynamic-styles'

export default function visit({ path, t, configPath, outputFormat }) {
  const isProd = process.env.NODE_ENV === 'production'
  const isDev = !isProd

  let outFormat = path.node.type === 'JSXAttribute' ? 'object' : outputFormat

  if (!outFormat || outFormat === 'auto') {
    // if we’re inside a <style> tag we output in string format
    // e.g. styled-jsx
    const parentTag = path.findParent(p => p.isJSXElement())
    if (parentTag && parentTag.node.openingElement.name.name === 'style') {
      outFormat = 'string'
    } else {
      outFormat = 'object'
    }
  }

  const str =
    path.node.type === 'JSXAttribute'
      ? path.node.value.value
      : path.node.quasi.quasis[0].value.cooked
  const classNames = str.match(/[a-z0-9-_:]+/gi) || []

  let config
  let configIdentifier
  const program = path.find(p => p.isProgram())

  if (process.env.NODE_ENV === 'production') {
    config = require(configPath)
  } else {
    configIdentifier = program.scope.generateUidIdentifier('tailwind')
    program.unshiftContainer(
      'body',
      t.importDeclaration(
        [t.importDefaultSpecifier(configIdentifier)],
        t.stringLiteral(configPath)
      )
    )
  }

  let cssIdentifier
  if (path.node.type === 'JSXAttribute') {
    cssIdentifier = program.scope.generateUidIdentifier('css')
    program.unshiftContainer(
      'body',
      t.importDeclaration(
        [t.importSpecifier(cssIdentifier, t.identifier('css'))],
        t.stringLiteral('emotion')
      )
    )
  }

  const styles = classNames.reduce((acc, className, index) => {
    let mods = []
    let modifier

    while (modifier !== null) {
      modifier = className.match(/^([a-z-_]+):/i)
      if (modifier) {
        className = className.substr(modifier[0].length)
        mods.push(modifier[1])
      }
    }

    mods = mods.map(mod => {
      if (mod === 'hover' || mod === 'focus' || mod === 'active') {
        return ':' + mod
      }
      return isProd
        ? '@media (min-width: ' + config.screens[mod] + ')'
        : '`@media (min-width: ${' +
            configIdentifier.name +
            '.screens["' +
            mod +
            '"]})`'
    })

    if (staticStyles[className]) {
      if (mods.length) {
        dset(acc, mods, merge(dlv(acc, mods, {}), staticStyles[className]))
        return acc
      } else {
        return merge(acc, staticStyles[className])
      }
    }

    let key
    Object.keys(dynamicStyles).some(k => {
      if (className.startsWith(k + '-') || className === k) {
        key = k
        return true
      }
    })
    if (key) {
      let value = className.substr(key.length + 1)
      if (value === '') value = 'default'
      let props

      if (Array.isArray(dynamicStyles[key])) {
        let propVal = dynamicStyles[key].map(x => {
          const { pre, post } = getEnds(x, isDev)

          if (isProd && config[x.config][value] === undefined) return

          const format = x.format ? x.format : x => x

          return isProd
            ? {
                [x.prop]:
                  pre || post
                    ? pre + format(config[x.config][value]) + post
                    : format(config[x.config][value])
              }
            : outFormat === 'string'
              ? `['${camelToKebab(x.prop)}', ${pre}${configIdentifier.name}.${
                  x.config
                }["${value}"]${post}]`
              : `{${x.prop}:${pre}${configIdentifier.name}.${
                  x.config
                }["${value}"]${post}}`
        })
        if (isProd) {
          props = propVal.filter(x => typeof x !== 'undefined')[0]
        } else {
          if (outFormat === 'string') {
            propVal = `[${propVal.join(
              ','
            )}].filter(x => typeof x[1] !== 'undefined' && x[1] !== '')[0].join(':')`
            props = { ['__spread__' + index]: propVal }
          } else {
            propVal =
              '[' +
              propVal.join(',') +
              '].filter(x => typeof x[Object.keys(x)[0]] !== "undefined" && x[Object.keys(x)[0]] !== "")[0]'
            props = { ['__spread__' + index]: propVal }
          }
        }
      } else {
        props = Array.isArray(dynamicStyles[key].prop)
          ? dynamicStyles[key].prop
          : [dynamicStyles[key].prop]
        const { pre, post } = getEnds(dynamicStyles[key], isDev)
        const format = dynamicStyles[key].format
          ? dynamicStyles[key].format
          : x => x
        props = props.reduce((acc, prop) => {
          return {
            ...acc,
            [prop]: isProd
              ? pre + format(config[dynamicStyles[key].config][value]) + post
              : '$' +
                pre +
                configIdentifier.name +
                '.' +
                dynamicStyles[key].config +
                '["' +
                value +
                '"]' +
                post
          }
        }, {})
      }

      if (mods.length) {
        dset(acc, mods, merge(dlv(acc, mods, {}), props))
        return acc
      } else {
        return merge(acc, props)
      }
    }

    return acc
  }, {})

  const styleObj = astify(styles, t)

  if (outFormat === 'string') {
    const css = objToString(styles, isDev)
    const parent = path.parentPath

    if (parent.isTemplateLiteral()) {
      const exprIndex = parent.get('expressions').indexOf(path)
      const before = parent.get('quasis')[exprIndex]
      const after = parent.get('quasis')[exprIndex + 1]

      after.node.value.raw = before.node.value.raw + css + after.node.value.raw
      after.node.value.cooked =
        before.node.value.cooked + css + after.node.value.cooked

      before.remove()
      path.remove()

      const ast = babylon.parseExpression(generate(parent.node).code)
      parent.replaceWith(ast)
    } else {
      const tte = '`' + css + '`'
      path.replaceWith(babylon.parseExpression(tte))
    }
  } else {
    if (path.node.type === 'JSXAttribute') {
      let el = path.findParent(p => t.isJSXOpeningElement(p))
      let classNamePath = el
        .get('attributes')
        .filter(
          attr =>
            !t.isJSXSpreadAttribute(attr.node) &&
            attr.get('name').node.name === 'className'
        )[0]

      let classNameValue =
        classNamePath && classNamePath.node && classNamePath.node.value
      let cssCall = t.callExpression(cssIdentifier, [styleObj])

      if (
        !classNameValue ||
        (t.isStringLiteral(classNameValue) && !classNameValue.value)
      ) {
        if (classNamePath) classNamePath.remove()
        path.replaceWith(createClassNameAttr(cssCall, t))
        return
      }
      path.remove()

      if (classNamePath && classNamePath.parentPath) {
        if (t.isJSXExpressionContainer(classNameValue)) {
          classNamePath.replaceWith(
            createClassNameAttr(
              add(
                cssCall,
                add(t.stringLiteral(' '), classNameValue.expression, t),
                t
              ),
              t
            )
          )
        } else {
          classNamePath.replaceWith(
            createClassNameAttr(
              add(
                cssCall,
                t.stringLiteral(` ${classNameValue.value || ''}`),
                t
              ),
              t
            )
          )
        }
      }
    } else {
      path.replaceWith(styleObj)
    }
  }
}

function add(a, b, t) {
  return t.binaryExpression('+', a, b)
}

function createClassNameAttr(expression, t) {
  return t.jSXAttribute(
    t.jSXIdentifier('className'),
    t.jSXExpressionContainer(expression)
  )
}

/**
 * the empty comment is to
 * work around a bug somewhere along this chain:
 * styled-jsx -> styled-jsx-plugin-postcss -> postcss-nested
 *
 * code similar to this doesn’t work as expected:
 * .foo {
 *   ${'color: red'};
 *   &:hover {
 *     ${'color: blue'};
 *   }
 * }
 */
function objToString(obj, commentFix = false) {
  const comment = commentFix ? '/**/' : ''

  return Object.keys(obj).reduce((acc, k) => {
    let value = obj[k]

    if (k.startsWith('__spread__')) {
      return acc + '${' + value + '};' + comment
    }

    if (typeof value === 'string') {
      if (value[0] === '$') {
        value = '${' + value.substr(1) + '}'
      }
      return acc + camelToKebab(k) + ':' + value + ';' + comment
    } else {
      value = objToString(value)
      let key = k[0] === ':' ? '&' + k : k
      key = key[0] === '`' ? key.substr(1, key.length - 2) : key
      return acc + camelToKebab(key) + '{' + value + '};' + comment
    }
  }, '')
}

function camelToKebab(val) {
  return val
    .replace(/[A-Z]/g, '-$&')
    .toLowerCase()
    .replace(/^(ms|o|moz|webkit)-/, '-$1-')
}

function getEnds(x, isDev) {
  let pre = ''
  let post = ''
  if (isDev && x.preDev) {
    pre = x.preDev
  } else if (x.pre) {
    pre = x.pre
  }
  if (isDev && x.postDev) {
    post = x.postDev
  } else if (x.post) {
    post = x.post
  }

  return { pre, post }
}

function merge(a, b) {
  return Object.assign({}, a, b)
}

function astify(literal, t) {
  if (literal === null) {
    return t.nullLiteral()
  }
  switch (typeof literal) {
    case 'function':
      const ast = babylon.parse(literal.toString(), {
        allowReturnOutsideFunction: true,
        allowSuperOutsideMethod: true
      })
      return traverse.removeProperties(ast)
    case 'number':
      return t.numericLiteral(literal)
    case 'string':
      if (literal.startsWith('$')) {
        return babylon.parseExpression(literal.substr(1))
      }
      return t.stringLiteral(literal)
    case 'boolean':
      return t.booleanLiteral(literal)
    case 'undefined':
      return t.unaryExpression('void', t.numericLiteral(0), true)
    default:
      if (Array.isArray(literal)) {
        return t.arrayExpression(literal.map(x => astify(x, t)))
      }
      try {
        return t.objectExpression(
          objectExpressionElements(literal, t, 'spreadElement')
        )
      } catch (err) {
        return t.objectExpression(
          objectExpressionElements(literal, t, 'spreadProperty')
        )
      }
  }
}

function objectExpressionElements(literal, t, spreadType) {
  return Object.keys(literal)
    .filter(k => {
      return typeof literal[k] !== 'undefined'
    })
    .map(k => {
      if (k.startsWith('__spread__')) {
        return t[spreadType](babylon.parseExpression(literal[k]))
      } else {
        const computed = k.startsWith('`')
        const key = computed ? babylon.parseExpression(k) : t.stringLiteral(k)
        return t.objectProperty(key, astify(literal[k], t), computed)
      }
    })
}

function dset(obj, keys, val) {
  keys.split && (keys = keys.split('.'))
  var i = 0,
    l = keys.length,
    t = obj,
    x
  for (; i < l; ++i) {
    x = t[keys[i]]
    t = t[keys[i]] = i === l - 1 ? val : x == null ? {} : x
  }
}

function dlv(obj, key, def, p) {
  p = 0
  key = key.split ? key.split('.') : key
  while (obj && p < key.length) obj = obj[key[p++]]
  return obj === undefined || p < key.length ? def : obj
}
