export default {
  // https://tailwindcss.com/docs/background-color
  // https://tailwindcss.com/docs/background-size
  bg: [
    { prop: 'backgroundColor', config: 'backgroundColors' },
    { prop: 'backgroundSize', config: 'backgroundSize' }
  ],

  // https://tailwindcss.com/docs/border-width
  'border-t': { prop: 'borderTopWidth', config: 'borderWidths' },
  'border-b': { prop: 'borderBottomWidth', config: 'borderWidths' },
  'border-l': { prop: 'borderLeftWidth', config: 'borderWidths' },
  'border-r': { prop: 'borderRightWidth', config: 'borderWidths' },

  // https://tailwindcss.com/docs/border-color
  border: [
    { prop: 'borderWidth', config: 'borderWidths' },
    { prop: 'borderColor', config: 'borderColors' }
  ],

  // https://tailwindcss.com/docs/border-radius
  'rounded-t': { prop: 'borderTopRadius', config: 'borderRadius' },
  'rounded-r': { prop: 'borderRightRadius', config: 'borderRadius' },
  'rounded-b': { prop: 'borderBottomRadius', config: 'borderRadius' },
  'rounded-l': { prop: 'borderLeftRadius', config: 'borderRadius' },
  'rounded-tl': { prop: 'borderTopLeftRadius', config: 'borderRadius' },
  'rounded-tr': { prop: 'borderTopRightRadius', config: 'borderRadius' },
  'rounded-br': { prop: 'borderBottomRightRadius', config: 'borderRadius' },
  'rounded-bl': { prop: 'borderBottomLeftRadius', config: 'borderRadius' },
  rounded: { prop: 'borderRadius', config: 'borderRadius' },

  // https://tailwindcss.com/docs/opacity
  opacity: { prop: 'opacity', config: 'opacity' },

  // https://tailwindcss.com/docs/shadows
  shadow: { prop: 'boxShadow', config: 'shadows' },

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

  '-mt': { prop: 'marginTop', config: 'negativeMargin', preDev: '"-"+', pre: "-" },
  '-mr': { prop: 'marginRight', config: 'negativeMargin', preDev: '"-"+', pre: "-" },
  '-mb': { prop: 'marginBottom', config: 'negativeMargin', preDev: '"-"+', pre: "-" },
  '-ml': { prop: 'marginLeft', config: 'negativeMargin', preDev: '"-"+', pre: "-" },
  '-mx': {
    prop: ['marginLeft', 'marginRight'],
    config: 'negativeMargin',
    preDev: '"-"+',
    pre: "-"
  },
  '-my': {
    prop: ['marginTop', 'marginBottom'],
    config: 'negativeMargin',
    preDev: '"-"+',
    pre: "-"
  },
  '-m': { prop: 'margin', config: 'negativeMargin', preDev: '"-"+', pre: "-" },

  // https://tailwindcss.com/docs/svg
  fill: { prop: 'fill', config: 'svgFill' },
  stroke: { prop: 'stroke', config: 'svgStroke' },

  // https://tailwindcss.com/docs/fonts
  font: [
    { prop: 'fontWeight', config: 'fontWeights' },
    {
      prop: 'fontFamily',
      config: 'fonts',
      preDev: '(',
      postDev: ` || []).map(x => '"' + x + '"').join(', ')`,
      format: val => val.map(x => '"' + x + '"').join(', ')
    }
  ],
  text: [
    { prop: 'color', config: 'textColors' },
    { prop: 'fontSize', config: 'textSizes' }
  ],

  // https://tailwindcss.com/docs/line-height
  leading: { prop: 'lineHeight', config: 'leading' },

  // https://tailwindcss.com/docs/letter-spacing
  tracking: { prop: 'letterSpacing', config: 'tracking' },

  // https://tailwindcss.com/docs/z-index
  z: { prop: 'zIndex', config: 'zIndex' }
}
