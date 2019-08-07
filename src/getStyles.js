import dset from 'dset'
import dlv from 'dlv'
import staticStyles from './staticStyles.js'
import dynamicStyles from './dynamicStyles.js'
import { stringifyScreen, resolveStyle } from './utils.js'
import astify from './astify.js'
import assignify from './assignify.js'

export default function getStyles(str, t, state) {
  let styles = (str.match(/\S+/g) || []).reduce((acc, className, index) => {
    let modifiers = []
    let modifier

    while (modifier !== null) {
      modifier = className.match(/^([a-z-_]+):/i)
      if (modifier) {
        className = className.substr(modifier[0].length)
        modifiers.push(modifier[1])
      }
    }

    modifiers = modifiers.map(mod => {
      if (['hover', 'focus', 'active', 'focus-within', 'disabled', 'visited'].includes(mod)) {
        return `:${mod}`
      }

      if (mod === 'group') {
        return '.group &'
      }

      if (mod === 'group-hover') {
        return '.group:hover &'
      }

      if (state.isDev) {
        state.shouldImportConfig = true
      }

      return state.isProd
        ? stringifyScreen(state.config, mod)
        : '__computed__' +
            state.tailwindUtilsIdentifier.name +
            '.stringifyScreen(' +
            state.tailwindConfigIdentifier.name +
            ', "' +
            mod +
            '")'
    })

    if (staticStyles[className]) {
      if (modifiers.length) {
        dset(acc, modifiers, {
          ...dlv(acc, modifiers, {}),
          ...staticStyles[className]
        })
        return acc
      } else {
        return { ...acc, ...staticStyles[className] }
      }
    }

    let prefix
    Object.keys(dynamicStyles).some(k => {
      if (className.startsWith(k + '-') || className === k) {
        prefix = k
        return true
      }
    })

    if (prefix) {
      if (state.isDev) {
        state.shouldImportConfig = true
      }
      let key = className.substr(prefix.length + 1)
      if (key === '') key = 'default'
      if (prefix.startsWith('-')) key = '-' + key

      let obj

      if (Array.isArray(dynamicStyles[prefix])) {
        obj = state.isProd
          ? resolveStyle(state.config, dynamicStyles[prefix], key)
          : {
              ['__spread__' + index]:
                state.tailwindUtilsIdentifier.name +
                '.resolveStyle(' +
                state.tailwindConfigIdentifier.name +
                ', ' +
                JSON.stringify(dynamicStyles[prefix]) +
                ',"' +
                key +
                '")'
            }
      } else {
        let props = Array.isArray(dynamicStyles[prefix].prop)
          ? dynamicStyles[prefix].prop
          : [dynamicStyles[prefix].prop]
        obj = props.reduce((a, c) => {
          let pre = dynamicStyles[prefix].config === 'negativeMargin' ? '-' : ''
          if (pre && state.isDev) {
            pre = `"${pre}" + `
          }

          return state.isProd
            ? {
                ...a,
                [c]: pre + state.config.theme[dynamicStyles[prefix].config][key]
              }
            : {
                ...a,
                [c]:
                  '__computed__' +
                  pre +
                  state.tailwindConfigIdentifier.name +
                  '.theme.' +
                  dynamicStyles[prefix].config +
                  '["' +
                  key +
                  '"]'
              }
        }, {})
      }

      if (modifiers.length) {
        dset(acc, modifiers, { ...dlv(acc, modifiers, {}), ...obj })
        return acc
      } else {
        return { ...acc, ...obj }
      }
    } else {
      throw new Error(`Couldn’t resolve Tailwind class name: ${className}`)
    }
  }, {})

  let ast = astify(styles, t)

  if (state.isDev) {
    ast = assignify(ast, t)
  }

  return ast
}
