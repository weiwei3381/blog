# Electron笔记

## 安装依赖

推荐使用[DevSider](https://gitee.com/docmirror/dev-sidecar)打开npm代理，如下图所示。

![DevSider](https://ftp.bmp.ovh/imgs/2021/11/9a5ea434df6cf85b.png)

然后在npm中使用`npm install cnpm -g`全局安装cnpm，然后利用cnpm安装依赖，其中`remote`从V14版本开始需要额外安装，参见[Electron变更](https://www.electronjs.org/docs/latest/breaking-changes)

```batch
<!-- 安装electron -->
cnpm install electron -S

<!-- 安装remote库，从V14版本开始，需要独立安装 -->
cnpm install @electron/remote -S

<!-- 安装electron对应的sqlite版本，其中target后面跟的electron版本号要跟安装的electron版本一致 -->
cnpm install sqlite3@latest --build-from-source --runtime=electron --target=15.3.0 --dist-url=https://atom.io/download/electron --save

<!-- 安装react -->
cnpm install react -S

<!-- 安装react相关依赖 -->
cnpm install react-router react-router-dom react-dom -D
```

