let dynamicStyles = {
  // https://tailwindcss.com/docs/background-color
  // https://tailwindcss.com/docs/background-size
  bg: [
    { prop: 'backgroundColor', config: 'backgroundColor' },
    { prop: 'backgroundSize', config: 'backgroundSize' },
    { prop: 'backgroundPosition', config: 'backgroundPosition' }
  ],

  // https://tailwindcss.com/docs/border-width
  'border-t': { prop: 'borderTopWidth', config: 'borderWidth' },
  'border-b': { prop: 'borderBottomWidth', config: 'borderWidth' },
  'border-l': { prop: 'borderLeftWidth', config: 'borderWidth' },
  'border-r': { prop: 'borderRightWidth', config: 'borderWidth' },

  // https://tailwindcss.com/docs/border-color
  border: [
    { prop: 'borderWidth', config: 'borderWidth' },
    { prop: 'borderColor', config: 'borderColor' }
  ],

  // https://tailwindcss.com/docs/border-radius
  'rounded-tl': { prop: 'borderTopLeftRadius', config: 'borderRadius' },
  'rounded-tr': { prop: 'borderTopRightRadius', config: 'borderRadius' },
  'rounded-br': { prop: 'borderBottomRightRadius', config: 'borderRadius' },
  'rounded-bl': { prop: 'borderBottomLeftRadius', config: 'borderRadius' },
  'rounded-t': {
    prop: ['borderTopLeftRadius', 'borderTopRightRadius'],
    config: 'borderRadius'
  },
  'rounded-r': {
    prop: ['borderTopRightRadius', 'borderBottomRightRadius'],
    config: 'borderRadius'
  },
  'rounded-b': {
    prop: ['borderBottomLeftRadius', 'borderBottomRightRadius'],
    config: 'borderRadius'
  },
  'rounded-l': {
    prop: ['borderTopLeftRadius', 'borderBottomLeftRadius'],
    config: 'borderRadius'
  },
  rounded: { prop: 'borderRadius', config: 'borderRadius' },

  // https://tailwindcss.com/docs/opacity
  opacity: { prop: 'opacity', config: 'opacity' },

  // https://tailwindcss.com/docs/shadows
  shadow: { prop: 'boxShadow', config: 'boxShadow' },

  // https://tailwindcss.com/docs/width
  w: { prop: 'width', config: 'width' },

  // https://tailwindcss.com/docs/min-width
  'min-w': { prop: 'minWidth', config: 'minWidth' },

  // https://tailwindcss.com/docs/max-width
  'max-w': { prop: 'maxWidth', config: 'maxWidth' },

  // https://tailwindcss.com/docs/height
  h: { prop: 'height', config: 'height' },

  // https://tailwindcss.com/docs/min-height
  'min-h': { prop: 'minHeight', config: 'minHeight' },

  // https://tailwindcss.com/docs/max-height
  'max-h': { prop: 'maxHeight', config: 'maxHeight' },

  // https://tailwindcss.com/docs/spacing
  pt: { prop: 'paddingTop', config: 'padding' },
  pr: { prop: 'paddingRight', config: 'padding' },
  pb: { prop: 'paddingBottom', config: 'padding' },
  pl: { prop: 'paddingLeft', config: 'padding' },
  px: { prop: ['paddingLeft', 'paddingRight'], config: 'padding' },
  py: { prop: ['paddingTop', 'paddingBottom'], config: 'padding' },
  p: { prop: 'padding', config: 'padding' },

  mt: { prop: 'marginTop', config: 'margin' },
  mr: { prop: 'marginRight', config: 'margin' },
  mb: { prop: 'marginBottom', config: 'margin' },
  ml: { prop: 'marginLeft', config: 'margin' },
  mx: { prop: ['marginLeft', 'marginRight'], config: 'margin' },
  my: { prop: ['marginTop', 'marginBottom'], config: 'margin' },
  m: { prop: 'margin', config: 'margin' },

  '-mt': { prop: 'marginTop', config: 'negativeMargin', pre: '"-"+' },
  '-mr': { prop: 'marginRight', config: 'negativeMargin', pre: '"-"+' },
  '-mb': { prop: 'marginBottom', config: 'negativeMargin', pre: '"-"+' },
  '-ml': { prop: 'marginLeft', config: 'negativeMargin', pre: '"-"+' },
  '-mx': {
    prop: ['marginLeft', 'marginRight'],
    config: 'negativeMargin',
    pre: '"-"+'
  },
  '-my': {
    prop: ['marginTop', 'marginBottom'],
    config: 'negativeMargin',
    pre: '"-"+'
  },
  '-m': { prop: 'margin', config: 'negativeMargin', pre: '"-"+' },

  // https://tailwindcss.com/docs/order
  order: { prop: 'order', config: 'order' },

  // https://tailwindcss.com/docs/svg
  fill: { prop: 'fill', config: 'fill' },
  stroke: { prop: 'stroke', config: 'stroke' },

  // https://tailwindcss.com/docs/fonts
  font: [
    { prop: 'fontWeight', config: 'fontWeight' },
    {
      prop: 'fontFamily',
      config: 'fontFamily'
    }
  ],
  text: [
    { prop: 'color', config: 'textColor' },
    { prop: 'fontSize', config: 'fontSize' }
  ],

  // https://tailwindcss.com/docs/line-height
  leading: { prop: 'lineHeight', config: 'lineHeight' },

  // https://tailwindcss.com/docs/letter-spacing
  tracking: { prop: 'letterSpacing', config: 'letterSpacing' },

  // https://tailwindcss.com/docs/z-index
  z: { prop: 'zIndex', config: 'zIndex' },

  cursor: { prop: 'cursor', config: 'cursor' },

  object: { prop: 'objectPosition', config: 'objectPosition' },

  flex: { prop: 'flex', config: 'flex' },
  'flex-grow': { prop: 'flexGrow', config: 'flexGrow' },
  'flex-shrink': { prop: 'flexShrink', config: 'flexShrink' },

  list: { prop: 'listStyleType', config: 'listStyleType' },

  top: { prop: 'top', config: 'inset' },
  right: { prop: 'right', config: 'inset' },
  bottom: { prop: 'bottom', config: 'inset' },
  left: { prop: 'left', config: 'inset' },
  'inset-x': { prop: ['left', 'right'], config: 'inset' },
  'inset-y': { prop: ['top', 'bottom'], config: 'inset' },
  inset: { prop: ['top', 'right', 'bottom', 'left'], config: 'inset' }
}

export default dynamicStyles
