# 搭建指南

> 本项目灵感来源于[Notes速查表](https://notes.itzkp.com/), 可以上[github项目页面](https://github.com/zhukunpenglinyutong/notes)查看源码, 感谢[朱昆鹏](https://github.com/zhukunpenglinyutong)同学.

1. 本项目部署在[github/blog](https://github.com/weiwei3381/blog)上, 提供自动部署脚本, 使用`git clone`命令后, 运行`npm install`即可安装相应依赖.
2. 更新并部署到github(默认), 则在终端运行`npm run deploy`即查看[github主页](https://weiwei3381.github.io/).  
3. 更新并部署到gitee(码云), 需要在`.vuepress\config.js`中增加一行`base:'/blogs/'`, 然后运行`npm run deploy:gitee`即自动部署,部署完毕后,需要手动登陆[myblogs配置页](https://gitee.com/weiwei3381/blogs/pages), 进行更新. 更新完毕后, 即可查看[gitee主页](http://weiwei3381.gitee.io/blogs/).  
4. 开发时, 使用命令`npm run dev`即可打开[开发服务器](http://localhost:8080/).
