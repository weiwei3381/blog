# 学习Typescript实战开发

## 安装依赖

1. 本地项目安装Typescript和ts-node，使用`npm install typescript ts-node -D`进行安装

2. 在package脚本中的"dev"中写上"ts-node ./src/[需要运行的ts文件]"

   :::warning

   如果是全局安装Typescript, 则ts-node命令会报错

   :::  

3. 安装superagent爬取数据, `npm install superagent`, 由于ts直接饮用js模块会不知道模块的属性和方法, 因此IDE中也无法联想出来. 为了解决这个问题, typescript中采用了`.d.ts`为扩展名的扩展文件(*也可以理解成翻译文件*)进行处理. 可以试图使用`npm install @types/superagent`来安装扩展文件(*在vscode中, 把鼠标放到引用的包上去也会有提示*), 一般如果存在d.ts文件, 都是以`@types/[包名称]`进行存储
