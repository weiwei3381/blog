# git常用命令

## 新建代码库

- 🔥在当前目录初始化git仓库: `git init`
- 新建项目, 并将其初始化为git仓库: `git init [仓库名称]`
- 🔥新建项目文件夹, 并从网址下载一个项目及其整个代码历史: `git clone [项目网址]`

## git配置

- 显示当前git配置: `git config --list`
- 设置提交代码时的用户名:`git config [--global] user.name "[用户名]"`
- 设置提交代码时的电子邮件:`git config [--global] user.email "[email地址]"`

## 增加/修改/提交文件

- 将文件夹下所有文件添加到仓库：`git add .`
- 将所有添加后的文件提交到仓库：`git commit -m "[注释]"`
- 🔥添加所有文件到暂存区并提交: `git commit -a -m "[注释]"`
- 查看变更内容: `git diff`, 使用**pagedown**按钮翻页, 使用**q**再按**enter**退出查看
- 单行模式查看提交日记: `git log --pretty=oneline`