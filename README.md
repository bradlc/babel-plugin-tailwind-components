# babel-plugin-tailwind-components [![npm](https://img.shields.io/npm/v/babel-plugin-tailwind-components.svg)](https://www.npmjs.com/package/babel-plugin-tailwind-components) [![Babel Macro](https://img.shields.io/badge/babel--macro-%F0%9F%8E%A3-f5da55.svg?style=flat)](https://github.com/kentcdodds/babel-plugin-macros)

> Use [Tailwind](https://tailwindcss.com/) with any CSS-in-JS library

## Prerequisites

Before you start using babel-plugin-tailwind-components you will need to ensure that you have a [Tailwind config file](https://tailwindcss.com/docs/configuration). You can grab the default config from the [Tailwind repo](https://github.com/tailwindcss/tailwindcss/blob/master/defaultConfig.stub.js).

Place the config file in your project root as `tailwind.js`. Alternatively you can specify a different filename in the [plugin options](#options).

## Installation

There are two ways to use babel-plugin-tailwind-components. The recommended way is via [babel-plugin-macros](https://github.com/kentcdodds/babel-plugin-macros):

```
npm install --save-dev babel-plugin-macros tailwind.macro
```

> _Note: [tailwind.macro](https://github.com/bradlc/tailwind.macro) is merely an alias for [babel-plugin-tailwind-components/macro](https://github.com/bradlc/babel-plugin-tailwind-components/blob/master/src/macro.js)_

Then add babel-plugin-macros to your babel config:

```js
{
  "plugins": ["macros"]
}
```

> _Note: you will also need to install and enable `@babel/plugin-syntax-object-rest-spread` if you haven’t already_

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

The babel plugin transforms the tagged template literal into a style object:

**In**

```js
const foo = tw`text-red hover:text-green sm:text-blue`
```

**Out**

```js
const foo = {
  color: '#e3342f',
  ':hover': {
    color: '#38c172'
  },
  '@media (min-width: 576px)': {
    color: '#3490dc'
  }
}
```

This style object format is compatible with most CSS-in-JS libraries, including [styled-components](#examples).

Some libraries such as [styled-jsx](https://github.com/zeit/styled-jsx) do not support this format, so when used inside a `<style>` element the tagged template literal is transformed into a CSS string instead:

**In**

```js
<style jsx>{`
  .foo {
    ${tw`text-red hover:text-green sm:text-blue`};
  }
`}</style>
```

**Out**

```js
<style jsx>{`
  .foo {
    color: #e3342f;

    &:hover {
      color: #38c172;
    }

    @media (min-width: 576px) {
      color: #3490dc;
    }
  }
`}</style>
```

_Note: when using `hover:*`, `focus:*`, or media query (e.g. `sm:*`) class names the output is nested like above. You will need to use [styled-jsx-plugin-postcss](https://github.com/giuseppeg/styled-jsx-plugin-postcss) and [postcss-nested](https://github.com/postcss/postcss-nested) to get this to work._

## Options

`config`: path to your Tailwind config file. Defaults to `"./tailwind.js"`

`format`: CSS output format. `"object"`, `"string"`, or `"auto"` (default) – `"auto"` will cause the output to be an object except when inside a `<style>` element. See [how it works](#how-it-works) for more info.

```js
// babel-plugin-macros.config.js
module.exports = {
  tailwind: {
    config: './tailwind.js',
    format: 'auto'
  }
}

// or .babelrc
{
  "plugins": [
    [
      "tailwind-components", {
        "config": "./tailwind.js",
        "format": "auto"
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
  <Button className={green} css={tw`uppercase`}>
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

**[styled-jsx](https://github.com/zeit/styled-jsx)**

```js
import tw from 'tailwind.macro'

const App = () => (
  <div>
    <div className="foo">hello, world</div>
    <style jsx>{`
      .foo {
        ${tw`font-mono text-sm text-red hover:text-blue`};
      }
    `}</style>
  </div>
)
```

_Note: when using `hover:*`, `focus:*`, or media query (e.g. `sm:*`) class names the output is nested. You will need to use [styled-jsx-plugin-postcss](https://github.com/giuseppeg/styled-jsx-plugin-postcss) and [postcss-nested](https://github.com/postcss/postcss-nested) to get this to work._

## Todo

- ~~support for the [container class](https://tailwindcss.com/docs/container); [in progress](https://github.com/bradlc/babel-plugin-tailwind-components/pull/2)~~ container is now a plugin and there is no plan to support plugins
- ~~support for multiple modifiers, e.g. `sm:hover:*`~~
- ~~support for defaults; for example `rounded` should be an alias for `rounded-default`~~
- add [CodeSandbox](https://codesandbox.io/) demos
