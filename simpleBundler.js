const detective = require('detective')
const resolve = require('resolve').sync
const fs = require('fs')
const path = require('path')

let ID = 0
function createModuleObject(filepath) {
  const source = fs.readFileSync(filepath, 'utf-8')
  const requires = detective(source)
  const id = ID++

  return { id, filepath, source, requires }
}

function getModules(entry) {
  const rootModule = createModuleObject(entry)
  const modules = [rootModule]

  for (const module of modules) {
    module.map = {}

    module.requires.forEach(dependency => {
      const basedir = path.dirname(module.filepath)
      const dependencyPath = resolve(dependency, { basedir })

      const dependencyObject = createModuleObject(dependencyPath)

      module.map[dependency] = dependencyObject.id
      modules.push(dependencyObject)
    })
  }
  console.dir(modules)
  return modules
}

function pack(modules) {
  const modulesSource = modules.map(module => 
    `${module.id}: {
      factory: (module, require) => {
        ${module.source}
      },
      map: ${JSON.stringify(module.map)}
    }`
  ).join()

  return `(modules => {
    const require = id => {
      const { factory, map } = modules[id]
      const localRequire = name => require(map[name])
      const module = { exports: {} }

      factory(module, localRequire)

      return module.exports
    }

    require(0)
  })({ ${modulesSource} })`
}

module.exports = entry => pack(getModules(entry))
