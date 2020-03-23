# VS Code常用操作

## 配置不自动更新

[文件]->[首选项]->[设置], 进入设置页面, 搜索"update", 将**Update: Enable Windows Background Updates**(windows后台更新)设为`false`, 将**Update: Mode**(更新模式)设置为`none`.

## 配置连字

下载并安装[FiraCode字体](https://github.com/tonsky/FiraCode/releases), 在[设置]中搜索"font", 配置**Editor: Font Family**(编辑器字体)设为`Fira Code, Consolas, Microsoft YaHei`, **editor.fontLigatures**(编辑器连字)设为`true`. 用户配置在`C:\Users\${用户名}\AppData\Roaming\Code\User`下的`settings.json`文件中, 典型项如下:

```json
{
    "update.mode": "none",
    "workbench.iconTheme": "material-icon-theme",
    "editor.minimap.enabled": false,
    "editor.renderWhitespace": "none",
    "editor.fontFamily": "Fira Code, Consolas, Microsoft YaHei",
    "editor.fontLigatures": true,
    "workbench.colorTheme": "Visual Studio Dark",
    "update.enableWindowsBackgroundUpdates": false,
}
```

## 快捷键配置

因为之前一直使用eclipse, 惯用的快捷键设置如下, 替换`C:\Users\${用户名}\AppData\Roaming\Code\User`下的`keybindings.json`文件内容.

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
