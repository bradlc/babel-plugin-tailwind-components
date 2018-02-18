# babel-plugin-tailwind-components [![npm](https://img.shields.io/npm/v/babel-plugin-tailwind-components.svg)](https://www.npmjs.com/package/babel-plugin-tailwind-components) [![Babel Macro](https://img.shields.io/badge/babel--macro-%F0%9F%8E%A3-f5da55.svg?style=flat)](https://github.com/kentcdodds/babel-plugin-macros)

Use [Tailwind](https://tailwindcss.com/) with any CSS-in-JS library

## Prerequisites

Before you start using babel-plugin-tailwind-components you will need to ensure that you have a [Tailwind config file](https://tailwindcss.com/docs/configuration). You can grab the default config from the [Tailwind repo](https://github.com/tailwindcss/tailwindcss/blob/master/defaultConfig.stub.js).

Place the config file in your project root as `tailwind.js`. Alternatively you can specify a different filename in the [plugin options](#options).

## Installation

There are two ways to use babel-plugin-tailwind-components. The recommended way is via [babel-plugin-macros](https://github.com/kentcdodds/babel-plugin-macros):

```
npm install --save-dev babel-plugin-macros tailwind.macro
```

_Note: [tailwind.macro](https://github.com/bradlc/tailwind.macro) is merely an alias for [babel-plugin-tailwind-components/macro](https://github.com/bradlc/babel-plugin-tailwind-components/blob/master/src/macro.js)_

Then add babel-plugin-macros to your babel config:

```js
{
  "plugins": ["macros"]
}
```

You can now use Tailwind classes with your preferred CSS-in-JS library by importing `tailwind.macro`:

```js
import styled from 'styled-components'
import tw from 'tailwind.macro'

const Button = styled('button')`
  ${tw`font-mono text-sm text-red hover:text-blue`};
`
```

Alternatively, you can use the plugin without babel-plugin-macros:

```
npm install --save-dev babel-plugin-tailwind-components
```

```js
// .babelrc
{
  "plugins": ["tailwind-components"]
}
```

When using this method the `tw` tag is available anywhere without an explicit import:

```js
import styled from 'styled-components'

const Button = styled('button')`
  ${tw`font-mono text-sm text-red hover:text-blue`};
`
```

## How it works

The babel plugin transforms the tagged template literal into either a style object or template literal, depending on context. If you use the tag inside a template literal, the output will be a template literal, like in the styled-components example above.

**In**

```js
const foo = tw`bg-cover`
const bar = `${tw`bg-cover`}`
```

**Out**

```js
const foo = {
  backgroundSize: 'cover'
}
const bar = ${`background-size:cover;`}
```

You can enforce a particular format globally by setting the `format` option...

## Options

`config`: path to your Tailwind config file. Defaults to _./tailwind.js_

`format`: the format of the resulting styles (`object` or `string`). By default it will be an object except when inside a template literal.

```js
// babel-plugin-macros.config.js
module.exports = {
  tailwind: {
    config: './tailwind.config.js',
    format: 'object'
  }
}

// or .babelrc
{
  "plugins": [
    [
      "tailwind-components", {
        "config": "./tailwind.config.js",
        "format": "object"
      }
    ]
  ]
}
```

## Examples

**[styled-components](https://github.com/styled-components/styled-components)**

```js
import styled from 'styled-components'
import tw from 'tailwind.macro'

const Button = styled('button')`
  ${tw`font-mono text-sm text-red hover:text-blue`};
`
```

**[emotion](https://github.com/emotion-js/emotion)**

```js
import styled from 'preact-emotion'
import { css } from 'emotion'
import tw from 'tailwind.macro'

const green = css(tw`text-green`)

const Button = styled('button')`
  ${tw`font-mono text-sm text-red hover:text-blue`};
`

const App = () => (
  <Button class={green} css={tw`uppercase`}>
    hello, world
  </Button>
)
```

_Note: the `css` prop requires the use of [babel-plugin-emotion](https://github.com/emotion-js/emotion/tree/master/packages/babel-plugin-emotion)_

**[glamor](https://github.com/threepointone/glamor)**

```js
import { css } from 'glamor'
import tw from 'tailwind.macro'

const style = css(tw`font-mono text-sm text-red hover:text-blue`)

const App = () => <div {...style}>hello, world</div>
```

## Todo

* support for the [container class](https://tailwindcss.com/docs/container); [in progress](https://github.com/bradlc/babel-plugin-tailwind-components/pull/2)
* ~~support for defaults; for example `rounded` should be an alias for `rounded-default`~~
* add [CodeSandbox](https://codesandbox.io/) demos
