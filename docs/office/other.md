# 常用问题处理

## potplayer 播放时, 声音有回音?

:bulb:：在播放器中点击右键, 选择[声音]=>[声音处理]=>[晶化], 取消[晶化]效果即可.
![potplayer回声处理](https://s1.ax1x.com/2020/04/03/GNpmkj.png)

## Windows 添加自定义右键菜单

### 打开注册表

`windows键 + R`打开运行窗口，输入`regedit` ，然后点击“确定”打开注册表。

### 找到 shell，然后新建项

依次展开`\HKEY_CLASSES_ROOT\*\shell`，在`shell`上点击右键->新建->项，命名为相关库名，例如`Decode`（**最好为全英文**），在`Decode`上点击右键->新建->项，命名为`command`。

右键命令主要`展示名称`、`展示图标`和`相关命令`三部分构成，这三部分都需要在注册表中进行定义，其中`展示名称`、`展示图标`都在`Decode`中进行定义，其中`(默认)`中定义`展示名称`，新建项`Icon`定义图标路径，而在`Decode\command`的`(默认)`中定义`打开命令`。

例如，VScode 的右键命令设置的注册表位置为`计算机\HKEY_CLASSES_ROOT\*\shell\VSCode`，相关设置内容为：

1. `展示名称`：通过 Code 打开
2. `展示图标`：C:\Users\weiwe\AppData\Local\Programs\Microsoft VS Code\Code.exe
3. `相关命令`："C:\Users\weiwe\AppData\Local\Programs\Microsoft VS Code\Code.exe" "%1"

名称和图标的设置如下：
![VScode右键菜单名称设置](https://s1.ax1x.com/2020/08/01/a8fRER.png)

命令的设置项如下：
![VScode右键命令设置](https://s1.ax1x.com/2020/08/01/a8fvPP.png)

:::tip 注意

1. 注册表项不区分大小写，项目名称`Icon`和`icon`没有区别。
2. Icon 的数据项可以是`.exe`结尾。
3. 设置内容的数据类型都是`字符串型`（`Reg_SZ`）。
4. 网上关于命令使用的值基本都没有加引号，但是建议像 VScode 一样把引号加上，尤其是`%1`的引号，否则目录有空格就会出问题。
   :::
