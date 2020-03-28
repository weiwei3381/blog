# git命令速查

## 常用命令

下面按流程列举了git常用命令：

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

## git创建ssh key进行远程提交

### 创建Github的SSH

1. 创建SSH Key。Windows下打开**Git Bash**，创建SSH Key：
`ssh-keygen -t rsa -C "youremail@example.com"`,例如我的git邮箱是**example@live.com**，则输入`ssh-keygen -t rsa -C "example@live.com"`，一切顺利的话，可以在C盘的用户目录里找到`.ssh`目录，里面有`id_rsa`和`id_rsa.pub`两个文件，这两个就是SSH Key的秘钥对，`id_rsa`是私钥，不能泄露出去，`id_rsa.pub`是公钥，可以放心地告诉任何人。
2. 登陆GitHub，打开“Account settings”，“SSH Keys”页面，然后点“Add SSH Key”，填上任意Title，在Key文本框里粘贴id_rsa.pub文件的内容。

### 处理码云和github同时配置的冲突

如果需要在Gitee(码云)、Github上同时配置ssh key，并解决冲突：

1. 使用`-f`参数生成不同的rsa文件：

    ```git
    ssh-keygen -t rsa -C "xxxxxxx@qq.com" -f "github_id_rsa"
    ssh-keygen -t rsa -C "xxxxxxx@qq.com" -f "gitee_id_rsa"
    ```

2. 把各自的public文件内容(即带有pub后缀文件)分别复制到gitee和github上。
3. 在`.ssh`文件夹中创建config文件解决ssh冲突：

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

## 新建代码库

- 🍞在当前目录初始化git仓库: `git init`
- 新建项目，并将其初始化为git仓库: `git init [仓库名称]`
- 🍞新建项目文件夹，并从网址下载一个项目及其整个代码历史: `git clone [项目网址]`

## git配置

- 显示当前git配置: `git config --list`
- 设置提交代码时的用户名:`git config [--global] user.name "[用户名]"`
- 设置提交代码时的电子邮件:`git config [--global] user.email "[email地址]"`

## 增加/修改/提交文件

- 🍞将文件夹下所有文件添加到仓库：`git add .`
- 🍞将所有添加后的文件提交到仓库：`git commit -m "[注释]"`
- 添加所有追踪的文件到暂存区并提交: `git commit -a -m "[注释]"`，🔥tips:对于新增加的文件无效果
- 如果代码没有任何新变化，则用新的信息来改写上一次commit的提交信息: `git commit --amend -m "[信息]"`

## 分支

- 显示所有本地分支: `git branch`
- 列入所有本地和远程分支: `git branch -a`
- 新建一个分支，但依然停留在当前分支: `git branch [分支名称]`
- 🍞新建一个分支，并切换到该分支: `git checkout -b [分支名称]`
- 切换到指定分支，并更新工作区: `git checkout [分支名称]`
- 合并指定分支到当前分支: `git merge [分支名称]`

## 查看信息

- 查看变更内容: `git diff`，使用**pagedown**按钮翻页，使用**q**再按**enter**退出查看
- 🍞显示所有变更的文件: `git status`
- 单行模式查看提交日记: `git log --pretty --oneline`
- 显示过去的5次提交: `git log -5 --pretty --oneline`
- 显示今天写了多少代码: `git diff --shortstat "@{0 day ago}"`
- 显示当前分支最近的几次提交: `git reflog`

## 远程操作

- 显示所有远程仓库: `git remote -v`
- 取回远程仓库的变化，并与本地分支合并: `git pull [远程仓库名称,一般用origin] [分支名称]`
- 增加一个新的远程仓库，并命名: `git remote add [远程仓库名称,一般用origin] [远程url]`
- 上传本地指定分支到远程仓库: `git push [远程仓库名] [本地分支名]`
- 强行推送当前分支到远程仓库，即使有冲突: `git push [远程仓库名] --force`

## 撤销
