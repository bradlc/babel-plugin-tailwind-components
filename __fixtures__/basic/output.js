import _styled from '@emotion/styled'
let styles = {
  textTransform: 'uppercase'
}

let Box = _styled.div(
  {
    textTransform: 'uppercase'
  },
  p => p.tw
)

let BoxExtended = _styled(Box)(
  {
    display: 'flex'
  },
  p => p.tw
)
