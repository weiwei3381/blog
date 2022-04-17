# linux核心技能

## 终端常用命令

### 基础命令

1. clear: 清屏, 也可以使用`Ctrl+c`快捷键

### 目录相关命令

1. ls(**l**i**s**t): 列出文件列表
   - `-a`参数, 显示所有文件(包括隐藏文件);
   - `-A`参数, 与`-a`基本相同, 但不列出 "." (目前目录) 及 ".." (父目录);
   - `-h`参数, 以Ko, Mo, Go显示文件大小;
   - `-l`参数, 除文件名称外，也将文件型态、权限、拥有者、文件大小等资讯详细列出
2. cd(**c**hange **d**irectory): 更改目录
   - `cd ..`回到父级目录, 
   - `~`表示`/home/[用户]`的家目录; 使用命令`cd`或者`cd ~`可以快速回到家目录
3. pwd(**p**rint **w**ork **d**irectory): 显示目前所在的工作目录的绝对路径名称;
4. which: 查找命令的文件位置, 例如`which pwd`会显示`pwd`命令;
5. du(**d**isk **u**sage): 显示目录或文件的大小, 默认只列出目录大小, `du`统计当前目录大小, `du ~`统计家目录总大小
   - `-h`参数, 以Ko, Mo, Go显示文件大小;
   - `-a`参数, 显示所有(all)目录和文件大小
   - `-s`参数, 只显示总计(sum)大小

### 浏览和创建文件

1. cat(**c**onc**a**tena**t**e): 一次性在终端显示文件的所有内容, 只需要在命令后加上想要显示的文件路径即可, 可加多个文件, 一次性全部显示.
   - `-n`在显示文件内容前面加上序号(num)
2. less: 分页显示文件内容, 只需要在命令后加上想要显示的文件路径即可
   - `空格键`或者`PageDown键`: 向下翻一页
   - `d键`: 向下翻半页
   - `回车键`或者`向下键`: 向下滚动一行
   - `b键`或者`PageUp键`: 向上翻一页
   - `y键`或者`向上键`: 向上滚动一行
   - `u键`: 向前回退半页
   - `q键`: 退出文件
   - `=键`: 显示当前屏幕字符在文件的第几行到第几行
   - `h键`: 显示帮助文档, 退出帮助文档按`q`
   - `/键`: 进入搜索模式, 按`n键`跳到下一个符合的项目, 按`N键`跳到上一个符合项目
3. head: 显示文件头行, 用法为`head [文件名]`, 默认显示头10行
   - `-n`参数, 指定显示的行数, `head [文件名] -n 15`表示显示文件头15行
4. tail: 显示文件尾行, 用法为`tail [文件名]`, 默认显示尾部10行
   - `-n`指定显示的行数, `tail [文件名] -n 15`表示显示文件尾部15行
   - `-f`每隔1秒检查文件是否有追加内容, 如果有则显示新增内容, 可以用`Ctrl+C`来终止`tail -f`命令, 可以用`-s 4`指定每隔4秒检查一下文件是否有更新
5. touch: 本意是修改文件时间, 如果命令后面跟着的文件名不存在, 则会新建空文件
6. mkdir(**m**a**k**e **dir**ectory): 新建文件夹
   - `-p`递归创建目录结构, 例如`mkdir -p one/two/three`, 创建嵌套目录

### 文件的复制和移动操作

1. cp(**c**o**p**y): 复制文件, 可以拷贝单个文件/多个文件和目录
   - `cp [file] [file_copy]`将文件file复制为file_copy, 
   - `cp [file] [dir]`将文件file复制到目录dir中, 改变名字则使用`cp [file] [dir]/[file_copy]`
   - `cp [dir] [dir_copy] -r`复制目录, 加上`-r`表示递归复制
   - `cp *.txt [dir]`将当前目录下的所有txt文件拷贝到dir目录中
2. mv(**m**o**v**e): 移动文件/目录, 或者重命名文件/目录
   - `mv [file] [dir]`将file移动到dir目录下
   - `mv [dir] [new_dir]`将dir目录移动到new_dir目录下
   - `mv [file] [new_name_file]`将文件`file`重命名为`new_name_file`
3. rm(**r**e**m**ove): 删除文件, 终端没有回收站, `rmdir`命令只能删除空目录
   - `rm [file]`删除文件file
   - `rm [file1] [file2]`删除多个文件file1, file2
   - `-i`参数, 终端会询问(inform)用户是否删除
   - `-f`参数, 终端会强制(force)删除文件
   - `-r`参数, 终端会递归(recursive)删除文件, 通常用于删除目录, 例如`rm [dir] -r`
4. ln(**l**i**n**k): 创建链接, 跟windows的快捷方式很像

## Vi/Vim常用操作

使用`vi [文件名]`打开或者创建对应的文件，然后进入模式选择状态。

### 插入选择

在文档下方的状态输入框中，输入不同字母可进入不同模式。

`i`：插入模式，在光标所在位置后面插入文本，按`Esc`键回到命令模式
`o`：下行插入模式，在光标所在行的下面插入新的一行，光标停在空行首，等待输入文本
`dd`：删除光标所在行

### 选择模式

`v`：选择模式，从光标位置开始按正常模式选择文本
`V`：行选择，选中光标经过的完整行
`y`：复制选中，复制已选中的文本到剪贴板
`yy`：复制行，将光标所在行复制到剪贴板
`p`：粘贴，将剪贴板中的内容粘贴到光标后

### Vi/Vim的保存

保存有多种命令，都是在命令模式下运行：
`wq`回车：保存并退出 Vim 编辑器；
`q`回车：不保存退出 Vim 编辑器；
`w [filename]`：另存到 [filename] 文件；
`ZZ`：直接退出 Vim 编辑器。