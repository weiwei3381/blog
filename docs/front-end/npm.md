# npm中常用命令与模块

## npm常用命令

### 配置命令

```shell
# 查看registry
npm config get registry

# 修改为淘宝镜像
npm config set registry http://registry.npm.taobao.org

# 修改为本地Nexus服务器镜像
npm config set registry http://localhost:8081/repository/npm-proxy/

# 修改为原始镜像
npm config set registry http://registry.npmjs.org

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

### 模块命令

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

### 查看路径

```shell
# 查看npm安装路径
npm get prefix

# 查看全局node包路径
npm root -g

# npm清理缓存
npm cache clean -f
```

### 运行脚本

```shell
# 运行package.json中[Scripts]属性中的脚本
npm run <脚本名称>
```

## npm常用模块

### 命令行参数解析模块

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