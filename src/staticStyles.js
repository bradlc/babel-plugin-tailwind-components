let staticStyles = {
  // https://tailwindcss.com/docs/display
  block: { display: 'block' },
  'inline-block': { display: 'inline-block' },
  inline: { display: 'inline' },
  flex: { display: 'flex' },
  'inline-flex': { display: 'inline-flex' },
  table: { display: 'table' },
  'table-row': { display: 'table-row' },
  'table-cell': { display: 'table-cell' },
  hidden: { display: 'none' },

  // https://tailwindcss.com/docs/float
  'float-right': { float: 'right' },
  'float-left': { float: 'left' },
  'float-none': { float: 'none' },
  clearfix: { '::after': { content: '""', display: 'table', clear: 'both' } },

  // https://tailwindcss.com/docs/object-fit
  'object-contain': { objectFit: 'contain' },
  'object-cover': { objectFit: 'cover' },
  'object-fill': { objectFit: 'fill' },
  'object-none': { objectFit: 'none' },
  'object-scale-down': { objectFit: 'scale-down' },

  // https://tailwindcss.com/docs/overflow
  'overflow-auto': { overflow: 'auto' },
  'overflow-hidden': { overflow: 'hidden' },
  'overflow-visible': { overflow: 'visible' },
  'overflow-scroll': { overflow: 'scroll' },
  'overflow-x-auto': { overflowX: 'auto' },
  'overflow-y-auto': { overflowY: 'auto' },
  'overflow-x-hidden': { overflowX: 'hidden' },
  'overflow-y-hidden': { overflowY: 'hidden' },
  'overflow-x-visible': { overflowX: 'visible' },
  'overflow-y-visible': { overflowY: 'visible' },
  'overflow-x-scroll': { overflowX: 'scroll' },
  'overflow-y-scroll': { overflowY: 'scroll' },
  'scrolling-touch': { WebkitOverflowScrolling: 'touch' },
  'scrolling-auto': { WebkitOverflowScrolling: 'auto' },

  // https://tailwindcss.com/docs/position
  static: { position: 'static' },
  fixed: { position: 'fixed' },
  absolute: { position: 'absolute' },
  relative: { position: 'relative' },
  sticky: { position: 'sticky' },

  // https://tailwindcss.com/docs/visibility
  visible: { visibility: 'visible' },
  invisible: { visibility: 'hidden' },

  // https://tailwindcss.com/docs/list-style-position
  'list-inside': { listStylePosition: 'inside' },
  'list-outside': { listStylePosition: 'outside' },

  // https://tailwindcss.com/docs/text-style
  italic: { fontStyle: 'italic' },
  'not-italic': { fontStyle: 'normal' },
  uppercase: { textTransform: 'uppercase' },
  lowercase: { textTransform: 'lowercase' },
  capitalize: { textTransform: 'capitalize' },
  'normal-case': { textTransform: 'none' },
  underline: { textDecoration: 'underline' },
  'line-through': { textDecoration: 'line-through' },
  'no-underline': { textDecoration: 'none' },
  antialiased: {
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale'
  },
  'subpixel-antialiased': {
    WebkitFontSmoothing: 'auto',
    MozOsxFontSmoothing: 'auto'
  },

  // https://tailwindcss.com/docs/text-align
  'text-left': { textAlign: 'left' },
  'text-center': { textAlign: 'center' },
  'text-right': { textAlign: 'right' },
  'text-justify': { textAlign: 'justify' },

  // https://tailwindcss.com/docs/vertical-align
  'align-baseline': { verticalAlign: 'baseline' },
  'align-top': { verticalAlign: 'top' },
  'align-middle': { verticalAlign: 'middle' },
  'align-bottom': { verticalAlign: 'bottom' },
  'align-text-top': { verticalAlign: 'text-top' },
  'align-text-bottom': { verticalAlign: 'text-bottom' },

  // https://tailwindcss.com/docs/whitespace
  'whitespace-normal': { whiteSpace: 'normal' },
  'whitespace-no-wrap': { whiteSpace: 'nowrap' },
  'whitespace-pre': { whiteSpace: 'pre' },
  'whitespace-pre-line': { whiteSpace: 'pre-line' },
  'whitespace-pre-wrap': { whiteSpace: 'pre-wrap' },

  // https://tailwindcss.com/docs/word-break
  'break-normal': { wordBreak: 'normal', overflowWrap: 'normal' },
  'break-words': { wordWrap: 'break-word' },
  'break-all': { wordBreak: 'normal' },
  truncate: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },

  // https://tailwindcss.com/docs/background-attachment
  'bg-fixed': { backgroundAttachment: 'fixed' },
  'bg-local': { backgroundAttachment: 'local' },
  'bg-scroll': { backgroundAttachment: 'scroll' },

  // https://tailwindcss.com/docs/background-repeat
  'bg-repeat': { backgroundRepeat: 'repeat' },
  'bg-no-repeat': { backgroundRepeat: 'no-repeat' },
  'bg-repeat-x': { backgroundRepeat: 'repeat-x' },
  'bg-repeat-y': { backgroundRepeat: 'repeat-y' },

  // https://tailwindcss.com/docs/border-style
  'border-solid': { borderStyle: 'solid' },
  'border-dashed': { borderStyle: 'dashed' },
  'border-dotted': { borderStyle: 'dotted' },
  'border-none': { borderStyle: 'none' },

  // https://tailwindcss.com/docs/flexbox-direction
  'flex-row': { flexDirection: 'row' },
  'flex-row-reverse': { flexDirection: 'row-reverse' },
  'flex-col': { flexDirection: 'column' },
  'flex-col-reverse': { flexDirection: 'column-reverse' },

  // https://tailwindcss.com/docs/flex-wrap
  'flex-no-wrap': { flexWrap: 'nowrap' },
  'flex-wrap': { flexWrap: 'wrap' },
  'flex-wrap-reverse': { flexWrap: 'wrap-reverse' },

  // https://tailwindcss.com/docs/align-items
  'items-stretch': { alignItems: 'flex-stretch' },
  'items-start': { alignItems: 'flex-start' },
  'items-center': { alignItems: 'center' },
  'items-end': { alignItems: 'flex-end' },
  'items-baseline': { alignItems: 'baseline' },

  // https://tailwindcss.com/docs/align-content
  'content-start': { alignContent: 'flex-start' },
  'content-center': { alignContent: 'center' },
  'content-end': { alignContent: 'flex-end' },
  'content-between': { alignContent: 'space-between' },
  'content-around': { alignContent: 'space-around' },

  // https://tailwindcss.com/docs/align-self
  'self-auto': { alignSelf: 'auto' },
  'self-start': { alignSelf: 'flex-start' },
  'self-center': { alignSelf: 'center' },
  'self-end': { alignSelf: 'flex-end' },
  'self-stretch': { alignSelf: 'stretch' },

  // https://tailwindcss.com/docs/justify-content
  'justify-start': { justifyContent: 'flex-start' },
  'justify-center': { justifyContent: 'center' },
  'justify-end': { justifyContent: 'flex-end' },
  'justify-between': { justifyContent: 'space-between' },
  'justify-around': { justifyContent: 'space-around' },

  // https://tailwindcss.com/docs/border-collapse
  'border-collapse': { borderCollapse: 'collapse' },
  'border-separate': { borderCollapse: 'separate' },

  // https://tailwindcss.com/docs/table-layout
  'table-auto': { tableLayout: 'auto' },
  'table-fixed': { tableLayout: 'fixed' },

  // https://tailwindcss.com/docs/appearance
  'appearance-none': { appearance: 'none' },

  // https://tailwindcss.com/docs/outline
  'outline-none': { outline: 0 },

  // https://tailwindcss.com/docs/pointer-events
  'pointer-events-none': { pointerEvents: 'none' },
  'pointer-events-auto': { pointerEvents: 'auto' },

  // https://tailwindcss.com/docs/resize
  'resize-none': { resize: 'none' },
  resize: { resize: 'both' },
  'resize-y': { resize: 'vertical' },
  'resize-x': { resize: 'horizontal' },

  // https://tailwindcss.com/docs/user-select
  'select-none': { userSelect: 'none' },
  'select-text': { userSelect: 'text' }
}

export default staticStyles
