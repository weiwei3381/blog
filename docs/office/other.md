# 常用问题处理

## potplayer 播放时, 声音有回音

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

## 一次批量启动多个程序

1. 使用批处理命令：`start /d "程序所在路径" 程序名称.exe`，启动对应的软件。
2. 新建`bat`文件，写多条语句，同时启动多个程序

```bat
:: 启动复制翻译软件
start /d "C:\Users\weiwe\AppData\Local\Programs\copytranslator\" copytranslator.exe
:: 启动VScode
start /d "C:\Users\weiwe\AppData\Local\Programs\Microsoft VS Code\" Code.exe
:: 启动pdf阅读器
start /d "D:\Program Files (x86)\Zeon\Gaaiho\Gaaiho Reader\bin\" GaaihoReader.exe
:: 启动词典软件
start /d "D:\Program Files\MDictPC\" MDict.exe
```

3.双击该bat文件，即可批量启动多个程序。
4.也可以使用批处理命令判断程序是否已经运行，例如判断vscode是否运行的代码如下：

```bat
tasklist /nh|find /i "Code.exe"
if ERRORLEVEL 1 (echo Code.exe not exist) else (echo Code.exe exists)
```

因此，可以修改bat文件，使得它先判断该组程序是否运行，如果没有运行则进行运行。含有4个程序的示例代码如下：

```bat
%echo off

:: 启动复制翻译软件
tasklist /nh|find /i "copytranslator.exe"
if ERRORLEVEL 1 (start /d "C:\Users\weiwe\AppData\Local\Programs\copytranslator\" copytranslator.exe) else (echo copytranslator.exe exist)

:: 启动VScode
tasklist /nh|find /i "Code.exe"
if ERRORLEVEL 1 (start /d "C:\Users\weiwe\AppData\Local\Programs\Microsoft VS Code\" Code.exe) else (echo Code.exe exist)

:: 启动pdf阅读器
tasklist /nh|find /i "GaaihoReader.exe"
if ERRORLEVEL 1 (start /d "D:\Program Files (x86)\Zeon\Gaaiho\Gaaiho Reader\bin\" GaaihoReader.exe) else (echo GaaihoReader.exe exist)

:: 启动词典软件
tasklist /nh|find /i "MDict.exe"
if ERRORLEVEL 1 (start /d "D:\Program Files\MDictPC\" MDict.exe) else (echo MDict.exe exist)

pause
```

## windows保存窗口布局

下载windows布局管理器（[Windows Layout Manager](https://wws.lanzous.com/i8RKsgja5bg)），解压后运行即可。

**1. 捕获布局**，进入软件之后，使用`capture`按钮可以捕获当前布局，然后删除不需要布局的软件，如下图所示。

![wtHC40.png](https://s1.ax1x.com/2020/09/11/wtHC40.png)

**2. 修改布局**，默认的布局文件会使用windows title属性，而一般软件该值一般都是变动的，所以需要把这个选项去掉；另外在actions中，默认是`none of above`，而我们一般是最小化或者恢复，所以需要修改为`restore`或者`minimize`，例如pdf阅读器的位置设置如下：

![wtHB28.png](https://s1.ax1x.com/2020/09/11/wtHB28.png)

**3. 测试布局**，使用[test]按钮可以测试刚刚的界面是否达到效果，如果没有问题就可以设置快捷键了。

**4. 设置快捷键**，我们可以给常用的布局设置快捷键，常用的设置为`win`+`shift`+`Q`，多个布局可以用`Q`，`W`，`E`。

:::tip 取消恢复对话框
每次调整页面，会弹出确认窗口，如果不需要显示，则可以将其关闭掉，在`Options`->`Configuration`中取消`Layout Restoration Dialog`下面的勾选即可。
:::
