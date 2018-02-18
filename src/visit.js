const babylon = require('babylon')
const nodePath = require('path')
import deepmerge from 'deepmerge'
import staticStyles from './static-styles'
import dynamicStyles from './dynamic-styles'

export default function visit({ path, t, configPath, outputFormat }) {
  const isProd = process.env.NODE_ENV === 'production'
  const isDev = !isProd

  const outFormat = outputFormat
    ? outputFormat
    : path.findParent(p => p.isTaggedTemplateExpression()) ? 'string' : 'object'
  const str = path.node.quasi.quasis[0].value.cooked
  const classNames = str.match(/[a-z0-9-_:]+/gi) || []

  let config
  let configIdentifier

  if (process.env.NODE_ENV === 'production') {
    config = require(configPath)
  } else {
    const program = path.find(p => p.isProgram())
    configIdentifier = program.scope.generateUidIdentifier('tailwind')
    program.unshiftContainer(
      'body',
      t.importDeclaration(
        [t.importDefaultSpecifier(configIdentifier)],
        t.stringLiteral(configPath)
      )
    )
  }

  let containerStyles

  const styles = classNames.reduce((acc, className, index) => {
    if (className === 'container') {
      if (outFormat === 'object' && isDev) {
        containerStyles = {
          ['__spread__' + index]: `Object.keys(${
            configIdentifier.name
          }.screens).reduce(function(acc, curr){return Object.assign({}, acc, {["@media (min-width: "+${
            configIdentifier.name
          }.screens[curr]+")"]:{maxWidth:${
            configIdentifier.name
          }.screens[curr]}})}, {})`
        }

        return merge(acc, { width: '100%' })
      } else if (outFormat === 'object' && isProd) {
        return deepmerge(acc, {
          width: '100%',
          ...Object.keys(config.screens).reduce((a, c) => {
            return {
              ...a,
              ...{
                [`@media (min-width: ${config.screens[c]})`]: {
                  maxWidth: config.screens[c]
                }
              }
            }
          }, {})
        })
      }
    }

    let modifier = className.match(/^([a-z-_]+):/i)
    if (modifier) {
      className = className.substr(modifier[0].length)
      if (modifier[1] === 'hover' || modifier[1] === 'focus') {
        modifier = ':' + modifier[1]
      } else {
        modifier = isProd
          ? '@media (min-width: ' + config.screens[modifier[1]] + ')'
          : '`@media (min-width: ${' +
            configIdentifier.name +
            '.screens["' +
            modifier[1] +
            '"]})`'
      }
    }

    if (staticStyles[className]) {
      if (modifier) {
        return merge(acc, {
          [modifier]: merge(acc[modifier] || {}, staticStyles[className])
        })
      } else {
        return merge(acc, staticStyles[className])
      }
    }

    let key
    Object.keys(dynamicStyles).some(k => {
      if (className.startsWith(k + '-')) {
        key = k
        return true
      }
    })
    if (key) {
      const value = className.substr(key.length + 1)
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

      if (modifier) {
        return merge(acc, {
          [modifier]: merge(acc[modifier] || {}, props)
        })
      } else {
        return merge(acc, props)
      }
    }

    return acc
  }, {})

  const styleObj = astify(styles, t)

  if (outFormat === 'string') {
    const tte = '`' + objToString(styles) + '`'
    path.replaceWith(babylon.parseExpression(tte))
  } else {
    if (containerStyles) {
      const program = path.find(p => p.isProgram())
      const mergeIdentifier = program.scope.generateUidIdentifier('merge')
      program.unshiftContainer(
        'body',
        t.importDeclaration(
          [t.importDefaultSpecifier(mergeIdentifier)],
          t.stringLiteral('babel-plugin-tailwind-components/merge')
        )
      )
      const mergeCall = t.callExpression(mergeIdentifier, [
        styleObj,
        astify(containerStyles, t)
      ])
      path.replaceWith(mergeCall)
    } else {
      path.replaceWith(styleObj)
    }
  }
}

function objToString(obj) {
  return Object.keys(obj).reduce((acc, k) => {
    let value = obj[k]

    if (k.startsWith('__spread__')) {
      return acc + '${' + value + '};'
    }

    if (typeof value === 'string') {
      if (value[0] === '$') {
        value = '${' + value.substr(1) + '}'
      }
      return acc + camelToKebab(k) + ':' + value + ';'
    } else {
      value = objToString(value)
      let key = k[0] === ':' ? '&' + k : k
      key = key[0] === '`' ? key.substr(1, key.length - 2) : key
      return acc + camelToKebab(key) + '{' + value + '};'
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
      return t.objectExpression(
        Object.keys(literal)
          .filter(k => {
            return typeof literal[k] !== 'undefined'
          })
          .map(k => {
            if (k.startsWith('__spread__')) {
              return t.spreadProperty(babylon.parseExpression(literal[k]))
            } else {
              const computed = k.startsWith('`')
              const key = computed
                ? babylon.parseExpression(k)
                : t.stringLiteral(k)
              return t.objectProperty(key, astify(literal[k], t), computed)
            }
          })
      )
  }
}
