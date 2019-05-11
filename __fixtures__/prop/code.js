import tw from './macro'

let Component1 = () => <div tw="uppercase" />

let Component2 = () => <div css={{ display: 'flex' }} tw="uppercase" />

let Component3 = () => <div css={[{ display: 'flex' }]} tw="uppercase" />
