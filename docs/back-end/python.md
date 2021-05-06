# Python 常用模块

## 文件与文件夹处理

### 操作文件和文件夹

> 使用的较多的是 os 模块与 shutil 模块。

```py
import shutil

# 创建目录
os.mkdir(path)  # 创建目录，仅能创建最下面一级，如果上级目录不存在则报错
os.makedirs（path）  # 递归创建目录

# 删除文件
os.remove(filepath)  # 删除文件
os.rmdir(dir)  # 删除文件夹，需保证目录为空，否则会报错
shutil.rmtree(path)  # 删除文件夹，无论是否为空

# 展示文件
os.listdir(path)  # 返回路径中所有文件和目录，返回值为列表，例如['1.txt','python','foo.dpf']
os.walk(path)  # 创建生成器对象遍历整个目录树
# 返回的生成器会生成元组(dirpath, dirnames,filenames)
# - dirpath是一个字符串表示路径，
# - dirnames是dirpath中所有子目录的列表
# - filenames是dirpath中所有文件的列表

# 重命名
os.rename(src, dst) # 将原文件或者目录src重命名为dst

# 文件复制与移动

shutil.copy(src,dst)  # 复制一个文件到另一个目录下，返回dst路径。
# dst可以是一个文件，或者是一个目录。但src必须是一个文件，否则会报错。
shutil.copyfile('C:\\1.txt', 'D:\\1.txt')  # 将C盘1.txt复制到D盘1.txt
# 返回值为新拷贝文件地址，src和dst都必须是文件
shutil.copytree('./源目录/', './复制目录/')  # 将目录进行复制, 返回值为新拷贝目录地址
shutil.move（src,dst） # 将路径src处的文件夹移动到路径dst，并返回新位置的绝对路径字符串。
# src可以是一个文件夹，也可以是一个文件。
```

### 操作文件路径

> 使用`os.path`操作文件路径，下面展示`os.path`模块的常用方法，均在 windows 环境下测试。

```py
import os

file = r"D:\迅雷下载\python-docx.pdf"

# 获取目录名
dirname = os.path.dirname(file)  # 输出为：D:\迅雷下载
# 获取文件名全称
basename = os.path.basename(file)  # 输出为：python-docx.pdf
# 获取文件名
filename = os.path.splitext(basename)[0]  # 输出为：python-docx
# 获取文件扩展名
extname = os.path.splitext(basename)[1]  # 输出为：.pdf
# 目录拼接
os.path.join("home","python","learning.pdf")  # 输出为"home/python/learning.pdf"

# 将相对路径转为绝对路径
os.path.abspath("../python/foo")  # 输出为：C:\python\foo
# 判断文件夹是否存在
os.path.exists("../python/foo")  # 输出为False
# 判断路径是文件还是目录
os.path.isfile(path)
os.path.isdir(path)  # 返回值均为True或False
```

## 爬取内容

### requests 模块

requests 是 python 中爬虫使用最多的网络请求模块，api 比较友好，参考网址：[requests 快速上手](https://requests.readthedocs.io/zh_CN/latest/user/quickstart.html)、[requests 高级用法](https://requests.readthedocs.io/zh_CN/latest/user/advanced.html)。

#### 常用操作

**自定义请求头**
服务器反爬虫机制会判断客户端请求头中的User-Agent是否来源于真实浏览器，所以，我们使用Requests经常会指定UA伪装成浏览器发起请求。

```py
url = 'https://httpbin.org/headers'
headers = {'user-agent': 'Mozilla/5.0'}
r = requests.get(url, headers=headers)
```

**参数传递**
很多时候URL后面会有一串很长的参数，为了提高可读性，requests 支持将参数抽离出来作为方法的参数（params）传递过去，而无需附在 URL 后面，例如请求`http://bin.org/get?key=val` ，可使用：

```py
url = "http://httpbin.org/get"
r = requests.get(url, params={"key":"val"})
```

**指定Cookie**
Cookie 是web浏览器登录网站的凭证，虽然 Cookie 也是请求头的一部分，我们可以从中剥离出来，使用 Cookie 参数指定

```py
s = requests.get('http://httpbin.org/cookies', cookies={'from-my': 'browser'})
s.text
```

#### 利用 session 登陆并访问网站

如果想和服务器一直保持登录（会话）状态，而不必每次都指定 cookies，那么可以使用 session，Session 提供的API和 requests 是一样的。手动创建cookie的示例如下：

```py
s = requests.Session()
s.cookies = requests.utils.cookiejar_from_dict({"a": "c"})
r = s.get('http://httpbin.org/cookies')
print(r.text)
```

登录后保存cookie至session的示例代码如下：

```py
import requests

session = requests.Session()  # 获取session实例
# 自定义headers
headers = {
            'user-agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36",
            'accept-encoding': "gzip, deflate",
            'accept-language': "zh-CN,zh;q=0.9,en;q=0.8"
        }
# 登陆网址
login_url = "http://211.103.185.50/home/hytdlogin.cbs"
# 登陆所需的用户名和密码
payload = {'u': 'shiyong', 'p': 'shiyong123'}
# 请求登陆，获取session
response = session.post(login_url, payload, headers=headers, timeout=20)
# 修改返回值编码
response.encoding = "gbk"
```

#### 保存文件

```py
def download_file(url, diretory, name="", min_size=5000):
    """文件下载方法

    Arguments:
        url {String} -- 下载网址
        diretory {String} -- 文件存放地址


    Keyword Arguments:
        name {String} -- 文件名称，带扩展符，例如"test.mp3" (default: {""})
        min_size {int} -- 文件最小大小，默认为5kb，小于此大小不建立文件 (default: {5000})
    """
    # 根据是否传入文件名称，设定下载的文件名
    file_name = ""
    if name:
        file_name = name
    else:
        file_name = url.split('/')[-1]
    file_name = __filename_process(file_name)
    # 如果文件名中不含有.号，则说明传入错误
    if "." not in file_name:
        raise ValueError("传入的网址或者文件名不是下载格式")
    # 文件与目录拼接
    file_name = os.path.join(diretory, file_name)
    # 如果文件存在，则跳过
    if os.path.exists(file_name):
        print("文件[{0}]已经存在".format(file_name))
        return
    # 访问链接
    try:
        response = requests.get(url, stream=True, timeout=20)
    except:
        print("url:" + url)
        print("文件下载错误，错误信息：")
        traceback.print_exc()
        raise RuntimeError("下载文件时出错")
    # 文件过小，则不处理
    try:
        if len(response.content) < min_size:
            return
    except:
        return
    # 如果文件不存在，则分块下载
    if not os.path.exists(file_name):
        with open(file_name, "wb") as f:
            for chunk in response.iter_content(chunk_size=512):
                if chunk:
                    f.write(chunk)
```

### BeautifulSoup 模块

[BeautifulSoup4 文档](https://beautifulsoup.readthedocs.io/zh_CN/v4.4.0/)写的很详细，与 xpath 相比，它输出文本的方法更加科学合理。使用`pip install beautifulsoup4`进行安装，因为 bs4 解析时用到了`lxml`模块，因此也要进行安装`pip install lxml`。

```py
from bs4 import BeautifulSoup  # 导入模块

# 传入html文本，生成soup对象，默认使用lxml对html进行解析
# 如果lxml版本为3.x，则传入“lxml”，如果是4.x的新版本，则传入“html.parser”
soup = BeautifulSoup(html,"lxml")
# 找到H2标题
name = soup.find('h2')
# 找到id为jm的对象
volumn_node = soup.find(id="jm")  # 卷名
```

## 虚拟环境安装

### 使用虚拟环境软件

**1、安装虚拟环境软件**。可以使用virtualenv，安装时使用`pip install virtualenv`

**2、构建python虚拟环境**。首先在cmd中进入安装虚拟环境的指定目录，然后输入`virtualenv + "虚拟环境名称"`，即可在指定目录下生成一个跟"虚拟环境名称"一样的目录，该目录就是虚拟的python环境。

**3、激活虚拟环境**。如果虚拟环境目录是在D:\python_env\test_env中，则进入方式如下：在cmd中，转到D:\python_env\test_env\目录下，然后运行`.\Scripts\activate.bat`即可激活。

**4、取消激活环境**。与激活类似,只是运行的是目录下的`.\Scripts\deactivate.bat`。

### 使用virtualenvwarpper管理虚拟环境

**1、安装virtualenvwarpper-win**。使用命令`pip install virtualenvwrapper-win`。

**2、设置环境变量**。WORKON_HOME为虚拟环境的指定目录。

**3、创建虚拟环境**。运行命令`mkvirtualenv + "虚拟环境名称"`即可创建对应的虚拟环境。

**4、进入虚拟环境**。`workon + "虚拟环境名称"`。

**5、退出虚拟环境**。使用`Deactivate`命令。

## 导出python项目依赖

1、在cmd中输入`pip freeze`可以显示当前虚拟环境中所有的模块名称和对应的版本号，例如

![依赖包](https://pic.imgdb.cn/item/609406ffd1a9ae528f2eb0c2.jpg)

2、输入`pip freeze >requirements.txt`则会在cmd的对应目录生成requirements.txt的文本文件。

3、在另外一个环境安装包，则可以使用如下命令
`pip install -r requirements.txt`。

## Jupyter notebook目录插件安装

1、首先进入命令行，输入下列命令安装jupyter扩展：`pip install jupyter_contrib_nbextensions`

2、然后将扩展进行激活：
`jupyter contrib nbextension install --user`

3、进入jupyter notebook，可以看到插件栏。

![notebook插件栏](https://pic.imgdb.cn/item/6094077ad1a9ae528f3596f7.jpg)

4、在插件栏中勾选`table of contents(2)`，即可激活目录，勾选`Collapsible Headings`，可以使得目录可以折叠。

![notebook插件推荐](https://pic.imgdb.cn/item/609407c1d1a9ae528f3963d4.jpg)

## Jupyter notebook修改启动目录

1、首先在cmd中运行“jupyter notebook --generate-config”，将会生成配置文件。

2、在配置文件中，修改`c.NotebookApp.notebook_dir = 'D:\\Notebook'`，即可在D:\Notebook文件夹中打开。

## 设置python源

使用时, 临时指定源的命令为: `pip install [模块名] -i https://pypi.doubanio.com/simple
`, 全局设置在文件`%APPDATA%\pip\pip.ini`中, 例如`C:\Users\weiwe\AppData\Roaming\pip\pip.ini`设置如下:

```ini
[global]
timeout = 600
index-url = https://pypi.doubanio.com/simple
trusted-host = pypi.doubanio.com
[list]
format = columns
```

其中，timeout：设置超时时间，index-url：指定下载源，trusted-host：指定域名。


## python离线安装外部依赖包

1、制作requirement.txt，使用`pip freeze > requirement.txt`

2、在外网下载外部依赖包办法：

离线下载单个离线包，命令： `pip download -d your_offline_packages <package_name>`

批量下载离线包，命令：`pip download -d your_offline_packages -r requirements.txt`。

3、在内网离线安装方法：
安装单个离线包，命令：`pip install --no-index --find-links=/your_offline_packages/ package_name`

批量安装离线包，命令：`pip install --no-index --find-links=/your_offline_packages/ -r requirements.txt`

## 嵌入式python

**1、下载embedded包**。在[python官网](https://www.python.org/downloads/windows/)下载python3的embedded版本。因为64位exe可能不支持32位系统，推荐下载x86的zip包，[下载地址](https://www.python.org/ftp/python/3.7.4/python-3.7.4-embed-win32.zip)。

**2、安装pip**。解压zip包之后，找到python-embedded文件夹下的python37._pth文件，打开之后把

```python
  # import site
```

前面的注释符号`#`删除后保存，然后从[pip官网](https://pip.pypa.io/en/stable/installing/#id7)下载get-pip.py，下载地址是：[https://bootstrap.pypa.io/get-pip.py](https://bootstrap.pypa.io/get-pip.py)，然后调用嵌入式python中的`python get-pip.py`命令。

如果没有去掉import site前面的注释，直接执行`python get-pip.py`命令会报错，错误代码为:

```batch
Traceback (most recent call last):
File "D:\obj\Windows-Release\37win32_Release\msi_python\zip_win32\runpy.py", line 193, in _run_module_as_main
File "D:\obj\Windows-Release\37win32_Release\msi_python\zip_win32\runpy.py", line 85, in _run_code
File "F:\python-3.7.3-embed-win32\Scripts\pip.exe\__main__.py", line 5, in <module>
ModuleNotFoundError: No module named 'pip'

```

**3、安装Tk/Tcl**。由于嵌入式python版本比较低，手动安装Tk/Tcl模块，这些模块主要用于图形界面，操作流程如下：

1. 从完整版python路径\Lib\tkinter，复制到python-embedded\python37.zip，需要注意的是，完整版python需要跟嵌入式python的版本尽可能一致，是复制到zip包里面去，不是文件夹。
2. 将完整版python中的三个文件_tkinter.pyd、tcl86t.dll和tk86t.dll复制到嵌入式python的根目录中，这三个文件位置在完整版python的DLLs文件夹中。
3. 将完整版python文件夹根目录的tcl的文件夹，复制到嵌入式python的根目录。

上面三个步骤完成之后，嵌入式python就可以安装各种第三方库了，实测包括wxpython，numpy，matplotlib，opencv-python，Pillow等等。

:warning: ==如何生成exe文件==，生成的exe文件在运行过程中如何隐藏cmd的黑框，有两种方式可以使用。

一是使用gcc编译c语言代码，调用命令行的"python.exe xx.py",安装gcc的方法如下：

a. 使用MinGW(http://www.mingw.org)下载软件,MinGW的下载地址为:https://sourceforge.net/projects/mingw/files/MinGW/

b. 下载完毕后安装MinGW，然后把安装位置对应的bin文件加入path目录，例如d:\\Mingw\\bin

c. 使用MingW软件安装gcc，命令行安装方式为：`mingw-get install gcc`

d. 使用gcc编译exe文件，利用gcc xxx.c -o xxx.exe，c文件实例为：
```c
#include<stdio.h>
#include<stdlib.h>
int main()
{
	system("python-3.7.3-embed-win32\\python.exe python-3.7.3-embed-win32\\test.py");
	return 0;
}
```
==注意== ：采用该方法无法隐藏cmd的黑色窗口，效果不是太好，可以使用第二个办法进行。

 二是使用pyinstaller编译python代码

a. 新建run.py, py文件的写法事例如下，该方法不弹出cmd窗口：

```python
from subprocess import run
run("python-3.7.3\\python.exe hello.py",shell=True)
```

b. 在完整版python中安装模块pyinstaller，安装命令为`pip install pyinstaller`。

c. 使用pyinstaller仅编译刚刚写的run.py文件, -F表示生成单个文件，-w表示隐藏cmd窗口，完整命令如下: `pyinstaller.exe -F .\run.py -w`
在.\dist目录下生成的run.exe就可以正常使用了。

## 动态增加当前模块的搜索路径

在pycharm中，IDE会自动将当前项目路径加入到python的模块搜索路径当中，但是在cmd中并不会自动添加，因此需要根据当前路径的位置动态填写模块搜索路径，其代码写法如下：

```python
import os, sys
# 动态增加模块搜索路径
sys.path.append(os.getcwd())
```