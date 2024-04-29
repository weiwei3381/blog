# git 使用攻略

## git 命令速查

### 常用命令

下面按流程列举了 git 常用命令：

```git
git init //初始化git仓库
git add . // 添加所有文件
git commit -m "first commit"  // 提交文件
git remote add origin [远程仓库地址] //链接远程仓库，创建主分支
git pull origin master // 拉取远程仓库到本地主分支
git push -u origin master  // 把本地仓库的文件推送到远程仓库
// 如果当前分支与多个主机存在追踪关系，那么这个时候-u选项会指定一个默认主机(即origin)
// 这样后面就可以不加任何参数使用git push
```

git与网络相关的命令如下:

```git
git config --global http.sslVerify false  // 关闭SSL验证
git config --global http.version HTTP/1.1  // 设置http版本为1.1
git config --global http.proxy http://127.0.0.1:7890  // 设置本地7890的代理
git config --global http.postBuffer 2572864000  // 增加postBuffer的大小

//  查看所有的global设置
git config --global -l

// 删除代理
git config --global --unset http.proxy

```

### git 创建 ssh key 进行远程提交

#### 创建 Github 的 SSH

1. 创建 SSH Key。Windows 下打开**Git Bash**，创建 SSH Key：
   `ssh-keygen -t rsa -C "youremail@example.com"`,例如我的 git 邮箱是**example@live.com**，则输入`ssh-keygen -t rsa -C "example@live.com"`，一切顺利的话，可以在 C 盘的用户目录里找到`.ssh`目录，里面有`id_rsa`和`id_rsa.pub`两个文件，这两个就是 SSH Key 的秘钥对，`id_rsa`是私钥，不能泄露出去，`id_rsa.pub`是公钥，可以放心地告诉任何人。
2. 登陆 GitHub，打开“Account settings”，“SSH Keys”页面，然后点“Add SSH Key”，填上任意 Title，在 Key 文本框里粘贴 id_rsa.pub 文件的内容。

#### 处理码云和 github 同时配置的冲突

如果需要在 Gitee(码云)、Github 上同时配置 ssh key，并解决冲突：

1. 使用`-f`参数生成不同的 rsa 文件：

   ```git
   ssh-keygen -t rsa -C "xxxxxxx@qq.com" -f "github_id_rsa"
   ssh-keygen -t rsa -C "xxxxxxx@qq.com" -f "gitee_id_rsa"
   ```

2. 把各自的 public 文件内容(即带有 pub 后缀文件)分别复制到 gitee 和 github 上。
3. 在`.ssh`文件夹中创建 config 文件解决 ssh 冲突：

   ```git
   # gitee
   Host gitee.com
   HostName gitee.com
   PreferredAuthentications publickey
   IdentityFile C:/Users/wowbat/.ssh/gitee_id_rsa

   # github
   Host github.com
   HostName github.com
   PreferredAuthentications publickey
   IdentityFile C:/Users/wowbat/.ssh/id_rsa

   ```

### 新建代码库

- 🍞 在当前目录初始化 git 仓库: `git init`
- 新建项目，并将其初始化为 git 仓库: `git init [仓库名称]`
- 🍞 新建项目文件夹，并从网址下载一个项目及其整个代码历史: `git clone [项目网址]`

### git 配置

- 显示当前 git 配置: `git config --list`
- 设置提交代码时的用户名:`git config [--global] user.name "[用户名]"`
- 设置提交代码时的电子邮件:`git config [--global] user.email "[email地址]"`

### 增加/修改/提交文件

- 🍞 将文件夹下所有文件添加到仓库：`git add .`
- 🍞 将所有添加后的文件提交到仓库：`git commit -m "[注释]"`
- 添加所有追踪的文件到暂存区并提交: `git commit -a -m "[注释]"`，🔥tips:对于新增加的文件无效果
- 如果代码没有任何新变化，则用新的信息来改写上一次 commit 的提交信息: `git commit --amend -m "[信息]"`

### 分支

- 显示所有本地分支: `git branch`
- 列入所有本地和远程分支: `git branch -a`
- 新建一个分支，但依然停留在当前分支: `git branch [分支名称]`
- 🍞 新建一个分支，并切换到该分支: `git checkout -b [分支名称]`
- 切换到指定分支，并更新工作区: `git checkout [分支名称]`
- 合并指定分支到当前分支: `git merge [分支名称]`

### 标签

提交之后可以使用`git tag [标签名]`**创建标签**，然后使用`git show [标签名]`可以显示那次提交信息，显示之后按`q`退出。

可以对**过去的提交打标签**，使用`git log --pretty=oneline`查看所有提交历史，然后使用`git tag -a [标签名，例如v1.2] [hash版本，例如9fceb02]`给历史提交打标签

`git tag`能够**查看所有标签名**

要**删除**本地仓库上的标签，可以使用命令 `git tag -d [标签名]`

如果你想**查看某个标签所指向的文件版本**，可以使用 `git checkout [标签名]`

默认情况下，`git push` 命令并**不会**传送标签到远程仓库服务器上。在创建完标签后你必须显式地推送标签到共享服务器上，`git push origin [标签名]`，如果想要一次性推送很多标签，也可以使用带有`--tags`选项的 `git push` 命令，即`git push origin --tags`

### rebase

第二种合并分支的方法是 `git rebase`。Rebase 实际上就是取出一系列的提交记录，“复制”它们，然后在另外一个地方逐个的放下去。

Rebase 的优势就是可以**创造更线性的提交历史**，这听上去有些难以理解。如果只允许使用 Rebase 的话，代码库的提交历史将会变得异常清晰。

我们想要把 bugFix 分支里的工作直接移到 main 分支上。移动以后会使得两个分支的功能看起来像是按顺序开发，但实际上它们是并行开发的。注意当前所在的分支是 bugFix（星号标识的是当前分支），使用 `git rebase main` 实现此目标。

![git rebase main](https://pic.imgdb.cn/item/618fc2ff2ab3f51d916c7810.jpg)

现在 bugFix 分支上的工作在 main 的最顶端，同时我们也得到了一个更线性的提交序列。**注意**：提交记录`C3`依然存在（树上那个半透明的节点），而 `C3'` 是我们 Rebase 到 main 分支上的`C3`的副本。

然后还需要切换到`main`分支上，使用`git checkout main`。然后使用`git rebase bugFix`把它rebase到`bugFix`分支上。

### 在提交树上移动

我们首先看一下 “HEAD”。 HEAD 是一个对当前检出记录的符号引用，也就是指向你正在其基础上进行工作的提交记录。

HEAD 总是指向当前分支上最近一次提交记录。大多数修改提交树的 Git 命令都是从改变 HEAD 的指向开始的。HEAD 通常情况下是指向分支名的（如 bugFix）。在你提交时，改变了 bugFix 的状态，这一变化通过 HEAD 变得可见。

使用`git checkout [提交记录的hash]`可以移动HEAD。不过通过指定提交记录哈希值的方式在 Git 中移动不太方便，因为hash值通常很长，所以 Git 引入了相对引用。

使用相对引用的话，你就可以从一个易于记忆的地方（比如 bugFix 分支或 HEAD）开始计算。相对引用非常给力，这里我介绍两个简单的用法：

- 使用 `^` 向上移动 1 个提交记录
- 使用 `~<num>` 向上移动多个提交记录，如`~3`

操作符 (^)，把这个符号加在引用名称的后面，表示让 Git 寻找指定提交记录的父提交。所以`main^`相当于“main 的父节点”。`main^^`是 main 的第二个父节点使用`git checkout main^`运行。同理，也可以将 HEAD 作为相对引用的参照。

如果你想在提交树中向上移动很多步的话，敲那么多`^`貌似也挺烦人的，Git 当然也考虑到了这一点，于是又引入了操作符`~`。该操作符后面可以跟一个数字（可选，不跟数字时与 ^ 相同，向上移动一次），指定向上移动多少次。`git checkout HEAD~4`表示HEAD向上移动4次。

**强制修改分支位置**，使用相对引用最多的就是移动分支。可以直接使用`-f`选项让分支指向另一个提交。例如`git branch -f main HEAD~3`命令会将 main 分支强制指向 HEAD 的第 3 级父提交。

![git branch -f main HEAD~3](https://pic.imgdb.cn/item/618fc8d22ab3f51d916e6198.jpg)

### 撤销变更

在 Git 里撤销变更的方法很多。和提交一样，撤销变更由底层部分（暂存区的独立文件或者片段）和上层部分（变更到底是通过哪种方式被撤销的）组成。我们这个应用主要关注的是后者。

主要有两种方法用来撤销变更，一是`git reset`，还有就是`git revert`。接下来咱们逐个进行讲解。

**Git Reset**：通过把分支记录回退几个提交记录来实现撤销改动。你可以将这想象成“改写历史”。git reset 向上移动分支，原来指向的提交记录就跟从来没有提交过一样。

例如`git reset HEAD~1`,Git 把 main 分支移回到 C1；现在我们的本地代码库根本就不知道有 C2 这个提交了。

![git reset HEAD~1](https://pic.imgdb.cn/item/618fcc602ab3f51d916f836d.jpg)

**Git Revert**：虽然在你的本地分支中使用 git reset 很方便，但是这种“改写历史”的方法对大家一起使用的远程分支是无效的哦！为了撤销更改并分享给别人，我们需要使用 git revert。

使用`git revert HEAD`后，在我们要撤销的提交记录后面居然多了一个新提交！这是因为新提交记录`C2'` 引入了更改，这些更改刚好是用来撤销`C2`这个提交的。也就是说`C2'` 的状态与 `C1`是相同的。revert 之后就可以把你的更改推送到远程仓库与别人分享啦。

![git revert HEAD](https://pic.imgdb.cn/item/618fcd3f2ab3f51d916fc8d8.jpg)

### 查看信息

- 查看变更内容: `git diff`，使用**pagedown**按钮翻页，使用**q**再按**enter**退出查看
- 🍞 显示所有变更的文件: `git status`
- 单行模式查看提交日记: `git log --pretty --oneline`
- 显示过去的 5 次提交: `git log -5 --pretty --oneline`
- 显示今天写了多少代码: `git diff --shortstat "@{0 day ago}"`
- 显示当前分支最近的几次提交: `git reflog`

### 远程操作

- 显示所有远程仓库: `git remote -v`
- 取回远程仓库的变化，并与本地分支合并: `git pull [远程仓库名称,一般用origin] [分支名称]`
- 增加一个新的远程仓库，并命名: `git remote add [远程仓库名称,一般用origin] [远程url]`
- 上传本地指定分支到远程仓库: `git push [远程仓库名] [本地分支名]`
- 强行推送当前分支到远程仓库，即使有冲突: `git push [远程仓库名] --force`

### 撤销

## pandoc 配合 git 实现文档版本化管理

> git 可以进行版本管理，但是只能针对纯文本，对于 docx 等二进制文件无法准确查看每次修改位置，那么如果用 markdown 文本文件管理文件内容，使用某种转换工具将 markdown 文件转换，就可以实现文档版本化管理。[pandoc](https://pandoc.org/)是一种将各类文件互相转换的工具，例如 docx、html、markdown、epub、pdf 等，在一些 markdown 写作工具中，它常被用作导出工具的一种，项目源代码托管于[github](https://github.com/jgm/pandoc)，可以在[此处](https://github.com/jgm/pandoc/releases)下载最新版本，2.1 版本的 win_x64 的安装文件[下载](https://wws.lanzous.com/i0lOmgja7na)。

### pandoc 基本命令

pandoc 是一个命令行工具，下面是常用的命令，需要注意的是，如果使用 cmd，那么在使用 pandoc 之前键入`chcp 65001`，将编码设置为 UTF-8，否则导出的文件会出现错误。

pandoc 的基本操作`pandoc <files> <options>`，其中 `<files>` 为输入的内容，其输入即可以来自文件，也可以来自标准输入甚至网页链接。而 `<options>` 为参数选项。主要的参数选项有：

- -o [file]：指定输出文件，该项缺省时，将输出到标准输出；
- --highlight-style [style]：设置代码高亮主题，默认为 pygments；
- -s：生成有头尾的独立文件（HTML，LaTeX，TEI 或 RTF）；
- -S：聪明模式，根据文件判断其格式；
- --self-contained：生成自包含的文件，仅在输出 HTML 文档时有效；
- --verbose：开启 Verbose 模式，用于 Debug；
- --list-input-formats：列出支持的输入格式；
- --list-output-formats：列出支持的输出格式；
- --list-extensions：列出支持的 Markdown 扩展方案；
- --list-highlight-languages：列出支持代码高亮的编程语言；
- --list-highlight-styles：列出支持的代码高亮主题；
- -v、--version：显示程序的版本号；
- -h、--help：显示程序的帮助信息。

常用的转换命令如下：

```python
# 将demo.md转换为demo.html
pandoc demo.md -o demo.html

# 使用自定义css样式，并将外部文件嵌入到 HTML 文档中，生成一个自包含的独立HTML文件
pandoc demo.md --self-contained -c style.css -o demo.html

# 将demo.md文件转换为 docx 格式
pandoc demo.md -o demo.docx

# 下面的命令将 HTML 网页转换为 docx 格式
pandoc http://weiwei3381.gitee.io/blogs/general/git.html -o this_page.docx
```

### 将 md 文件转换为公文格式 word

（一）进入 cmd 页面，输入`chcp 65001`，将编码设置为 UTF-8，使用下面命令查看默认的 word 模板，并将其导出到当前文件夹的 custom-reference.docx 中：

```python
pandoc --print-default-data-file reference.docx > custom-reference.docx
```

（二）修改`custom-reference.docx`格式，将其改为公文模板，这里已经修改好的公文模板`reference.docx`<a :href="$withBase('/reference.docx')" >格式文件</a>下载。

::: tip 注意
有些格式不是默认显示的，所以需要在 word 的样式栏中，点击右下角的箭头，展开全部样式才能找到，例如`图片`、`图注`、`源代码`等。
:::

（三）将公文模板放到 pandoc 的用户数据目录，使用`pandoc -v`查看目录的位置。

```python
# 查看pandoc的版本信息
pandoc -v
# 输出中能看到默认的用户数据目录，word模板命名为reference.docx放到用户数据目录中
# Default user data directory: C:\Users\weiwe\AppData\Roaming\pandoc
```

我自己电脑的位置是`C:\Users\weiwe\AppData\Roaming\pandoc`，如果`pandoc`目录不存在，可以手动创建，然后将模板格式改为`reference.docx`名称放到该位置，然后使用`pandoc [目标文件.md] -o [转换后文件.docx]`
