# 快速笔记

> 未分类笔记，主要用来记录一些想法。

## 英文专业书籍搜索（libgen）

使用[libgen](https://libgen.is/search.php)可以搜索很多英文专业书，最近的military balance 2021就是在这上面找到的。

![military balance搜索](https://pic.imgdb.cn/item/61227fff44eaada739faa3d8.jpg)

## 移动硬盘情况

### 2TB<新>-移动硬盘(黑薄)

移动硬盘名称为`2TB<新>`，共计2TB空间，盘符名为“**Entertainment**”，主要内容包括“动漫、纪录片、音乐、影视、游戏、2016年论文”。

### 2TB<旧>-移动硬盘(白厚)

移动硬盘名称为**2TB<旧>**，共计2TB空间，盘符名为`Study`，主要内容包括“软件、书籍 、其他技能视频 、慕课专栏 、掘金小册 、极客时间 、编程视频教程 、网易云课堂”。

### 4TB-移动硬盘(黑厚)

移动硬盘没有贴名字，共计4TB空间，盘符名为`Element SE`，主要内容包括“other 、PPT资料 、surface文件 、switch 升级备份 、其他视频教程 、历史存档资料 、多媒体制作 、学习 、宝宝资料 、小学资料 、得到 、手机备份 、操作系统原理 、机器人Linux 、樊登小读者 、汇编逆向 、爬虫数据 、电子书 、精选pdf电子书 、编程 、自然语言处理 、语料库、魔d广播剧”。

## B站视频下载(bilibili视频下载)

**方法1**: 下载[annie.exe](https://wwaz.lanzoum.com/iSPCn0n9ys0f)或者[lux.exe](https://github.com/iawia002/lux), 因为需要登录bilibili之后才能下载720p及以上清晰度的视频, 因此需要使用浏览器cookie, 在程序目录中创建`bilibili_cc.txt`文件, 然后登录[B站](https://www.bilibili.com/), 打开chrome浏览器的调试窗口, 在`网络`的请求中找到`www.bilibili.com`,查看`标头`的`cookie`属性, 如下图所示:

![cookie](https://pic.imgdb.cn/item/63e7990c4757feff330d13ed.jpg)

右键选中`复制值`之后, 在`bilibili_cc.txt`文件中粘贴, 里面的内容应该是`键=值;`模式。

准备好cookie之后, 在文件根目录输入`.\annie.exe -c .\bilibili_cc.txt -i "https://www.bilibili.com/video/BV1U84y167i3"`, 可以查看下载文件的类型和清晰度, 然后使用`.\annie.exe -c .\bilibili_cookie.txt -f 64 "https://www.bilibili.com/video/BV1U84y167i3?p=1"`进行下载。

**方法2**: 使用[高清视频下载](https://youtube.iiilab.com/), [yiuios视频解析](https://www.yiuios.com/tool/bilibili)等网站下载。

## Steam Deck 折腾情况

### 更换固态硬盘

1.参考B站换固态硬盘教程[全网最细Steam Deck换固态教学](https://www.bilibili.com/video/BV1824y1C72m/)，将初始的64GB固态硬盘换成1TB的硬盘。

### 安装windows和Steam OS双系统

1.参考B站[Steam Deck 双系统安装教程](https://www.bilibili.com/video/BV1AP4y1v77b/)进行设置，简要步骤包括：使用U盘用[rufus](https://rufus.ie/zh/)工具创建[steam deck恢复镜像](https://help.steampowered.com/zh-cn/faqs/view/1B71-EDF2-EB6D-2BB3)，sd从U盘启动安装steam os，然后用Steam OS自带工具进行分区，在`home卷`之后划分新分区，然后格式化为ntfs，卷标可以设置为`windows`。

:::warning 注意
如果Steam页面无法直接连接，可以使用[Steam++](https://steampp.net/)进行加速，[开源地址](https://github.com/BeyondDimension/SteamTools)。
:::

2.在U盘用rufus安装win10的镜像，选择驱动器为之前windows的那一个，然后安装win10。可以从[此处](https://www.imsdn.cn/windows-10/win10-21h2/)下载win10 21H2的原版镜像。

### Steam Deck安装windows之后的设置

进入win10之后从[官方途径](https://help.steampowered.com/zh-cn/faqs/view/6121-ECCD-D643-BAA8)下载驱动安装，然后需要再win10下进行下面操作以防止双系统出问题，详细解决方案参考[Steam deck双系统疑难杂症记录帖](https://www.bilibili.com/read/cv20244884)。

:::tip 注意

一、常规设置

- 右键我的电脑（刚装完默认桌面没有“我的电脑”，如果找不到请在文件浏览器里右键，或者开始菜单输入compmgmt.msc），在磁盘管理中选两个efi，右键菜单选择更改驱动器号和路径，删除。**注意是删除驱动器号而不是删除卷！**；

- 打开开始菜单，进入设置界面，在`系统`-`电源`项目中选择使用电池 / 接通电源的休眠时间均为从不（上面两个关闭屏幕不用管）；

- 打开开始菜单输入control，打开控制面板，找到电源选项，左边导航进入选择电源按钮的功能，点击更改当前不可用的设置，将下方除了锁定和睡眠其他的勾都去掉，并在上方按电源按钮 / 关闭盖子时的选项均改为不采取任何操作；

- 运行gpedit.msc，在`计算机配置`-`管理模板`-`windows组件`-`更新`-`管理最终用户体验`中选择`配置自动更新`，双击出现窗口，左侧修改为已启用，左下方设置为5 - 允许本地管理员选择设置，按确定保存。

- windows可能在插电时无法睡眠或息屏，需要充电的，拔掉电源息屏/睡眠后再插上即可。

- 请使用windows的常规关机。

二、禁用win10更新

- 禁用Windows Update服务。通过键盘Win + R健，弹出运行对话框，输入命令 services.msc ，按“确定”按钮，找到`Windows Update`，双击打开，点击“停止”，将启动类型选为“禁用”，最后点击“应用”。切换到“恢复”选项，将第一次失败、第二次失败、后续失败全部修改为“无操作”，点击“应用”“确定”。

- 通过组策略进行Win10自动更新相关服务关闭。按Win + R 组合键，调出运行命令操作弹框，输入“gpedit.msc”，点击确定。于本地组策略编辑器左侧菜单栏，依次选择：计算机配置 -> 管理模板 -> Windows组件 -> Windows更新。双击右侧“配置自动更新”，弹出框中设置为“已禁用”，点击“应用”并“确定”。接着再找到“删除使用所有Windows更新功能的访问权限”，双击弹出框，设置已启用，然后“确定”。

- 禁止任务计划中的Win10自动更新服务。按 Win + R键，调出运行弹框，输入“taskschd.msc”，并“确定”。于任务计划程序弹框中，依次选择：任务计划程序库 -> Microsoft -> Windows -> WindowsUpdate，将其展示出来的项目均设置为 [ 禁用 ]。

- 通过注册表关闭Win10自动更新功能。按Win + R 组合键，在弹出的运行框中输入：regedit，确定。在注册表编辑器中找到：`HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\UsoSvc`。然后在右侧找到“Start”键。双击`start`，在弹出框中把基数改成：16进制，数值数据改为“4”，点击确定。右侧找到“FailureActions”，双击弹出框中，把“0010”、“0018”行的左起第5个数值由原来的“01”改为“00”， “确定”。这样我们就可以彻底把win10自动更新永久关闭。

![注册表修改](https://pic.imgdb.cn/item/641fce7ea682492fcc3da4ac.jpg)

参考自[知乎专栏-WIN10系统如何彻底永久关闭自动更新](https://zhuanlan.zhihu.com/p/391195241)
:::

#### 解决Steam Deck双系统时间同步问题

在windows中，以管理员身份运行cmd，在命令行中输入下面命令并回车`Reg add HKLM\SYSTEM\CurrentControlSet\Control\TimeZoneInformation /v RealTimeIsUniversal /t REG_DWORD /d 1`

#### 解决Steam Deck触摸板操作问题

下载[Steam Deck Tools](https://github.com/ayufan/steam-deck-tools)，双击使用`SteamController.exe`，常用设置如下：

![SteamController设置](https://pic.imgdb.cn/item/641fd070a682492fcc404291.jpg)

#### Steam Deck快捷键情况

Steam Deck默认快捷键：

- **steam+B（长按）**：强制游戏关闭

- **steam+X**：显示键盘

- steam+L1：切换放大器

- steam+R1：截图

- steam+L2：鼠标右键点击

- steam+R2：鼠标左键点击

- steam+右摇杆 R3：摇杆鼠标

- steam+右触摸板Trackpad 移动：作鼠标用

- steam+右触摸板Trackpad 按压：鼠标左键点击

- **steam+左摇杆L3 ↑↓**：调高屏幕亮度和降低屏幕亮度

- steam+十字键 D-pad 右：回车键

- steam+十字键 D-pad 下：Tab键

- steam+十字键 D-pad 左：Esc键

来源：[知乎Steam 攻略](https://zhuanlan.zhihu.com/p/585181194)

:::tip 注意
在windows环境下，使用STEAM+X呼出虚拟键盘后，shift、ctrl或者alt键为**粘滞**，即按一下就默认一直长按，而这种情况下使用搜狗输入法用shift切换中英文就很不方便，解决办法是长按shift键，长按就不会粘滞。
:::

### Steam Deck引导修复

1、制作微PE的引导U盘

2、将U盘插入steam deck，然后按“音量下”+“开机键”进行开机

3、在引导处选择“U盘”启动PE系统

4、在PE系统中进入diskgenius分区工具，选中第1个分区“esp（0）”，然后右键“指派新的驱动器号（盘符）”，随便给他分个盘符，这样在文件资源浏览器中才能看到。

注意：ESP（0）的分区里面应该有个“efi”文件夹，efi下面应该有个“steamos”的文件夹

5、点击开始菜单，选择“扇区小工具bootice”，选择“UEFI”选项卡，点击“修改启动序列”按钮，点击“添加”，选择“ESP（0）”分区下面的“efi/steamos/steamcl.efi”文件，然后改一下菜单标题“steam os”，也可以上移它，点击“保存当前启动项设置”