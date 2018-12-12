(modules => {
    const require = id => {
      const { factory, map } = modules[id]
      const localRequire = name => require(map[name])
      const module = { exports: {} }

      factory(module, localRequire)

      return module.exports
    }

    require(0)
  })({ 0: {
      factory: (module, require) => {
        const log = require('./log')
const util = require('./utils')

log(util.sayHello('Tom'))

      },
      map: {"./log":1,"./utils":2}
    },1: {
      factory: (module, require) => {
        module.exports = (info) => console.log(info)
      },
      map: {}
    },2: {
      factory: (module, require) => {
        module.exports = {
    sayHello: (text) => `${text}, hello world`
}
      },
      map: {}
    } })