const pluginTester = require('babel-plugin-tester')
const plugin = require('babel-plugin-macros')

pluginTester({
  plugin,
  babelOptions: { filename: __filename },
  tests: {
    // happy path
    'flat collection': {
      code: `
        import yaml from './macro'
        const foo = yaml('./__fixtures__/flat-collection.yaml')
      `,
      snapshot: true
    },
    'deep collection': {
      code: `
        import yaml from './macro'
        const foo = yaml('./__fixtures__/deep-collection.yaml')
      `,
      snapshot: true
    },
    sequence: {
      code: `
        import yaml from './macro'
        const foo = yaml('./__fixtures__/sequence.yaml')
      `,
      snapshot: true
    },
    number: {
      code: `
        import yaml from './macro'
        const foo = yaml('./__fixtures__/number.yaml')
      `,
      snapshot: true
    },
    string: {
      code: `
        import yaml from './macro'
        const foo = yaml('./__fixtures__/string.yaml')
      `,
      snapshot: true
    },

    // argument evaluation
    'concatenated filename': {
      code: `
        import yaml from './macro'
        const dir = './__fixtures__'
        const foo = yaml(dir + '/number.yaml')
      `,
      output: "const dir = './__fixtures__';\nconst foo = 42;"
    },
    'template literal filename': {
      code: `
        import yaml from './macro'
        const dir = '__fixtures__'
        const foo = yaml(\`\${'./' + dir}/number.yaml\`)
      `,
      output: "const dir = '__fixtures__';\nconst foo = 42;"
    },

    // errors
    'no argument': {
      code: `
        import yaml from './macro'
        const foo = yaml()
      `,
      error: 'yaml.macro argument evaluation failed'
    },
    'bad usage': {
      code: `
        import yaml from './macro'
        const foo = yaml
      `,
      error: 'yaml.macro only supports usage as a function call'
    },
    'file not found': {
      code: `
        import yaml from './macro'
        const foo = yaml('./does-not-exist.yaml')
      `,
      error: 'Cannot resolve module'
    },
    'YAML parse error': {
      code: `
        import yaml from './macro'
        const foo = yaml('./__fixtures__/bad-collection.yaml')
      `,
      error: 'Nested mappings are not allowed in compact mappings'
    }
  }
})
