/*
 * @Description: 
 * @Author: louiebb
 * @Date: 2020-08-11 18:46:16
 * @LastEditors: loueibb
 * @LastEditTime: 2020-08-24 15:41:01
 */
module.exports = {
  publicPath:"./",  // 可以设置成相对路径，这样所有的资源都会被链接为相对路径，打出来的包可以被部署在任意路径
  outputDir:"dist",  //打包时生成的生产环境构建文件的目录
  assetsDir: 'public',  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
  configureWebpack: {
    resolve: {
      symlinks: true,
    }
  },
  runtimeCompiler:true,
  devServer: {
    hot: true,
    proxy: {
      '/server':{
        target: 'http://127.0.0.1:8081/', // API服务器的地址
        ws: true,
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/server': ''
        }
      },
      '/api': {
        target: 'https://qhyxpicoss.kujiale.com/', // API服务器的地址
        ws: true,
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
};
  
