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

#### 利用 session 登陆并访问网站

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
