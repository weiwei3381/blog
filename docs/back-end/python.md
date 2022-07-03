# Python 常用操作笔记

## 文件与文件夹处理

### 动态增加当前模块的搜索路径

在pycharm中，IDE会自动将当前项目路径加入到python的模块搜索路径当中，但是在cmd中并不会自动添加，因此需要根据当前路径的位置动态填写模块搜索路径，其代码写法如下：

```python
import os, sys
# 动态增加模块搜索路径
sys.path.append(os.getcwd())
```

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
os.path.getsize(path)  # 获取文件大小，单位为字节

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

## Python日期处理

```python
# 获得当前日期的“YYYY-MM-DD HH:mm:SS”格式

import time
time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time()))

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

BeautifulSoup4是一个html文件解析库，[BeautifulSoup4 文档](https://beautifulsoup.readthedocs.io/zh_CN/v4.4.0/)写的很详细，与 xpath 相比，它能够方便的输出文本。

1.安装方法：使用`pip install beautifulsoup4`进行安装，导入使用`from bs4 import BeautifulSoup`，bs4使用时用到了`lxml`模块，因此也要进行安装`pip install lxml`。

```py
from bs4 import BeautifulSoup  # 导入模块

# 传入html文本，生成soup对象，默认使用lxml对html进行解析
# 如果lxml版本为3.x，则传入“lxml”，如果是4.x的新版本，则传入“html.parser”
soup = BeautifulSoup(html,"lxml")

```

2.找到指定标签的对象

```py
# 找到第一个H2标题
name = soup.find('h2')

# 找到所有的H2标题
name_list = soup.find_all('h2')

# 找到所有的H1和H2标题
soup.find_all(['h1','h2'])

# 使用正则表达式匹配标签，找到所有h开头的标签，例如h1,h2,h3
import re
soup.find_all(re.compile('^h'))
```

3.找到指定id的对象

```py
# 找到id为jm的对象
volumn_node = soup.find(id="jm")

# 找到a标签，而且id为logo的对象
volumn_node = soup.find('a', id="logo")

# 找到所有p标签中，id是p1或p2的对象
soup.find_all('p', attrs={'id':['p1','p2']})

# 使用正则表达式查找
soup.find_all('p', attrs={'id':re.compile('^p')}) # 

```

4.找到指定class的对象

```py
# 找到class为"summary"的div标签
soup.find("div", class_="summary")

# 找到class为"summary logo"的div标签
soup.find("div", class_="summary logo")

# 也可以用dict形式查找
soup.find('div', attrs={'class':'summary'})

# 查找所有对象则使用find_all
soup.find_all('div', attrs={'class':'summary'})

# 查找所有p对象，且含有class属性即可
soup.find_all('p', attrs={'class':True})
```

5.复合查找，使用多个属性匹配

```py
# 找到class为p3, id为pp的p标签对象
soup.find_all('p', attrs={'class':'p3','id':'pp'}) 

# 找到class为p3, 没有id属性的所有p标签对象
soup.find_all('p', attrs={'class':'p3','id':False}) # 指定不能有某个属性

```

6.查找子节点、孙节点和父节点

```python
# 拿到所有正文下的子节点
soup.find("div", id="words-box").children
# 通过 .parent 属性来获取某个元素的父节点
# 通过元素的 .parents 属性可以递归得到元素的所有父辈节点
# 通过元素的 .next_sibling获得下一个兄弟节点，.previous_sibling获得上一个兄弟节点
```

7.使用**css选择器**选择节点，使用`.select`方法

```python
# 选择所有title标签
soup.select("title")

# 选择所有p标签中的第三个标签
soup.select("p:nth-of-type(3)") # 相当于soup.select(p)[2]

# 选择body标签下的所有a标签
soup.select("body a")

# 选择body标签下的直接a子标签
soup.select("body > a")

# 选择id=link1后的所有兄弟节点标签
soup.select("#link1 ~ .mysis")

# 选择id=link1后的下一个兄弟节点标签
soup.select("#link1 + .mysis")

# 选择a标签，其类属性为mysis的标签
soup.select("a.mysis")

# 选择a标签，其id属性为link1的标签
soup.select("a#link1")

# 选择a标签，其属性中存在myname的所有标签
soup.select("a[myname]")

# 选择a标签，其属性href=http://example.com/lacie的所有标签
soup.select("a[href='http://example.com/lacie']")

# 选择a标签，其href属性以http开头
soup.select('a[href^="http"]')

# 选择a标签，其href属性以lacie结尾
soup.select('a[href$="lacie"]')

# 选择a标签，其href属性包含.com
soup.select('a[href*=".com"]')

# 从html中排除某标签，此时soup中不再有script标签
[s.extract() for s in soup('script')]

# 如果想排除多个呢
[s.extract() for s in soup(['script','fram']
```

8.提取文本内容

```py
# 使用.text, 或者.strings提取文本内容
soup.p.text
for p in soup.find_all('p'):
    print(p.text)
    # 可以通过参数指定tag的文本内容的分隔符, 还可以去除获得文本内容的前后空白:
    print(p.get_text("\n", strip=True))

# 默认不同

# 提取标签部分文本内容
# 对于下面的html文件，想只要提取World
html = """
<li>
    <span class="hello"> Hello</span>
World
</li>
"""
a, b = soup.find('li').stripped_strings # 此时a为hello， b为world
```

9.提取其他属性

```py
soup = BeautifulSoup(a, 'html.parser')
for i in soup.body.find_all(True):
    print(i.name) # 提取标签名
    print(i.attrs) # 提取标签所有属性值
    print(i.has_attr('href')) # 检查标签是否有某属性
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

## Jupyter Notebook操作

### Jupyter notebook目录插件安装

1、首先进入命令行，输入下列命令安装jupyter扩展：`pip install jupyter_contrib_nbextensions`

2、然后将扩展进行激活：
`jupyter contrib nbextension install --user`

3、进入jupyter notebook，可以看到插件栏。

![notebook插件栏](https://pic.imgdb.cn/item/6094077ad1a9ae528f3596f7.jpg)

4、在插件栏中勾选`table of contents(2)`，即可激活目录，勾选`Collapsible Headings`，可以使得目录可以折叠。

![notebook插件推荐](https://pic.imgdb.cn/item/609407c1d1a9ae528f3963d4.jpg)

### Jupyter notebook修改启动目录

1、首先在cmd中运行“jupyter notebook --generate-config”，将会生成配置文件。

2、在配置文件中，修改`c.NotebookApp.notebook_dir = 'D:\\Notebook'`，即可在D:\Notebook文件夹中打开。

## Python包安装

### 设置python源

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

### python离线安装外部依赖包

1、制作requirement.txt，使用`pip freeze > requirement.txt`

2、在外网下载外部依赖包办法：

离线下载单个离线包，命令： `pip download -d your_offline_packages <package_name>`

批量下载离线包，命令：`pip download -d your_offline_packages -r requirements.txt`。

3、在内网离线安装方法：
安装单个离线包，命令：`pip install --no-index --find-links=/your_offline_packages/ package_name`

批量安装离线包，命令：`pip install --no-index --find-links=/your_offline_packages/ -r requirements.txt`

### 嵌入式python

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

a. 使用MinGW(<http://www.mingw.org)下载软件,MinGW的下载地址为:https://sourceforge.net/projects/mingw/files/MinGW/>

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

## whoosh源码学习

### python2与python3兼容

whoos兼容py2和py3，其兼容模块源码在`compat.py`文件中，以下记录学习情况。

#### 除法兼容

python2本来的除号`/`对于分子分母是整数的情况会取整，但新特性中在此情况下的除法不会取整，取整需要使用符号`//`。

```python
3/5  # 默认在python2中使用输出为0
# 导入__feature__模块
from __future__ import division

3/5  # 输出0.6
3//5  # 输出0
```

#### print和with方法兼容

```python
# print()方法兼容
from __future__ import print_function
# 允许在 Python 2.5 中使用 with 语句，但它是 Python 2.6语言的一部分
from __future__ import with_statement

```

#### items兼容

在python2中，`items()`函数是将一个字典以列表的形式返回，因为字典是无序的，所以返回的列表也是无序的。`iteritems()`则是返回`item()`方法的迭代器版本。

在python3中，`iteritems()`函数已经被废弃，只，只留下`item()`方法，效果和原有的`iteritems()`一致，因此，需要进行兼容

```python

# 在python2中
a = {'a':1,'b':3}
a.items()
# 返回a = [('a',1),('b',3)]

# iteritems()返回一个迭代器
b = a.iteritems()
for k,v in b:     
    print k,v

# 在python3中
a.items()  # 输出dict_items([('a', 1), ('b', 3)])

类似的，itervalues, iterkeys也有类似方法，兼容代码的写法如下

# 兼容代码
import sys
# 如果是python2，直接用就是了
if sys.version_info[0] < 3:
    PY3 = False
    iteritems = lambda o: o.iteritems()
    itervalues = lambda o: o.itervalues()
    iterkeys = lambda o: o.iterkeys()
else:
    # 否则用lambda函数包装一下，确保接口一致
    PY3 = True
    iteritems = lambda o: o.items()
    itervalues = lambda o: o.values()
    iterkeys = lambda o: iter(o.keys())
```

### python2与python3的版本转换

在电脑上装多个python版本后, 如果需要进行python的版本转换, 可以先在**用户环境变量**中设置变量`PYTHON_HOME`, 例如对于python2.7, 设置为`C:\python27`, 然后用户环境变量的Path中添加`%PYTHON_HOME%\Scripts\;%PYTHON_HOME%\;`, 如果需要切换到python3版本, 假如安装位置为`C:\Users\weiwe\AppData\Local\Programs\Python\Python37`, 那么直接在**用户环境变量**修改变量`PYTHON_HOME`为`C:\Users\weiwe\AppData\Local\Programs\Python\Python37`即可, 当然, 更方便的是用批处理让系统自动更换, 批处理代码如下:

```batch
@echo off
if %PYTHON_HOME%==C:\Python27 (
echo set python to 3.7.8
setx PYTHON_HOME "C:\Users\weiwe\AppData\Local\Programs\Python\Python37"
) else (
echo set python to 2.7.10
setx PYTHON_HOME "C:\Python27"
)

pause
```

## Python IDE设置

### PyCharm设置python文件初始化模板

达到的效果就是：每次新建python文件，则按照模板生成新文件。

打开`pycharm`，选择`File`-`Setting`，之后进入`Editor`-`File and Code Templates`窗口

然后点击`Python Script`，左侧输入python模板

```python
# coding: utf-8
# @Time : ${DATE} ${TIME}
# @Author : wowbat
# @File : ${NAME}.py
# @Describe: 


if __name__ == "__main__":
    pass
```

如下图所示：

![python模板](https://ftp.bmp.ovh/imgs/2021/12/19f62c97654e0082.png)

## gensim进行词向量学习

词向量依赖gensim和jieba模块，使用`pip install jieba gensim`进行安装。

### 将语料库进行分词处理

```python
def cut_text(text):
    """
    对text字符串进行分词，词与词之间按空格分开
    :param text: 传入字符串
    :return: 空格分开的字符串
    """
    return " ".join([segment for segment in jieba.cut(text)])
```

### 训练中文词向量

部分代码参考官方文档[gensim-word2vec](https://radimrehurek.com/gensim/models/word2vec.html)，其他参考链接有：[gensim训练word2vec及相关函数与功能理解](https://blog.csdn.net/sinat_26917383/article/details/69803018)

```python
from gensim.models import Word2Vec
from gensim.models.word2vec import LineSentence

def train_zh_vector():
    # 训练数据文件名
    data_file = r'.\zh_word_vector\zh_segment_text.txt'
    # 保存的模型文件名
    model_file = r'.\zh_word_vector\zh.model'
    vector_file = r'.\zh_word_vector\zh.vector'

    # data_file是用空格分隔的文本数据
    model = Word2Vec(sentences=LineSentence(data_file), vector_size=100)
    # 保存模型文件，保存的文件可以继续训练
    model.save(model_file)
    # 保存成key-value格式的文件，不可以再训练
    model.wv.save_word2vec_format(vector_file, binary=False)
```

训练是流式传输的，因此`Word2Vec`类中的`sentences`参数传入的语料库对象需是可迭代的，即时从磁盘或网络读取输入数据，而无需将整个语料库加载到内存中。请注意，sentencesiterable 必须是可重新启动的（不仅仅是生成器），以允许训练算法在数据集上多次流式传输进行训练。有关流式迭代的一些示例，请BrownCorpus参阅 Text8Corpus或LineSentence。

其中`gensim.models.word2vec.LineSentence`类是遍历包含句子的文件，每一行就是一个句子，其中单词必须已经过预处理并由空格分隔。API定义如下:`LineSentence(source, max_sentence_length=10000, limit=None)`。传入参数：

- **source** ( 字符串或者file-like对象) -- 磁盘上文件的路径，或者已经打开的文件对象（必须支持seek(O)）。
- **limit** ( 整型或None ) – 将文件剪辑限制到前limit行，如果limit为None（默认值），则不进行剪辑。

gensim.models.word2vec.Word2Vec传入的参数列表如下：

- **sentences**(可迭代对象，可选项)：供训练的句子，可以使用简单的列表，但是对于大语料库，建议直接从磁盘/网络流迭代传输句子，可使用word2vec模块中的BrownCorpus，Text8Corpus或LineSentence。如果不提供sentence，模型将保持未初始化 - 如果您打算以其他方式初始化它，则不需要传入该参数。
- corpus_file (str, 可选)：LineSentence格式的语料库文件路径。只需要传递一个sentences或corpus_file参数（或者它们都不传递，在这种情况下，模型未初始化）。
- **vector_size**(int, 可选)：词向量的维度。
- window(int, 可选)：句子中当前单词和预测单词之间的最大距离。
- **min_count**(int, 可选)：忽略总频率低于此值的所有单词。
- workers (int, 可选) – 训练模型时使用的线程数。
- sg ({0, 1}, 可选) – 模型的训练算法: 1: skip-gram; 0: CBOW.
- hs ({0, 1}, 可选) – 1: 采用hierarchical softmax训练模型; 0: 使用负采样。
- negative (int, 可选) – 如果negative>0则使用负采样，传入值指定应绘制多少“噪声词”（通常在 5-20 之间）。如果设置为 0，则不使用负采样。
- ns_exponent (float, 可选) – 负采样分布指数。1.0 的值与频率完全成比例地采样，0.0 对所有词的采样均等，而负值对低频词的采样多于高频词。流行的默认值 0.75 是由原始 Word2Vec 论文选择的。最近，在<https://arxiv.org/abs/1804.04212中，Caselles-Dupré、Lesaint> 和 Royo-Letelier 建议其他值可能在推荐应用中表现更好。
- cbow_mean ( {0 , 1} , 可选 ) – 如果为 0，则使用上下文词向量的总和。如果为 1，则使用平均值，仅在使用 cbow 时适用。
- alpha ( float , 可选 ) -- 初始学习率。
- min_alpha ( float , 可选 ) – 随着训练的进行，学习率将线性下降到min_alpha。
- seed ( int , 可选 ) -- 随机数生成器的种子。每个单词的初始向量都使用单词 + str(seed)连接的哈希值作为种子。请注意，对于完全确定性可重现的运行，您还必须将模型限制为单个工作线程 ( worker=1 )，以消除 OS 线程调度的排序抖动。（在 Python 3 中，解释器启动之间的可重复性还需要使用PYTHONHASHSEED环境变量来控制哈希随机化）。
- max_vocab_size ( int , 可选 ) – 在词汇构建期间限制 RAM；如果有比这更多的独特词，则修剪不常见的词。每 1000 万个单词类型需要大约 1GB 的 RAM。设置为None表示无限制。
- **max_final_vocab** ( int , 可选 ) -- 通过自动选择匹配的 min_count 将词汇限制为目标词汇大小。如果指定的 min_count 大于计算的 min_count，则将使用指定的 min_count。如果不需要，设置为无。
- **sample** ( float , 可选 ) -- 配置哪些高频词被随机下采样的阈值，有用的范围是 (0, 1e-5)。
- hashfxn ( function , 可选 ) – 用于随机初始化权重的哈希函数，以提高训练的可重复性。
- **epochs** ( int , 可选 ) -- 语料库上的迭代次数（epochs）。（以前使用iter参数）
- trim_rule（函数，可选）–词汇修剪规则，指定某些单词是否应保留在词汇表中，被修剪掉，还是使用默认值处理（如果字数 < min_count 则丢弃）。可以是 None （将使用 min_count，查看keep_vocab_item()），或接受参数（word、count、min_count）并返回 或 的可 调用gensim.utils.RULE_DISCARD对象。该规则（如果给定）仅用于在 build_vocab() 期间修剪词汇，并且不存储为模型的一部分。
- sorted_vocab ( {0 , 1} , 可选 ) -- 如果为 1，则在分配词索引之前按频率降序对词汇进行排序。
- batch_words ( int , 可选 ) – 传递给工作线程（以及 cython 例程）的批量示例的目标大小（以字为单位）。（如果单个文本超过 10000 个单词，则将传递更大的批次，但标准 cython 代码会截断为那个最大值。）
- compute_loss ( bool , 可选 ) -- 如果为 True，则计算并存储可以使用 检索的损失值 get_latest_training_loss()。
- callbacks (iterable of CallbackAny2Vec, 可选) -- 在训练期间的特定阶段执行的回调序列。
- shrink_windows ( bool , 可选 ) – 4.1 中的新功能。实验性的。如果为 True，则在训练期间从 [1, window ] 中为每个目标词统一采样有效窗口大小，以匹配原始 word2vec 算法按距离对上下文词的近似加权。否则，有效窗口大小始终固定为任一侧的窗口字。

训练好的词向量存储在一个KeyedVectors实例中，如model.wv

```python
vector = model.wv['博士']  # 查看模型中的“博士”的词向量
sims = model.wv.most_similar('博士', topn=10)  # 查看模型中“博士”最相似的10个单词，返回值如下：
# [('硕士', 0.9329454302787781), ('博士生', 0.8901451826095581), ('研究生', 0.8672683238983154), 
# ('攻读', 0.838356077671051), ('本科生', 0.8022567629814148), ('计算机专业', 0.7955326437950134), 
# ('导师', 0.7760775685310364), ('高材生', 0.771659791469574), ('本科', 0.7638741731643677), ('清华大学', 0.7636148929595947)]
```

如果保存模型，可以稍后继续训练：

```python
model = Word2Vec.load("word2vec.model")
model.train([["hello", "world"]], total_examples=1, epochs=1)
```

如果保存的是wv模型，也可以加载，但是不能继续训练了。将训练好的向量分离为KeyedVectors的原因是，如果您不再需要完整的模型状态（不需要继续训练），可以丢弃其状态，只保留向量及其键。这导致了一个更小更快的对象，可以快速映射，并在进程之间共享 RAM 中的向量。由于缺少隐藏的权重、词汇频率和二叉树，wv模型不能继续训练。要继续训练，您需要完整的Word2Vec对象状态，由save()存储，而不仅仅是KeyedVectors。

model.train方法可以传入的参数较多，`train( corpus_iterable = None , corpus_file = None , total_examples = None , total_words = None , epochs = None , start_alpha = None , end_alpha = None , word_count = 0 , queue_factor = 2 , report_delay = 1.0 , compute_loss = False , callbacks = () ,** kwargs )`，各参数的释义如下：

- corpus_iterable (可迭代的 str 列表)： corpus_iterable可以只是token列表的列表，但对于较大的语料库，请考虑直接从磁盘/网络流式传输句子的迭代，以限制 RAM 使用。有关此类示例BrownCorpus，请参见Text8Corpus 或LineSentence在模块中。
- corpus_file：LineSentence格式的语料库文件路径。只需要传递一个corpus_iterable或corpus_file参数（或者它们都不传递，在这种情况下，模型未初始化）。
- total_examples ( int ) -- 句子数。
- total_words ( int ) -- 句子中原始单词的计数。
- epochs ( int ) -- 语料库上的迭代次数（epochs）。
- start_alpha ( float , optional ) – 初始学习率。如果提供，则替换构造函数中的起始alpha，用于调用`train()`。仅在多次调用train()时使用，当您想自己管理 alpha 学习率时（不推荐）。
- end_alpha ( float , optional ) – 最终学习率。从start_alpha线性下降。如果提供，这将替换构造函数中的最终min_alpha，用于调用train()。仅在多次调用train()时使用，当您想自己管理 alpha 学习率时（不推荐）。
- word_count ( int , optional ) -- 已经训练的单词数。将此设置为 0 以用于训练句子中所有单词的通常情况。
- queue_factor ( int , optional ) -- 队列大小的乘数（工作人员数量 * queue_factor）。
- report_delay ( float , optional ) -- 报告进度前等待的秒数。
- compute_loss ( bool , optional ) -- 如果为 True，则计算并存储可以使用 检索的损失值 get_latest_training_loss()。
- callbacks (iterable of CallbackAny2Vec, optional) -- 在训练期间的特定阶段执行的回调序列。

为了支持从（初始）alpha到min_alpha的线性学习率衰减，以及准确的进度百分比记录，必须提供**total_examples**（句子计数）或**total_words**（句子中原始单词的计数）。如果句子与之前提供的语料库相同，您可以简单地使用`total_examples=self.corpus_count`。也可是使用`build_vocab()`方法构建，如下所示。

```python
# 增量训练
model = gensim.models.Word2Vec.load(temp_path)
more_sentences = [['Advanced', 'users', 'can', 'load', 'a', 'model', 'and', 'continue', 'training', 'it', 'with', 'more', 'sentences']]
model.build_vocab(more_sentences, update=True)
model.train(more_sentences, total_examples=model.corpus_count, epochs=model.iter)
```

词向量应用：

```python
# 加载wv模型的方法
wv = gensim.models.keyedvectors.KeyedVectors.load_word2vec_format(vector_file)
# 也可以使用wv相关的方法
print(wv.most_similar('系统', topn=10))
```

## python操作pdf

### pdf文件重新排序

考虑到之前用高拍仪扫描时，文件经常奇数页和偶数页不清楚，每次需要人工来排序，因此写了一个软件让其自动排序，需要传入两个参数，分别是待排序的pdf位置和顺序值，顺序的话自定义了一种表示方法，即单页面和连续页面混用，连续页面参考range函数，可以用一个元胞例代表一系列的值, 例如(1,11,2)代表从1开始到11结束, 每次递增2，即形成"1,3,5,7,9,11"这些顺序，而"(16,2,-2)"则表示从16开始到2,每次递增-2(即减少2),形成"16,14,12,10,8,6,4,2"顺序，单个数字也可以用，例如12,13等，不需要的页面可以用0表示，

如果传入的顺序参数为："(1,9,2),0,11,(12,2,-2)"，则pdf文件真实顺序是"[1, 3, 5, 7, 9, 0, 11, 12, 10, 8, 6, 4, 2]"

以下为脚本代码示例：

```python
import re
from os import path
from PyPDF2 import PdfFileReader, PdfFileWriter


def generate_list(start, end, separate):
    """
    根据开始和结束产生列表
    :param start:
    :param end:
    :param separate:
    :return:
    """
    if start == end: raise Exception("开始序号{}不应该等于结束序号{}".format(start, end))

    result_list = []  # 最终生成的结果序列
    if start > end:
        if separate >= 0: raise Exception("开始序号大于结束序号, 间隔错误的等于{}, 应该小于0".format(separate))
        result_list.append(start)
        start += separate
        while end <= start:
            result_list.append(start)
            start += separate
        if result_list[-1] != end: raise Exception("结束序号不正确, 按间隔取值得到{}, 不等于结束序号{}".format(start, end))
        return result_list

    if start < end:
        if separate <= 0: raise Exception("开始序号小于结束序号, 间隔错误的等于{}, 应该大于0".format(separate))
        result_list.append(start)
        start += separate
        while end >= start:
            result_list.append(start)
            start += separate
        if result_list[-1] != end:
            raise Exception("结束序号不正确, 按间隔取值得到{}, 不等于结束序号{}".format(start, end))
        return result_list


def resolve_one_part(args):
    match_obj = re.match(r'\(.+?\)', args)
    if match_obj:
        match_str = match_obj[0]
        resolve_str = re.match(r'\((\d+),(\d+),(-?\d+)\)', match_str)  # 解析参数
        if resolve_str and len(resolve_str.groups()) == 3:
            start, end, separate = resolve_str.groups()
            return {
                "span": len(match_str),
                "list": generate_list(int(start), int(end), int(separate))
            }
        else:
            raise Exception("传入参数解析到{}时出现错误, 应该是3个参数, 例如:(13,5,2)".format(match_str))
    else:
        match_obj = re.match(r'\d+', args)
        if match_obj:
            match_str = match_obj[0]
            return {
                "span": len(match_str),
                "list": [int(match_str)]
            }
    # 如果没有解析到对象, 则报错
    if match_obj is None:
        raise Exception("传入参数解析到{}步时出现错误".format(args))


def analysis_args(args_str):
    """
    解析传入的pdf顺序参数
    :param args_str: 参数顺序
    :return: list, 详细描述pdf中每一页的顺序, 需要留下来的页面顺序必须大于0, 因为不需要的页面顺序用0表示,
    描述时参考python的range函数, 可以用一个元胞例代表一系列的值, 例如(1,11,2)代表从1开始到11结束, 每次递增2, 即形成"1,3,5,7,9,11"这些顺序
    例如"(16,2,-2)"则表示从16开始到2,每次递增-2(即减少2),形成"16,14,12,10,8,6,4,2"顺序, 单个数字也可以用, 例如12,13等,
    不需要的页面可以用0表示
    整体参数示例: "(1,9,2),0,11,(12,2,-2)"变为"[1, 3, 5, 7, 9, 0, 11, 12, 10, 8, 6, 4, 2]"
    """
    args_str = args_str.replace(" ", "")
    result_list = []
    while len(args_str) > 0:
        part_result = resolve_one_part(args_str)
        result_list.extend(part_result['list'])
        span = part_result['span']  # 部分结果的跨度
        args_str = args_str[span:]
        if len(args_str) > 0:
            if not args_str.startswith(","): raise Exception('解析到{}出现问题, 元素之间应该用","符号分割'.format(args_str))
            args_str = args_str[1:]
    return result_list


def sort_pdf(pdf_path, sort_args):
    """
    给pdf排序
    :param pdf_path: pdf文件路径
    :param sort_args: 排序参数, 将原有pdf所有页面的顺序进行描述, 例如pdf顺序是1,3,5,7,9,11,13,13(重复),12,10,8,6,4,2,
    那么就可以用(1,9,2),11,13,0,(12,2,-2)的参数进行描述, 如果其中有一页不需要, 则该页的位置排序为0
    :return:
    """
    pdf_reader = PdfFileReader(pdf_path)
    pdf_writer = PdfFileWriter()
    pdf_num = pdf_reader.getNumPages()  # pdf页码数量
    sort_list = analysis_args(sort_args)
    max_page_no = max(sort_list)  # 页码的最大值
    doc_path = path.expanduser('~\Documents')
    save_path = path.join(doc_path, "sorted.pdf")

    for i in range(1, max_page_no + 1):
        if i in sort_list:
            list_index = sort_list.index(i)
            if list_index > pdf_num - 1: raise Exception('传入的页码数{}超过pdf页码总数{}'.format(list_index, pdf_num))
            pdf_writer.addPage(pdf_reader.getPage(list_index))
    with open(save_path, 'wb') as f:
        pdf_writer.write(f)
    return save_path


if __name__ == "__main__":
    # print(analysis_args("(1,9,2),0,11,(12,2,-2)"))
    print("""
    【欢迎使用pdf顺序重排软件】
    在pdf页码参数中, 需要详细描述pdf中每一页的顺序, 需要留下来的页面顺序必须大于0, 
    描述时参考python的range函数, 可以用一个元胞例代表一系列的值, 例如(1,11,2)代表从1开始到11结束, 每次递增2, 
    即形成"1,3,5,7,9,11"这些顺序,
    例如"(16,2,-2)"则表示从16开始到2,每次递增-2(即减少2),形成"16,14,12,10,8,6,4,2"顺序, 单个数字也可以用, 例如12,13等,
    不需要的页面可以用0表示
    示例: "(1,9,2),0,11,(12,2,-2)"变为"[1, 3, 5, 7, 9, 0, 11, 12, 10, 8, 6, 4, 2]"
    """)
    while True:
        try:
            pdf_path = input("请输入pdf文件位置: ")
            pdf_sort_args = input("请输入页码参数: ")
            save_path = sort_pdf(pdf_path, pdf_sort_args)
            print("文件生成成功, 位置在[{}]".format(save_path))
        except Exception as e:
            print("出现错误: {}".format(e))
```

已经打包好的exe文件可以[直接下载](https://wws.lanzoum.com/izYP807b1mif)。

### pdf文件切分

使用有道文档翻译对pdf文件大小有限制，因此有个这个脚本，它可以将指定pdf文件切分为指定大小的若干个部分，默认为10MB以内，修改`PDF_PATH`参数即可。

```python
import os
from PyPDF2 import PdfFileReader, PdfFileWriter

# pdf文件路径
PDF_PATH = r"E:\Downloads\ARN33195-ATP_7-100.3-000-WEB-1.pdf"

# 限制的文件大小，单位为字节，默认为10MiB
SIZE_NUM = 10*1024*1024

# 每次修订时增加或者减少的页数
BATCH = 3

def pdf_split_by_size():
    """
    根据文件大小对pdf进行分割
    :return:
    """
    f_size = os.path.getsize(PDF_PATH)  # pdf文件大小
    split_num = (f_size // SIZE_NUM) + 2  # 分割的文件数量
    split_file_size = f_size // split_num  # 单个文件大小
    pdf = PdfFileReader(PDF_PATH)
    page_nums = pdf.getNumPages()  # 获得页数
    mean_page_size = f_size // page_nums  # 平均页面大小
    benchmark_page_num = split_file_size // mean_page_size  #  平均每次页面数量 基准值

    i = 1  # 指针
    start = 1  # 每次合并的开始页面
    while True:
        i = i + benchmark_page_num
        # 如果指针大于总页数，则将其设置为总页数
        if i > page_nums:
            i = page_nums
        start = _amend_pdf_size(start, i, page_nums) + 1
        # 运行结束条件到达最后一页
        if start >= page_nums:
            break
        i = start
    print("运行结束")

def _amend_pdf_size(start, i, page_nums):
    """
    修正pdf文件大小
    :param start: 开始页数
    :param i: 结束（浮动页数）
    :param page_nums: 总页数
    :return:
    """
    float_i = i  # 浮动页面
    pdf = pdf_split_2(start, float_i)
    # 如果比要求的文件大，则反复减少
    while os.path.getsize(pdf) > SIZE_NUM:
        os.remove(pdf)
        float_i = float_i - BATCH  # 每次浮动页数减少BATCH页
        pdf = pdf_split_2(start, float_i)
    # 如果文件太小了，则将其增大
    while os.path.getsize(pdf) < SIZE_NUM * 0.75:
        # 如果到达最后一页，则跳出
        if float_i == page_nums:
            break
        os.remove(pdf)
        float_i = float_i + BATCH  # 每次浮动页数增加BATCH页
        # 文件太小了，增大时需要考虑浮动页数不能超过总页数
        if float_i > page_nums:
            float_i = page_nums
        pdf = pdf_split_2(start, float_i)
    return float_i

def pdf_split_2(start, end):
    """
    将目标PDF文件的start至end页分割保存至指定文件夹，
    :param start: start从1开始计数
    :param end: 尾页
    :return: 生成的文件完整路径
    """
    print("调用参数为%s-%s" %(start,end))
    fname = os.path.splitext(os.path.basename(PDF_PATH))[0]  # 获取文件名，不含后缀名
    fpath = os.path.dirname(PDF_PATH)
    pdf = PdfFileReader(PDF_PATH)
    pdf_writer = PdfFileWriter()
    output_filename = fpath + r'\{}_{}-{}.pdf'.format(fname, start, end)
    # output_filename = os.path.join(path_output, '{}_{}-{}.pdf'.format(fname,start,end))  # 等价

    for page in range(start - 1, end):
        pdf_writer.addPage(pdf.getPage(page))

    with open(output_filename, 'wb') as out:
        pdf_writer.write(out)
    return output_filename

if **name** == "**main**":
    pdf_split_by_size()
```
