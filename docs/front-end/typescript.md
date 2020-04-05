# 学习 Typescript 实战开发

## vscode 配置

(1) **默认使用单引号**: 在设置中搜索`quote`, 在`Quote Style`中选择`single`.
(2) **代码缩进为 2 个空格**: 在设置中搜索`tab`, 在`Tab Size`中设置为`2`.
(3) **代码自动格式化**: 在扩展中搜索并安装`prettier`, 在设置中搜索`format on save`, 启用后保存文件会自动格式化代码.
![prettier图标](https://s1.ax1x.com/2020/04/04/G0uHyV.png)
(4) **在 node 环境直接运行 typescript**: 安装`ts-node`, 然后直接用`ts-node [待运行的ts文件]`就可以了.

## 安装依赖

(1) 本地项目安装 Typescript 和 ts-node，使用`npm install typescript ts-node -D`进行安装, 在项目中新建`tsconfig.json`文件进行 ts 项目初始化, 也可以输入`tsc --init`自动初始化生成配置文件, `tsconfig.json`文件的基本内容有:

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "strict": true,
    "forceConsistentCasingInFileNames": true
}
```

(2) 在 package 脚本中的"dev"中写上"ts-node ./src/[需要运行的 ts 文件]"

:::warning

如果是全局安装 Typescript, 则 ts-node 命令会报错

:::

(3) 安装 superagent 爬取数据, `npm install superagent`, 由于 ts 直接饮用 js 模块会不知道模块的属性和方法, 因此 IDE 中也无法联想出来. 为了解决这个问题, typescript 中采用了`.d.ts`为扩展名的扩展文件(_也可以理解成翻译文件_)进行处理. 可以试图使用`npm install @types/superagent`来安装扩展文件(_在 vscode 中, 把鼠标放到引用的包上去也会有提示_), 一般如果存在 d.ts 文件, 都是以`@types/[包名称]`进行存储.

安装[cheerio](https://github.com/cheeriojs/cheerio)进行 html 文件解析, `npm install cheerio --save`, 并安装相应的`d.ts`文件, `npm install @types/cheerio -D`. `cheerio`用法很简单, 可以按照以前`jquery`的写法来找到对象, 示例代码如下:

```js
const cheerio = require('cheerio') // 导入cheerio包
const $ = cheerio.load('<h2 class="title">Hello world</h2>') // 加载html内容, 赋值给$变量
// 利用$进行查找
$('h2.title').text('Hello there!')
$('h2').addClass('welcome')
// 显示html内容
$.html()
```

## 在 react 项目中使用 Typescript

使用 Typescript 模板安装 react: `npx create-react-app my-app --template typescript --use-npm`, 命令的意思是: 下载最新的 `create-react-app`,并且使用`Typescript`作为模板, 创建`my-app`的文件夹, 创建完毕后, 使用`npm`进行安装.

使用类型断言`!`手动排除`null`和`undifined`, 例如将`frame`改为`frame!`即可.
