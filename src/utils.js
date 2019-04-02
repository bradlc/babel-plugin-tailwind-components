import resolveTailwindConfig from 'tailwindcss/lib/util/resolveConfig.js'
import defaultTailwindConfig from 'tailwindcss/stubs/defaultConfig.stub.js'
import dlv from 'dlv'

let resolvedConfig

export function resolveConfig(config) {
  if (resolvedConfig) return resolvedConfig
  resolvedConfig = resolveTailwindConfig([config, defaultTailwindConfig])
  return resolvedConfig
}

export function stringifyScreen(config, screen) {
  screen = config.theme.screens[screen]
  if (typeof screen === 'string') return `@media (min-width: ${screen})`
  if (typeof screen.raw === 'string') {
    return `@media ${screen.raw}`
  }
  let str = (Array.isArray(screen) ? screen : [screen])
    .map(range => {
      return [
        typeof range.min === 'string' ? `(min-width: ${range.min})` : null,
        typeof range.max === 'string' ? `(max-width: ${range.max})` : null
      ]
        .filter(Boolean)
        .join(' and ')
    })
    .join(', ')
  return str ? `@media ${str}` : ''
}

export function resolveStyle(config, opts, key) {
  for (let opt of opts) {
    if (['backgroundColor', 'borderColor', 'textColor'].includes(opt.config)) {
      let colors = flattenColors(dlv(config, ['theme', opt.config], {}))
      if (typeof colors[key] !== 'undefined') {
        return { [opt.prop]: colors[key] }
      }
    } else {
      let value = dlv(config, ['theme', opt.config, key])
      if (typeof value !== 'undefined') {
        if (opt.config === 'fontFamily' && Array.isArray(value)) {
          value = value.join(', ')
        }
        return { [opt.prop]: value }
      }
    }
  }

  return {}
}

function flattenColors(colors) {
  let result = {}
  for (let color in colors) {
    if (colors[color] === Object(colors[color])) {
      for (let key in colors[color]) {
        let suffix = key === 'default' ? '' : `-${key}`
        result[`${color}${suffix}`] = colors[color][key]
      }
    } else {
      result[color] = colors[color]
    }
  }
  return result
}
