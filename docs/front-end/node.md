# Node.js深入浅出

## npm中常用命令与模块

### npm常用命令

#### 配置命令

```shell
# 查看registry
npm config get registry

# 修改为淘宝镜像
npm config set registry https://registry.npmmirror.com

# 修改为本地Nexus服务器镜像
npm config set registry http://localhost:8081/repository/npm-proxy/

# 修改为原始镜像
npm config set registry https://registry.npmjs.org

# 查看所有配置
npm config list
npm config list --json  # 以json方式查看

# 完整版语法
npm config set <key> <value> [-g|--global]
npm config get <key>
npm config delete <key>
npm config list
npm config edit
npm get <key>
npm set <key> <value> [-g|--global]
```

#### 模块命令

```shell
# 初始化package.json
npm init [-f|--force|-y|--yes]

# 安装模块
npm install  # 不加任何参数则安装package.json中所有依赖包
npm install [<@scope>/]<name>
npm install [<@scope>/]<name>@<tag>
npm install [<@scope>/]<name>@<version>
npm install [<@scope>/]<name>@<version range>
npm install <tarball file>
npm install <tarball url>
npm install <folder>
# 别名
npm i
# 可选配置
[-S|--save|-D|--save-dev|-O|--save-optional] [-E|--save-exact] [--dry-run]

# 卸载模块
npm uninstall [<@scope>/]<pkg>[@<version>]... [-S|--save|-D|--save-dev|-O|--save-optional]

# 更新模块
npm update [-g] [<pkg>...]

# 查看已安装模块
npm list  # 查看当前目录下安装模块
npm list -g # 查看全局安装模块
npm list --depth=0  # 限制查看层级为0
# 别名
npm ls

# 查看模块版本
npm version

```

#### 查看路径

```shell
# 查看npm安装路径
npm get prefix

# 查看全局node包路径
npm root -g

# npm清理缓存
npm cache clean -f
```

#### 运行脚本

```shell
# 运行package.json中[Scripts]属性中的脚本
npm run <脚本名称>
```

### npm常用模块

#### 命令行参数解析模块

模块[optimist](https://www.npmjs.com/package/optimist)可以方便的解析命令行传入的参数，不过目前已经==弃用==，使用方法如下：

```js
var argv = require('optimist').argv;
 
if (argv.rif - 5 * argv.xup > 7.138) {
    console.log('Buy more riffiwobbles');
}
else {
    console.log('Sell the xupptumblers');
}
```

命令行参数传入：

```batch
$ ./xup.js --rif=55 --xup=9.52
Buy more riffiwobbles

$ ./xup.js --rif 12 --xup 8.1
Sell the xupptumblers
```

### npm安装时碰到的问题

#### 安装Electron失败的解决方案

方法1：尝试打开项目的`\node_modules\electron`目录，然后运行`node install.js`，看能否安装成功，如果安装不成功，一般是下载文件出现问题，如下图所示。

通过查看`package.json`，确定`electron`的版本，然后在[淘宝electron镜像站](https://npm.taobao.org/mirrors/electron/)下载对应的zip文件，例如`electron-v14.0.0-win32-x64.zip`，将其复制到项目的`\node_modules\electron`目录，然后把`install.js`改为下面代码：

```js
#!/usr/bin/env node

const version = require('./package').version
const fs = require('fs')
const os = require('os')
const path = require('path')
const extract = require('extract-zip')
const platformPath = 'electron.exe'
const zipPath = "./electron-v14.0.0-win32-x64.zip"
extractFile (zipPath)
// unzips and makes path.txt point at the correct executable
function extractFile (zipPath) {
extract(zipPath, { dir: path.join(__dirname, 'dist') }, function (err) {
if (err) return onerror(err)
fs.writeFile(path.join(__dirname, 'path.txt'), platformPath, function (err) {
if (err) return onerror(err)
})
})
}
```

然后再运行`node install.js`即可。

## 使用volta管理不同node版本

[Volta](https://github.com/volta-cli/volta)是一站式的JavaScript管理工具，在github上开源。

:::warning 注意
安装volta时，需要把其他node管理器(nvm)卸载掉，同时node环境卸载干净
:::

### 安装volta

在volta主页的[releases](https://github.com/volta-cli/volta/releases)页面中下载最新的Windows版本，双击安装，自用1.1.1版本[分流地址](https://wwl.lanzoum.com/iWKUA1qxg5na)。

安装完成后，在Windows的设置页面启用[开发者选项](https://link.juejin.cn/?target=https%3A%2F%2Flearn.microsoft.com%2Fzh-cn%2Fwindows%2Fapps%2Fget-started%2Fenable-your-device-for-development%23accessing-settings-for-developers)，如下图所示：

![启用开发者选项](https://pic.imgdb.cn/item/65ecfd749f345e8d03cd3be0.jpg)

安装完成后使用`volta -v`命令可查看当前volta版本。

### volta常用命令

0.常用命令一览

```shell
volta list # 查看当前环境的版本
volta list all # 查看存在的所有版本

volta install node # 安装最新版的nodejs
volta install node@12.2.0 # 安装指定版本
volta install node@12 # volta将选择合适的版本安装

volta uninstall node # 删除已安装的全局包

volta pin node@10.15 # 将更新项目的package.json文件以使用工具的选定版本
volta pin yarn@1.14 # 将更新项目的package.json文件以使用工具的选定版本
```

1.安装并切换node版本

```shell
volta install node@14.15.5 # 安装并切换到指定的node版本
volta install node@14  # 安装并切换到合适的14版本
volta install node  # 安装并切换到最新的 LTS 版本

volta uninstall node@14 # 卸载指定的版本
```

2.安装yarn，npm和pnpm

```shell
volta install npm  # 安装最新稳定版本的npm
volta install npm@8.3.0  # 安装8.3.0版本的npm，对应node14.20.1版本
volta install yarn  # 安装最新稳定版本的yarn
volta install pnpm  # 安装最新稳定版本的pnpm
```

不同node对应的npm版本可以在[官方网站](https://nodejs.org/en/about/previous-releases)上查询到，版本如下图所示：

![不同node对应的npm版本](https://pic.imgdb.cn/item/65ed01a19f345e8d03dacb20.jpg)

3.下载不给力的解决方案

进入node安装包的官方下载[地址](https://registry.npmmirror.com/binary.html?path=node/)，下载指定的**win-x64.zip**版本压缩包，例如node14.20.1版本的压缩包即为[node-v14.20.1-win-x64.zip](https://registry.npmmirror.com/-/binary/node/latest-v14.x/node-v14.20.1-win-x64.zip)，下载完毕后，将其放到“C:\Users\【用户名】\AppData\Local\Volta\tools\inventory\node”，然后再使用`vlota install node@14.20.1`进行安装。

4.不同项目的无缝切换

我们有了多个版本的node，就可以到项目中进行对应的设置了。比如我们vuepress的项目需要14版本的node，前往项目目录执行命令`volta pin node@14.20.1`，此时我们的项目package.json中会多一个配置：

```json
"volta": {
  "node": "14.5.0"
}
```

类似的，也可固定npm版本，执行命令`volta pin npm@8.3.0`，此时我们的项目package.json的volta栏中会多一个配置：

```json
"volta": {
    "node": "14.20.1",
    "npm": "8.3.0"
  }
```

设置好之后，再执行`npm install`或者`npm start`就会自动用指定的node和npm版本。
