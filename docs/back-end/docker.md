# Docker实战

> 经典参考资料:[Docker技术入门与实战](https://docker_practice.gitee.io/zh-cn/)

## 概述

Docker容器与虚拟机类似，但二者在原理上不同。容器是将操作系统层虚拟化，虚拟机则是虚拟化硬件，因此容器更具有便携性、高效地利用服务器。 容器更多的用于表示 软件的一个标准化单元。由于容器的标准化，因此它可以无视基础设施（Infrastructure）的差异，部署到任何一个地方。另外，Docker也为容器提供更强的业界的隔离兼容。

## 安装

### windows上进行安装

windows使用docker需要在win10专业版上，并且开启Hyper-V虚拟机，同时主板的BISO也要开启虚拟化。

1. 进入BIOS，选择Configuration的选项，Intel Virtual Technology的选项设置成Enable的状态。
2. “开始”菜单点右键，进入“程序和功能”，在“程序和功能”中点击“启用或关闭Windows功能”，选择开启“Hyper-V”；也可以使用命令`Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All`，在管理员身份的PowerShell中运行。开启此功能需要联网。

然后进入[docker官网的windows安装指南](https://docs.docker.com/docker-for-windows/install/)，下载“Docker Desktop for Windows”，2021年1月版本的[百度云](https://pan.baidu.com/s/1wlfhLHACPJeUobZifzzdGA)备份，提取码为zdsi。

### 初始配置

网上已经有很多docker镜像，配置在[hub.docker.com](https://hub.docker.com/search?q=&type=image)中，但是下载镜像速度很慢，需要配置国内Docker Hub源。经过比较，目前就[科大源](https://mirrors.ustc.edu.cn/)维护和访问速度都还不错，镜像地址为`https://docker.mirrors.ustc.edu.cn/`，配置方法参考[帮助](https://mirrors.ustc.edu.cn/help/dockerhub.html)。

其中**windows**系统的配置方法如下：

在系统右下角托盘Docker图标内右键菜单选择Settings，打开配置窗口后左侧导航菜单选择DockerEngine，在JSON配置中添加"registry-mirrors"一项，如下所示：

```json
{
  "registry-mirrors": ["https://docker.mirrors.ustc.edu.cn/"]
}
```

之后点击 “Apply & Restart” 保存并重启 Docker 即可。

> 另外也可以使用DaoCloud的[Hub](https://hub.daocloud.io/)

## 使用

### 镜像管理和运行

可以在国外官方源[hub.docker.com](https://hub.docker.com/search?q=&type=image)中搜索需要的镜像，然后使用下面命令管理镜像。

```docker
# 查看帮助
docker pull/images/run --help

# 拉取镜像
docker pull [OPTIONS] NAME[:TAG]  

# 查看本机镜像
docker images [OPTIONS] [REPOSITORY:[TAG]]

# 删除指定镜像
docker image rm [选项] <镜像1> [<镜像2> ...]

# 运行容器镜像
docker run [OPTIONS] IMAGE[:TAG] [COMMAND] [ARG...]
# 常用[OPTION]有: -d 后台(detach)运行程序; -i 保留交互(interactive)页面; -t 分配虚拟终端(terminal);--name 为容器取个名字; --p hostPort:containerPort 发布(publish)容器端口到主机上; --rm 容器退出时自动清理(ReMove)容器内部的文件系统

# 查看所有运行的容器进程
docker ps

# 查看镜像、容器、数据卷所占用的空间
docker system df

# 无标签镜像也被称为 虚悬镜像(dangling image) ，可以用下面的命令专门显示这类镜像
docker image ls -f dangling=true

# 删除所有虚悬镜像
docker image prune

# 在容器中运行命令
docker exec [OPTIONS] CONTAINER COMMAND [ARG...]
# 常用[OPTION]有: -d 后台(detach)运行程序; -i 保留交互(interactive)页面; -t 分配虚拟终端(terminal)

```

### Docker网络

Docker网络主要有Host、Bridge和None三种，Host就是用主机端口，而Bridge则利用虚拟网桥进行连接，需要进行端口分发，None则是不连接网络，三种情况如下所示，Docker默认使用Bridge模式。

![yVZRzQ.png](https://s3.ax1x.com/2021/01/31/yVZRzQ.png)

网络映射一般在容器启动的时候进行，使用`docker run -p 主机端口:容器端口`进行映射，如果使用的是`-P`，则进行随机端口映射。以下是部分实例：

```docker
# 在后台运行nginx，并把容器的8080端口映射到本机80端口
docker run -d -p 8080:80 nginx
```

### 使用Dockerfile制作镜像

Dockerfile是一个用来构建镜像的文本文件，权威可参考[Docker: Dockerfile参考](https://docs.docker.com/engine/reference/builder/)文本内容包含了一条条构建镜像所需的指令和说明。Dockerfile
一般由5部分组成

1. 注释部分，类似说明，# 开头
2. 基础镜像信息：FROM 开头，语法为`FROM image: tag`
3. 维护者信息：MAINTAINER 开头，语法为`MAINTAINER user <user@example.com>`
4. 构建指令：指定的操作不会在运行的 image 容器上执行，RUN开头。语法为`RUN command`
5. 设置指令：指定的操作在运行的image容器内部执行
  - CMD 指令，语法为`CMD command param1 param2 ……`，如果用户启动容器的时候指定了运行的命令，则会覆盖掉 CMD 指令
  - CMD配合ENTRYPOINT，每个dockerfile中只能有一个ENTRYPOINT，当指定多个时，只有最后一个生效
  - USER（设置容器的用户，默认是root用户）
  - EXPOSE（指定容器需要映射到宿主机的端口），语法为`EXPOSE port <port> ……`
  - ENV（用于设置环境变量），语法为`ENV key value`
  - ADD（从宿主机src目录复制文件到容器的dest目录下），语法为`ADD src dest`
  - VOLUME（指定挂载点），语法为`VOLUME [“/tmp/data”]`
  - WORKDIR（切换目录），可以进行多次切换，对 RUN，CMD，ENTRYPOINT 生效。
  - ONBUILD（在子镜像中执行）

需要注意的是，Dockerfile是没有后缀名的，运行的时候，使用`docker build .`即可运行当前目录下的Dockerfile, 运行完毕则生成镜像，在编译时也可使用`-t name:tag`指定镜像名称和标签，例如`docker build -t nginx:v3 .`。
