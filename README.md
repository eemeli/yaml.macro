# yaml.macro

A [Babel macro](https://github.com/kentcdodds/babel-plugin-macros) for loading YAML files.

```
npm install --save-dev yaml.macro
```

Source:

```yaml
# file.yaml
- YAML file
- with: some contents
```

```js
import yaml from 'yaml.macro'

const foo = yaml('./file.yaml')
```

Result:

```js
const foo = ['YAML file', { with: 'some contents' }];
```

## `yaml(path: string, options?: {}): any`

Relative `path` values should start with `.`. Internally, the macro uses [`yaml`](https://www.npmjs.com/package/yaml) and supports its [parser `options`](https://eemeli.org/yaml/#options) as a second argument. As the macro arguments are [evaluated](https://github.com/babel/babel/blob/master/packages/babel-traverse/src/path/evaluation.js) at build time, they should not be dynamically modified by preceding code.

Multiple calls to load the same YAML file will not be cached.
