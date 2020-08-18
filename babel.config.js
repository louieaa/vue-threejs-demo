/*
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-11 17:32:06
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-11 17:41:15
 */
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ]
}
