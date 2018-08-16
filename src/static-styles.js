export default {
  // https://tailwindcss.com/docs/background-position
  'bg-bottom': { backgroundPosition: 'bottom' },
  'bg-center': { backgroundPosition: 'center' },
  'bg-left': { backgroundPosition: 'left' },
  'bg-left-bottom': { backgroundPosition: 'left bottom' },
  'bg-left-top': { backgroundPosition: 'left top' },
  'bg-right': { backgroundPosition: 'right' },
  'bg-right-bottom': { backgroundPosition: 'right bottom' },
  'bg-right-top': { backgroundPosition: 'right-top' },
  'bg-top': { backgroundPosition: 'top' },

  // https://tailwindcss.com/docs/background-repeat
  'bg-repeat': { backgroundRepeat: 'repeat' },
  'bg-no-repeat': { backgroundRepeat: 'no-repeat' },
  'bg-repeat-x': { backgroundRepeat: 'repeat-x' },
  'bg-repeat-y': { backgroundRepeat: 'repeat-y' },

  // https://tailwindcss.com/docs/background-attachment
  'bg-fixed': { backgroundAttachment: 'fixed' },
  'bg-local': { backgroundAttachment: 'local' },
  'bg-scroll': { backgroundAttachment: 'scroll' },

  // https://tailwindcss.com/docs/border-style
  'border-solid': { borderStyle: 'solid' },
  'border-dashed': { borderStyle: 'dashed' },
  'border-dotted': { borderStyle: 'dotted' },
  'border-none': { borderStyle: 'none' },

  // https://tailwindcss.com/docs/display
  block: { display: 'block' },
  'inline-block': { display: 'inline-block' },
  inline: { display: 'inline' },
  table: { display: 'table' },
  'table-row': { display: 'table-row' },
  'table-cell': { display: 'table-cell' },
  hidden: { display: 'none' },
  flex: { display: 'flex' },
  'inline-flex': { display: 'inline-flex' },

  // https://tailwindcss.com/docs/flexbox-direction
  'flex-row': { flexDirection: 'row' },
  'flex-row-reverse': { flexDirection: 'row-reverse' },
  'flex-col': { flexDirection: 'column' },
  'flex-col-reverse': { flexDirection: 'column-reverse' },

  // https://tailwindcss.com/docs/flexbox-wrapping
  'flex-no-wrap': { flexWrap: 'nowrap' },
  'flex-wrap': { flexWrap: 'wrap' },
  'flex-wrap-reverse': { flexWrap: 'wrap-reverse' },

  // https://tailwindcss.com/docs/flexbox-justify-content
  'justify-start': { justifyContent: 'flex-start' },
  'justify-center': { justifyContent: 'center' },
  'justify-end': { justifyContent: 'flex-end' },
  'justify-between': { justifyContent: 'space-between' },
  'justify-around': { justifyContent: 'space-around' },

  // https://tailwindcss.com/docs/flexbox-align-items
  'items-stretch': { alignItems: 'flex-stretch' },
  'items-start': { alignItems: 'flex-start' },
  'items-center': { alignItems: 'center' },
  'items-end': { alignItems: 'flex-end' },
  'items-baseline': { alignItems: 'baseline' },

  // https://tailwindcss.com/docs/flexbox-align-content
  'content-start': { alignContent: 'flex-start' },
  'content-center': { alignContent: 'center' },
  'content-end': { alignContent: 'flex-end' },
  'content-between': { alignContent: 'space-between' },
  'content-around': { alignContent: 'space-around' },

  // https://tailwindcss.com/docs/flexbox-align-self
  'self-auto': { alignSelf: 'auto' },
  'self-start': { alignSelf: 'flex-start' },
  'self-center': { alignSelf: 'center' },
  'self-end': { alignSelf: 'flex-end' },
  'self-stretch': { alignSelf: 'stretch' },

  // https://tailwindcss.com/docs/flexbox-flex-grow-shrink
  'flex-initial': { flex: 'initial' },
  'flex-1': { flex: 1 },
  'flex-auto': { flex: 'auto' },
  'flex-none': { flex: 'none' },
  'flex-grow': { flexGrow: 1 },
  'flex-shrink': { flexShrink: 1 },
  'flex-no-grow': { flexGrow: 0 },
  'flex-no-shrink': { flexShrink: 0 },

  // https://tailwindcss.com/docs/floats
  'float-right': { float: 'right' },
  'float-left': { float: 'left' },
  'float-none': { float: 'none' },
  clearfix: { '::after': { content: '""', display: 'table', clear: 'both' } },

  // https://tailwindcss.com/docs/forms
  'appearance-none': { appearance: 'none' },

  // https://tailwindcss.com/docs/cursor
  'cursor-auto': { cursor: 'auto' },
  'cursor-default': { cursor: 'default' },
  'cursor-pointer': { cursor: 'pointer' },
  'cursor-wait': { cursor: 'wait' },
  'cursor-move': { cursor: 'move' },
  'cursor-not-allowed': { cursor: 'not-allowed' },

  // https://tailwindcss.com/docs/resize
  'resize-none': { resize: 'none' },
  resize: { resize: 'both' },
  'resize-y': { resize: 'vertical' },
  'resize-x': { resize: 'horizontal' },

  // https://tailwindcss.com/docs/pointer-events
  'pointer-events-none': { pointerEvents: 'none' },
  'pointer-events-auto': { pointerEvents: 'auto' },

  // https://tailwindcss.com/docs/user-select
  'select-none': { userSelect: 'none' },
  'select-text': { userSelect: 'text' },

  // https://tailwindcss.com/docs/lists
  'list-reset': { listStyle: 'none', padding: 0 },

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
  'scrolling-touch': { webkitOverflowScrolling: 'touch' },
  'scrolling-auto': { webkitOverflowScrolling: 'auto' },

  // https://tailwindcss.com/docs/positioning
  static: { position: 'static' },
  fixed: { position: 'fixed' },
  absolute: { position: 'absolute' },
  relative: { position: 'relative' },
  sticky: { position: 'sticky' },
  'pin-t': { top: 0 },
  'pin-r': { right: 0 },
  'pin-b': { bottom: 0 },
  'pin-l': { left: 0 },
  'pin-y': { top: 0, bottom: 0 },
  'pin-x': { right: 0, left: 0 },
  pin: { top: 0, right: 0, bottom: 0, left: 0 },
  'pin-none': { top: 'auto', right: 'auto', bottom: 'auto', left: 'auto' },

  // https://tailwindcss.com/docs/text-alignment
  'text-left': { textAlign: 'left' },
  'text-center': { textAlign: 'center' },
  'text-right': { textAlign: 'right' },
  'text-justify': { textAlign: 'justify' },

  // https://tailwindcss.com/docs/text-style
  italic: { fontStyle: 'italic' },
  roman: { fontStyle: 'normal' },
  uppercase: { textTransform: 'uppercase' },
  lowercase: { textTransform: 'lowercase' },
  capitalize: { textTransform: 'capitalize' },
  'normal-case': { textTransform: 'none' },
  underline: { textDecoration: 'underline' },
  'line-through': { textDecoration: 'line-through' },
  'no-underline': { textDecoration: 'none' },
  antialiased: {
    webkitFontSmoothing: 'antialiased',
    mozOsxFontSmoothing: 'grayscale'
  },
  'subpixel-antialiased': {
    webkitFontSmoothing: 'auto',
    mozOsxFontSmoothing: 'auto'
  },

  // https://tailwindcss.com/docs/whitespace-and-wrapping
  'whitespace-normal': { whiteSpace: 'normal' },
  'whitespace-no-wrap': { whiteSpace: 'nowrap' },
  'whitespace-pre': { whiteSpace: 'pre' },
  'whitespace-pre-line': { whiteSpace: 'pre-line' },
  'whitespace-pre-wrap': { whiteSpace: 'pre-wrap' },
  'break-words': { wordWrap: 'break-word' },
  'break-normal': { wordWrap: 'normal' },
  truncate: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },

  // https://tailwindcss.com/docs/vertical-alignment
  'align-baseline': { verticalAlign: 'baseline' },
  'align-top': { verticalAlign: 'top' },
  'align-middle': { verticalAlign: 'middle' },
  'align-bottom': { verticalAlign: 'bottom' },
  'align-text-top': { verticalAlign: 'text-top' },
  'align-text-bottom': { verticalAlign: 'text-bottom' },

  // https://tailwindcss.com/docs/visibility
  visible: { visibility: 'visible' },
  invisible: { visibility: 'hidden' },

  // https://tailwindcss.com/docs/border-collapse
  'border-collapse': { borderCollapse: 'collapse' },
  'border-separate': { borderCollapse: 'separate' },

  // https://tailwindcss.com/docs/table-layout
  'table-auto': { tableLayout: 'auto' },
  'table-fixed': { tableLayout: 'fixed' },

  // https://tailwindcss.com/docs/outline
  'outline-none': { outline: 0 }
}
