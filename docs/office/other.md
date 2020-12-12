# 高效办公

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

```batch
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

```batch
tasklist /nh|find /i "Code.exe"
if ERRORLEVEL 1 (echo Code.exe not exist) else (echo Code.exe exists)
```

因此，可以修改bat文件，使得它先判断该组程序是否运行，如果没有运行则进行运行。含有4个程序的示例代码如下：

```batch
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

## 使用youtube-dl下载网页动画

可以使用[youtube-dl](https://wws.lanzous.com/iH3hHjao7mh)下载网页视频，文件可以到[蓝奏云下载](https://wws.lanzous.com/iH3hHjao7mh)，下载完成后将解压得到的`youtube-dl.exe`放到单独的文件夹下，然后在cmd中运行即可，
使用方法很简单，在`youtube-dl.exe [视频网址]`即可，例如下载[【朱一旦】142 一块劳力士的回家路](https://www.bilibili.com/video/BV1P7411V7Ga)，则使用下面的命令

```batch
.\youtube-dl.exe https://www.bilibili.com/video/BV1P7411V7Ga
```

此时会显示下载情况:

![rVbEJH.png](https://s3.ax1x.com/2020/12/12/rVbEJH.png)

`youtube-dl`的其他常用命令还有：

```batch
[url] 下载对应url的视频
-o '名称' [url] 指定视频下载之后的名称
-h, --help 打印此帮助文本并退出
--version 打印程序版本并退出
-U, --update 将此程序更新为最新版本。
--list-extractors 列出所有支持的提取器
-F [url] 查看目标网址的视频版本
[url1] [url2] [url3] 一次下载多个不同的视频，用空格将多个URL分隔开
--format mp4 [url] 下载mp4格式视频(如果可用)
```

## 如何快速搜索信息

### site：搜索结果限定在某个网站中

我们经常需要把搜索的范围限定在某个特定的网站中，如果你已经知道某个网站中有自己需要的东西，那么在搜索的时候就可以把搜索范围限定在这个网站中，大大提升查询的效率，方法就是使用site搜索指令。搜索指令site的具体用法就是：`关键词+空格+site+英文冒号+搜索范围所限定的网站`。

**实例**，`新能源汽车 site:zhihu.com`表示知乎网站中搜索关于新能源汽车的信息。

::: tip 注意
网站前不用加http或者www。比如timepill.net。
:::

### filetype：搜索结果限定为某种文件类型

filetype这个命令在搜索专业文档资料时是非常好用的。具体用法就是：`关键词+空格+filetype+英文冒号+文件格式`。其中，文件格式可以填写pdf、ppt、doc、jpg等。

**实例**，`2018年考研英语真题 filetype:pdf`表示搜索2018年考研英语真题的pdf文档。

### “时间1..时间2”：限定搜索结果的时间范围

“时间1..时间2”这个搜索指令也非常重要，适用于某个特定时间范围内，关于某个关键词的信息搜索。具体用法为：`关键词+空格+20xx年+两个英文句号+20xx年`。

**实例**，`人工智能2018..2020`表示搜索2018年至2020年关于人工智能领域的资讯分析或者行业报告。

### intitle：限定搜索标题中包含的关键词

为了避免搜到许多零零散散相关度很低的内容，我们会使用intitle来提高搜索效率。当使用intitle指令时，在搜索返回的搜索结果中，网页标题栏要包含关键词，它的具体用法是：`关键词+空格+intitle+英文冒号+需要限定的关键词`。

**实例**，`intitle:指数报告`表示查找网址title中包含“指数报告”的网页。

### inurl：限定搜索结果的网址中包含的字段

inurl这个指令用于搜索关键词出现在URL中的页面，可以按英文字面意思理解。具体用法为：`关键词+空格+inurl:xxx（xxx可以为任意字符串）`，此命令是查找URL中包含xxx的网页。

**实例**，`小黑瓶 inurl:lancome`表示在搜索的网址里，一定要有lancome字段，这样能直接定位到兰蔻的官网。

### “-”减号的运用：搜索信息中不包含某些词

这个指令可以用来减掉一些自己不看的信息和网站。具体用法为：`搜索关键词+“-”+需要删除的关键词1+“-”+需要删除的关键词2`，此命令可以删除掉部分不相关的关键词。

**实例**，`注册会计师-广告-推广`，搜索关键词“注册会计师”，并去掉广告和推广链接。

上述6种技巧的总结如下:

![DJPIzR.png](https://s3.ax1x.com/2020/11/23/DJPIzR.png)

## 笔记记录方法

### 康奈尔笔记法

康奈尔笔记法，是一种适用于记录、阅读、复习、记忆，符合传统笔记使用场景的笔记方法。

![康纳尔笔记法](https://s3.ax1x.com/2020/11/23/DJPKaD.png)

康奈尔笔记把笔记本上的一页纸，用倒T格式分成了三部分，右上角部分划分出来的最大一块区域是笔记的主体部分，即*主栏*，用来记录听讲或者阅读过程中需要记录的关键信息；左边细长条的*副栏是思考部分*。顾名思义，这部分空间留出来，是为了将自己课后或者阅读之后的想法、问题、意见和体会之类的总结写下来；底下是*记忆栏*，主要用来在下课后尽早地将课程内容、概念等简明扼要地概括，并且编制成提纲、摘要或者策略。

康奈尔笔记结构包含了非常高效科学的学习流程，即重点记录、自主思考、及时总结、高效复习。

### 麦肯锡空雨伞笔记法

空雨伞笔记法是一种高效思考模型，适用于工作的场合，也就是需要快速决策的场景。放在笔记场景里就是，你了解到哪些信息？根据这些信息，你对事情的发展有什么判断？基于这些判断，你可以采取什么行动？

![空雨伞笔记法](https://s3.ax1x.com/2020/11/23/DJPYsP.png)

**实例**，当看到了关于深圳市近十年停止城中村改造拆迁的政府规划，在阅读的过程中，就可以把要点总结在空的部分，然后根据政策做出一个粗略的判断，比如，预判房价短期不会再暴涨。最后就是思考行动方向，也就是填写伞的部分，即自己应该怎么做。

### 便签条笔记

我们在阅读的同时，就可以对书的内容进行总结和思考。把要点和启发在便签条上记下来，贴在书的旁边，如果用ipad看电子书，可以采用`liquidText`进行操作。

种阅读方法的好处是，一个步骤实现了边阅读边吸收的效果。同时，插入的便签条可以不用翻开书，便能快速地定位书的内容，而且便签条容易撕掉、转移和组合，当我们多次阅读的时候，产生了新的想法和理解，还可以进行及时的更新。