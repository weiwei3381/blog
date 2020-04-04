# VS Code 常用操作

> [vistual studio code](https://code.visualstudio.com/)

## 配置不自动更新

[文件]->[首选项]->[设置], 进入设置页面, 搜索"update", 将**Update: Enable Windows Background Updates**(windows 后台更新)设为`false`, 将**Update: Mode**(更新模式)设置为`none`.

## 配置连字

下载并安装[FiraCode 字体](https://github.com/tonsky/FiraCode/releases), 在[设置]中搜索"font", 配置**Editor: Font Family**(编辑器字体)设为`Fira Code, Consolas, Microsoft YaHei`, **editor.fontLigatures**(编辑器连字)设为`true`. 用户配置在`C:\Users\${用户名}\AppData\Roaming\Code\User`下的`settings.json`文件中, 典型项如下:

```json
{
  "update.mode": "none",
  "workbench.iconTheme": "material-icon-theme",
  "editor.minimap.enabled": false,
  "editor.renderWhitespace": "none",
  "editor.fontFamily": "Fira Code, Consolas, Microsoft YaHei",
  "editor.fontLigatures": true,
  "workbench.colorTheme": "Visual Studio Dark",
  "update.enableWindowsBackgroundUpdates": false
}
```

## 常用快捷键

1. 放大缩小整个编辑器, 默认快捷键是`ctrl`+`=`和`ctrl`+`-`
2. 显示命令窗口: `ctrl`+`shift`+`p`
3. 快速打开文件: `ctrl`+`shift`+`p`
4. 进入设置页面: `ctrl` + `,`, (搜狗输入法默认切换跟该快捷键冲突, 建议进入搜狗输入法的`输入法管理`页面, 建议修改为`ctrl`+`backspace`)
   ![搜狗输入法默认快捷键](https://s1.ax1x.com/2020/04/05/GBp4VP.png)

## 快捷键配置

因为之前一直使用 eclipse, 惯用的快捷键设置如下, 替换`C:\Users\${用户名}\AppData\Roaming\Code\User`下的`keybindings.json`文件内容.

```json
[
  // 删除整行 ctrl+d
  {
    "key": "ctrl+d",
    "command": "editor.action.deleteLines",
    "when": "editorTextFocus && !editorReadonly"
  },
  // 向上复制行 ctrl+alt+up
  {
    "key": "ctrl+alt+up",
    "command": "editor.action.copyLinesUpAction",
    "when": "editorTextFocus && !editorReadonly"
  },
  // 向下复制行 ctrl+alt+down
  {
    "key": "ctrl+alt+down",
    "command": "editor.action.copyLinesDownAction",
    "when": "editorTextFocus && !editorReadonly"
  },
  // 上一个编辑点 ctrl+q
  {
    "key": "ctrl+q",
    "command": "editor.emmet.action.prevEditPoint"
  },
  // 向下换行 shift+enter
  {
    "key": "shift+enter",
    "command": "editor.action.insertLineAfter",
    "when": "editorTextFocus && !editorReadonly"
  },
  // 格式化选中文本 ctrl+alt+l
  {
    "key": "ctrl+alt+l",
    "command": "editor.action.formatSelection",
    "when": "editorHasSelection && editorTextFocus && !editorReadonly"
  },
  // 向下增加光标 shift+alt+down
  {
    "key": "shift+alt+down",
    "command": "editor.action.insertCursorBelow",
    "when": "editorTextFocus"
  },
  // 向上增加光标 shift+alt+up
  {
    "key": "shift+alt+up",
    "command": "editor.action.insertCursorAbove",
    "when": "editorTextFocus"
  },
  // 给下一个选中变量增加光标 ctrl+e
  {
    "key": "ctrl+e",
    "command": "editor.action.addSelectionToNextFindMatch",
    "when": "editorFocus"
  },
  // 代码智能提醒 alt+/
  {
    "key": "alt+oem_2",
    "command": "editor.action.triggerSuggest",
    "when": "editorHasCompletionItemProvider && editorTextFocus && !editorReadonly"
  },
  // 运行任务,crtl+shift+B
  {
    "key": "ctrl+shift+b",
    "command": "workbench.action.tasks.runTask"
  },
  {
    "key": "f5",
    "command": "-extension.run",
    "when": "editorTextFocus"
  }
]
```

### vscode 的 markdown 增强

1. `markdown ALL in One`安装后使用默认配置就可以, 提供了自动完成和预览功能, 快捷键列表如下:
   ![Markdown All in One快捷键一览表](http://s1.ax1x.com/2020/03/26/8xX4KJ.jpg)

## ts 实战中的部分设置

(1) **默认使用单引号**: 在设置中搜索`quote`, 在`Quote Style`中选择`single`.
(2) **代码缩进为 2 个空格**: 在设置中搜索`tab`, 在`Tab Size`中设置为`2`.
(3) **代码自动格式化**: 在扩展中搜索并安装`prettier`, 在设置中搜索`format on save`, 启用后保存文件会自动格式化代码.
![prettier图标](https://s1.ax1x.com/2020/04/04/G0uHyV.png)
(4) **大纲按照文件位置进行排序**: 大纲默认按照"类别"进行排序, 可点击[大纲]左侧的`...`("更多操作"), 选择"排序依据: 位置"即可.
![vscode大纲排序](https://s1.ax1x.com/2020/04/05/GB9XSe.png)
(5) **在 js 中启用 emmet**: 在设置中查找`Exclude Languages`, 修改`setting.json`文件, 增加`"emmet.includeLanguages": { "javascript": "javascriptreact" }`
