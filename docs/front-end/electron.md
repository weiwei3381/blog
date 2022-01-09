# electron实战

## electron编译

> 参考资料:[electron 集成 addon 方案简介](https://zhuanlan.zhihu.com/p/141450682), [github:electron-rebuild](https://github.com/electron/electron-rebuild), [github:node-gyp](https://github.com/nodejs/node-gyp#on-windows), [electron和node版本不匹配的解决细节](https://blog.csdn.net/qq_33583069/article/details/107379816), [Electron打包Node程序：NODE_MODULE_VERSION值不一致引发的问题](https://www.cnblogs.com/mdorg/p/10417945.html),[Electron打包Node程序：怎么获取electron、node的abi以及指导abi获取版本](https://www.cnblogs.com/mdorg/p/10419506.html), [Electron和Node版本对应关系](https://crifan.github.io/desktop_app_framework_electron/website/summary_note/node/electron_node_versions.html), [npm-electron-releases](https://www.npmjs.com/package/electron-releases)

由于不同版本的 electron 内嵌了不同的 Chromium; 不同的 Chromium 又带了不同的 node 版本. 也就是说 electron 内置的 node 版本和我们开发机上的 node 并不是同一个版本. 当你在 yarn 编译 addon 时,node-gyp 是按照本地 node 版本去编译 addon 的. 我们期望 node-gyp 按照 electron 里面的 node 版本重新编译. 此时你需要 electron-rebuild. 这个库的作用就是读取你安装的 electron 版本, 然后按照其内置的 node 版本调用 node-gyp 编译 addon.

### electron-rebuild的作用

[Electron Rebuild](https://github.com/electron/electron-rebuild)项目介绍原文如下. 

> This executable rebuilds native Node.js modules against the version of Node.js that your Electron project is using. This allows you to use native Node.js modules in Electron apps without your system version of Node.js matching exactly (which is often not the case, and sometimes not even possible).

此可执行文件根据您的 Electron 项目正在使用的 Node.js 版本重建原生 Node.js 模块。这允许您在 Electron 应用程序中使用原生 Node.js 模块，而无需您的 Node.js 系统版本完全匹配（通常情况并非如此，有时甚至不可能）。

用法也很简单, 确保Node版本大于v12.13.0, 然后使用命令`npm install --save-dev electron-rebuild`安装模块.

以后, 每次在electron中新装了一个npm包, 则运行electron-rebuild, 其中windows上的运行命令如下:`.\node_modules\.bin\electron-rebuild.cmd`, 它就会根据electron中使用Node版本编译文件, 能够正确编译的前提是安装好[node-gyp](https://github.com/nodejs/node-gyp#on-windows).

### 安装node-gyp

根据[node-gyp](https://github.com/nodejs/node-gyp#on-windows)中的介绍.

> node-gyp is a cross-platform command-line tool written in Node.js for compiling native addon modules for Node.js. It contains a vendored copy of the gyp-next project that was previously used by the Chromium team, extended to support the development of Node.js native addons.

简单翻译一下: `node-gyp`是一个用 Node.js 编写的跨平台命令行工具，用于为 Node.js 编译本机插件模块。它包含Chromium 团队以前使用的 gyp-next项目的供应商副本，经过扩展以支持 Node.js 原生插件的开发。

安装流程比较繁琐, 可以参考[nodejs-guidelines](https://github.com/Microsoft/nodejs-guidelines/blob/master/windows-environment.md#compiling-native-addon-modules).

第一步, 全局安装node-gyp, `npm install -g node-gyp`. 有博客说需要确保node.js是32位版本, 但是亲测发现本机如果是64位的windows系统, 那么安装的Visual Studio 2017在编译时会自动选择64位进行编译, 此时编译后的64位c++代码是无法在32位node.js中运行的, 会报`库计算机类型“x64”与目标计算机类型“x86”冲突`错误, 所以本机是64位windows, 则**直接装64位node.js版本**即可.

第二步, 确保windows系统中安装了Python2.7环境(Python 3.x.x不支持😢), 设置npm配置项`npm config set python C:\Python27\python.exe`, 可以在系统中查看所有环境变量`npm config list`确保没有问题, 然后安装[Visual Studio 2017 Community](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=Community), 选择"Visual C++ build tools"工作台, 大概需要下载2-3G的文件, 占用空间6GB左右, 可以安装到D盘.

第三步, 登录cmd, 运行`npm config set msvs_version 2017`, 其中`msvs_version`是Microsoft Visual Studio Version的简称, `2017`是Visual Studio的版本, 如果安装的是Visual Studio 2019, 则这个命令应该改为`npm config set msvs_version 2019`.

第四步, 由于网络稳定, 因此在编译时需要下载`node.lib`和`node-v14.16.0-headers.tar.gz`文件不一定能成功, 建议提前将这两个文件下载好后设置离线安装模式, 首先从网上下载`https://nodejs.org/download/release/v14.16.0/node-v14.16.0-headers.tar.gz`和`https://nodejs.org/download/release/v14.16.0/win-x64/node.lib`, 这里下载的是v14.16.0, 如果node.js版本是其他的, 则直接改网址url即可.

下载完毕后,在D盘根目录新建文件夹`nodeDir`, 将`node-v14.16.0-headers.tar.gz`解压的`include`文件夹复制到`D:\nodeDir\`目录中去, 然后在`nodeDir`文件夹中新建`Release`文件夹, 将下载的node.lib复制到 `Release` 文件夹中, 目录层级如下所示

```python
nodeDir
 ├── include
 │   └── node
 └── Release
     └── node.lib
```

然后执行`npm config set nodedir D:\nodeDir\`, 这样node-gyp在构建时就不会在网上下载文件了.

第五步, 在使用electron-build命令的时候, 最好是在windows powershell中进行, 将字符编码改为`chcp 65001`, 这样能显示中文错误信息.

如果觉得上面过程比较繁琐🙃, 也可以直接使用提升的 PowerShell（以管理员身份运行）运行，使用 Microsoft 的windows-build-tools安装所有必需的工具和配置npm install -g windows-build-tools, 但是2022年1月我试过, ==并没有成功== , 所以最好还是按照上面的步骤进行设置.

### 确保Node版本与Electron版本一致

NODE_MODULE_VERSION 指的是 Node.js 的 ABI (application binary interface) 版本号，用来确定编译 Node.js 的 C++ 库版本，以确定是否可以直接加载而不需重新编译。在早期版本中其作为一位十六进制值来储存，而现在表示为一个整数。

node.js的ABI可以到[官网](https://nodejs.org/zh-cn/download/releases/)上进行查询, 而electron的ABI可以到electron的github release[网址](https://github.com/electron/releases)上进行查询, 但是很遗憾, 基本上electron编译的版本与node.js发布的版本ABI均不同, 所以在electron中还需要重新编译.

### 打包sqlite3, nodejieba和levelDB等C++原生库

前提条件: 安装完成node-gyp

第一步, 在package.json中不要加sqlite3, nodejieba和level的依赖, 然后用`yarn`或者`npm install`安装其他的依赖

第二步, 根据electron的版本不同,例如electron版本为`13.6.6`时, 使用命令: `yarn add nodejieba sqlite3 level --build-from-source --runtime=electron --target=13.6.6 --dist-url=https://atom.io/download/electron` 安装对应electron版本的软件包`nodejieba sqlite3 level`.

第三步, *可选项*, 使用`yarn add electron-rebuild aws-sdk`安装aws-sdk和electron-rebuild, 然后利用`electron-rebuild -f -w sqlite3`来验证`sqlite3`有没有安装成功, 其他的类似.

:::tip
在使用`electron-builder`打包时, nodejieba模块一直出现能调试, 但是一旦打包成exe程序, 就无法运行的情况, 最后探索了几天找到了一个解决方案, 就是在`package.json`的`build`中, 设置`"asar": false, "asarUnpack": "**\\*.{node,dll}",`, 即**不使用asar打包**, 这样打包出来的exe程序在安装后会带原有的`node_modules`文件, `nodejieba`模块就能正常运行了, 弊端在于打包和安装的速度会变慢, 不过好过没法运行.
:::

打包成功的package.json的示例如下:

```json
{
    "name": "tasky",
    "version": "1.0.0",
    "description": "This is a task management app",
    "main": "index.js",
    "scripts": {
        "dev": "electron .",
        "start": "nodemon --watch index.js --exec electron .",
        "build-icon": "electron-icon-builder --input=./public/icon.png --output=build --flatten",
        "postinstall": "electron-builder install-app-deps",
        "pack": "electron-builder --dir",
        "dist": "electron-builder",
        "release": "cross-env GH_TOKEN=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 electron-builder",
        "rebuild:sql": "electron-rebuild -f -w sqlite3",
        "rebuild:nodejieba": "electron-rebuild -f -w nodejieba"
    },
    "build": {
        "appId": "this.is.tasky",
        "productName": "Tasky",
        "asar": false,
        "asarUnpack": "**\\*.{node,dll}",
        "copyright": "Copyright © 2021 Alaso",
        "directories": {
            "buildResources": "build"
        },
        "win": {
            "target": [
                "nsis"
            ],
            "icon": "build/icons/icon.ico"
        },
        "nsis": {
            "oneClick": false,
            "language": "2052",
            "perMachine": true,
            "allowToChangeInstallationDirectory": true
        }
    },
    "keywords": [],
    "author": "Alaso",
    "license": "ISC",
    "bugs": {
        "url": "https://github.com/alasolala/tasky/issues"
    },
    "homepage": "https://github.com/alasolala/tasky#readme",
    "dependencies": {
        "aws-sdk": "^2.1052.0",
        "electron-updater": "^4.3.9",
        "level": "^7.0.1",
        "nodejieba": "^2.5.2",
        "sqlite3": "^5.0.2"
    },
    "devDependencies": {
        "cross-env": "^7.0.3",
        "electron": "^13.6.6",
        "electron-builder": "^22.14.5",
        "electron-icon-builder": "^2.0.1",
        "electron-rebuild": "^3.2.5",
        "nodemon": "^2.0.7"
    }
}
```

在尝试过程中翻了不少车, 其中经常出现`a different Node.js version using NODE_MODULE_VERSION 83. This version of Node.js requires NODE_MODULE_VERSION 89. Please try re-compiling or re-installing`错误, 然后按照[官网](https://www.electronjs.org/docs/tutorial/using-native-node-modules)解决, 也没解决好. 按照`npm rebuild --runtime=electron --target=13.6.6 --disturl=https://atom.io/download/atom-shell --abi=89`重新编译指定abi, 但是打包之后还是出现错误, 总感觉打包使用的是缓存, 让人百思不得其解.
