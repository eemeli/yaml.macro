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

    let reqPath
    try {
      reqPath = parentPath.get('arguments')[0].evaluate().value
    } catch (error) {
      error.message = `yaml.macro argument evaluation failed: ${error.message}`
      throw error
    }
    if (!reqPath) throw new MacroError('yaml.macro argument evaluation failed')

    const dirname = path.dirname(state.file.opts.filename)
    const fullPath = require.resolve(reqPath, { paths: [dirname] })
    const fileContent = fs.readFileSync(fullPath, { encoding: 'utf-8' })
    const res = YAML.parse(fileContent, { keepBlobsInJSON: false })
    const exp = parseExpression(JSON.stringify(res))
    parentPath.replaceWith(exp)
  }
}
