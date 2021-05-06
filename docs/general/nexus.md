# nexus3搭建私有源

## Nexus初始化

### 下载Nexus3软件 

首先去官方下载[windows x64软件包](https://sonatype-download.global.ssl.fastly.net/nexus/3/latest-win64.zip), 直接下载可能会被墙，建议使用迅雷下载.

### 运行nexus

1. nexus需要java1.8以上运行环境，首先确保电脑上有安装。  
2. 下载软件包，解压，进入“\nexus-3.17.0-01\bin"目录，可以看到该目录有"nexus.exe"文件, 在该目录打开命令行，运行"nexus.exe /run"命令, 就可以启动nexus服务了.

:::tip 提示
更方便的做法是将nexus.exe文件发送到桌面快捷方式, 修改快捷方式命令, 加入"/run"指令即可.
:::

### 进入Nexus

1. 服务启动完毕后, 在浏览器中输入`http://localhost:8081/`进入nexus主页. 第一次进入需要点击右上角的登录, 用户名为`admin`, 对于老版本的Nexus, 默认密码为`admin123`, 新版本则放在了`admin.password`文件中. 登陆后必须要修改管理员密码.

## Pypi代理服务器搭建

### 创建Pypi仓库

登录服务器之后, 按照下图创建仓库:
![创建pypi仓库](https://s1.ax1x.com/2020/03/28/Gk9YfU.png)

### 设置仓库类型

在仓库选择地方, 有不同类型的仓库, 选择`pypi(proxy)`, 即pypi的代理仓库(代理仓库就是找不到软件包时会去指定源下载, 下载之后就保存在nexus上)

### 配置Pypi仓库

创建代理服务器的设置, 最重要的是名字和远程源地址(注意: 远程源地址不需要加simple), 常用的豆瓣源为: `https://pypi.doubanio.com`
![pypi仓库设置](https://s1.ax1x.com/2020/03/28/GkPwIx.png)

### 典型仓库示例

一个典型的设置如下图所示, 使用时的源地址为:`http://localhost:8081/repository/pypi-proxy/simple/`, 这时候需要加上simple.  
![pypi仓库示例](https://s1.ax1x.com/2020/03/28/GkPLes.png)

### 仓库使用

使用时, 临时指定源的命令为: `pip install itchat -i http://localhost:8081/repository/pypi-proxy/simple`, 全局设置在文件`%APPDATA%\pip\pip.ini`中, 例如`C:\Users\weiwe\AppData\Roaming\pip\pip.ini`设置如下:

```ini
[global]
timeout = 600
index-url = https://pypi.doubanio.com/simple
trusted-host = pypi.doubanio.com
[list]
format = columns
```

其中，timeout：设置超时时间，index-url：指定下载源，trusted-host：指定域名。

国内常用的镜像源有：

1. 清华：https://pypi.tuna.tsinghua.edu.cn/simple
2. 阿里云：http://mirrors.aliyun.com/pypi/simple/
3. 中国科技大学 https://pypi.mirrors.ustc.edu.cn/simple/
4. 华中理工大学：http://pypi.hustunique.com/
5. 山东理工大学：http://pypi.sdutlinux.org/
6. 豆瓣：http://pypi.douban.com/simple/
7. 豆瓣：https://pypi.doubanio.com/simple/

## NPM代理服务器搭建

### 增加NPM源

步骤与pypi源基本相同, 创建时选择"npm (proxy)"方式. 源地址输入淘宝NPM源`http://registry.npm.taobao.org/`.

![npm源配置](https://s1.ax1x.com/2020/03/28/GkmtyV.png)

### 设置与使用

使用时, 可以直接设置npm源地址, 命令为`npm config set registry http://localhost:8081/repository/npm-proxy/`, 查看npm源地址命令为"npm config get registry"也可以在安装包时临时指定地址, 例如, 安装express包, 则使用`npm install express --registry=http://127.0.0.1:8081/repository/npm-proxy/`

:::warning 注意
如果在使用配置的npm源时出现*401未授权*错误, 有可能是npm的5.0.3版本bug, 首先可以尝试升级npm, 命令为`npm install npm -g`, 然后在浏览器尝试访问对应模块地址, 如果本地url为`http://127.0.0.1:8081/repository/npm-proxy/`, 则访问`http://127.0.0.1:8081/repository/npm-proxy/express`试试, 如果弹出用户名密码输入框,则使用nexus的管理员账号密码看能不能访问, 如果可以的话, 那么在Nexus中配置匿名登录即可正常访问, 设置方式如下:
![npm设置匿名登录](https://s1.ax1x.com/2020/03/28/GkuGrV.png)
设置nexus3匿名登录的好处在于, pip安装时不需要每次输入用户名密码, npm安装也不会出现401未授权错误.
:::

### Maven代理服务器搭建

### 增加Maven代理

创建方式跟之前的差不多, 代理地址一般用阿里巴巴的源, 地址为:`https://maven.aliyun.com/repository/central`, 阿里巴巴还有其他的maven镜像源, 可以到[阿里巴巴Maven库](https://maven.aliyun.com/mvn/view)查看. 配置完毕后的页面如下:
![Maven代理设置](https://s1.ax1x.com/2020/03/28/GknBB8.png)

### 修改Maven使用配置

 修改maven源地址, 打开maven的安装目录, 打开`conf\settings.xml`文件, 在`mirrors`节点下加入下面配置:  

```xml
<mirror>
    <id>myMaven</id>
    <mirrorOf>*</mirrorOf>
    <name>My Maven Repository</name>
    <url>http://localhost:8081/repository/maven-proxy/</url>
</mirror>
```

其中url标签就是Nexus提供给我们的地址.  

### 利用命令行下载包

 使用命令批量下载`pom.xml`中的jar包, 方法来自于[原文](https://www.cnblogs.com/luoruiyuan/p/5948181.html)写一个批处理文件, 先写一个批处理文件, 内容如下所示, 然后将批处理文件和需要下载的`pom.xml`文件放在同一目录, 双击批处理文件即可.

```batch
call mvn -f pom.xml dependency:copy-dependencies
pause
```

一个典型的pom.xml文件如下:

```xml
<?xml version="1.0"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>temp.download</groupId>
    <artifactId>temp-download</artifactId>
    <version>1.0-SNAPSHOT</version>
    <dependencies>
    <!-- 需要下载什么jar包 添加相应依赖 其余部分无需在意-->
    <dependency>
        <groupId>org.jasig.cas</groupId>
        <artifactId>cas-client-core</artifactId>
        <version>3.1.10</version>
    </dependency>
  
    </dependencies>
</project>
```

### Gradle中配置使用

 在gradle中使用自己建立的maven库

```Groovy
repositories{
maven{url'http://localhost:8081/repository/maven-public/'}
}
```
