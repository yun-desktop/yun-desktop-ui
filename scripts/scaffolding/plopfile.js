const fs = require('fs')

const componentNameList = fs.readdirSync('./src/components')

/**
 * 获取驼峰组件名称
 * @param {string} name 原始组件名 
 * @returns 驼峰组件名称
 */
function getCamelName(name) {
  const capitalLetterString = name.slice( 0, 1).toLocaleUpperCase() + name.slice( 1)
  const camelString = capitalLetterString.replace(/-(.)/, ($1) => $1[1].toUpperCase())
  return camelString
}

/**
 * 获取Y前缀的驼峰组件名称
 * @param {string} name 原始组件名
 * @returns Y前缀的驼峰组件名称
 */
 function getCamelNameWithPrefix( name ) {
  return 'Y' + getCamelName(name)
}


module.exports = plop => {
  /** 生成一个新的组件 */
  plop.setGenerator('component', {
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: '请输入组件名: '
      }
    ],
    actions: data => {
      return [
        // 单个组件入口文件
        {
          type: 'add',
          path: '../../src/components/{{name}}/index.js',
          data() {
            data.name = data.name.toLocaleLowerCase()
            data.yCamelName = getCamelNameWithPrefix(data.name)
            return data
          },
          templateFile: './plop-templates/component/index.js.hbs',
          skip(answers) {
            if(!answers.name) return '只更新入口文件'
            if(componentNameList.includes(answers.name)) throw new Error(`组件已存在: ${answers.name}`)
          }
        },
        // 组件.vue文件
        {
          type: 'add',
          path: '../../src/components/{{name}}/src/{{name}}.vue',
          templateFile: './plop-templates/component/src/component.vue.hbs',
          skip(answers) {
            if(!answers.name) return '只更新入口文件'
          }
        },
        // 修改入口文件
        {
          type: 'add',
          path: '../../src/main.js',
          data() {
            if(data.name) componentNameList.push(data.name)
            data.componentNameList = componentNameList.map(name => {
                                                            return {
                                                              yCamelName: getCamelNameWithPrefix(name),
                                                              name: name,
                                                              camelName: getCamelName(name)
                                                            }
                                                          })
            return data
          },
          force: true,
          templateFile: './plop-templates/enter.js.hbs'
        }
      ]
    }
  })
}