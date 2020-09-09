const { parseExpression } = require('@babel/parser')
const { createMacro, MacroError } = require('babel-plugin-macros')
const fs = require('fs')
const path = require('path')
const YAML = require('yaml')

module.exports = createMacro(yamlMacro)

function yamlMacro({ references, state }) {
  for (const { parentPath } of references.default) {
    if (parentPath.type !== 'CallExpression')
      throw new MacroError('yaml.macro only supports usage as a function call')

    let argPath, argOptions
    try {
      const args = parentPath.get('arguments')
      argPath = args[0].evaluate().value
      if (args.length > 1) argOptions = args[1].evaluate().value
    } catch (error) {
      error.message = `yaml.macro argument evaluation failed: ${error.message}`
      throw error
    }
    /* istanbul ignore if */
    if (!argPath) throw new MacroError('yaml.macro argument evaluation failed')

    const dirname = path.dirname(state.file.opts.filename)
    const fullPath = require.resolve(argPath, { paths: [dirname] })
    const fileContent = fs.readFileSync(fullPath, { encoding: 'utf-8' })

    const options = Object.assign({}, argOptions, { keepBlobsInJSON: false })
    const res = YAML.parse(fileContent, options)
    const exp = parseExpression(JSON.stringify(res))
    parentPath.replaceWith(exp)
  }
}
