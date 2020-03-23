# Babel详细学习

## 介绍

Babel是一个通用的多用途 JavaScript 编译器。通过 Babel 你可以使用（并创建）下一代的 JavaScript，以及下一代的 JavaScript 工具。

## 上手

### 安装

可以使用`npm install --global babel-cli`命令将Babel安装到全局, 但是并不推荐. 建议将Babel安装到项目本地, `npm install --save-dev babel-cli`

### 命令行使用

如果是全局安装, 可以直接在命令行中使用`babel my-file.js`, 这个命令会在命令行中显示编译的文件. 使用参数`--out-file`或者`-o` 可以将结果写入到指定的文件, 编译整个目录则使用参数`--out-dir`或者`-d`, 示例如下:

```javascript
babel example.js -o compiled.js
babel src -d lib
```

🌞tips: 采用本地安装模式, 不能直接在命令行使用, 必须在`package.json`中配置`scripts`命令, 例如`"build": "babel src -d lib"`, 然后在终端中使用`npm run build`进行编译.
