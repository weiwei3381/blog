

# 论文写作 🐸

> 写作的一些资料和想法进行记录.

## 全文翻译英文技术文档和书籍

### mobi、epub等格式的英文技术文档全文翻译

**第一步**，下载最新的英文技术书籍，可以到[SaltTiger](https://salttiger.com/)下载，也可以通过在[libgen](http://libgen.is/search.php)进行关键词搜索。

**第二步**，将电子书导入到[Calibre](https://calibre-ebook.com/download_windows)电子书管理软件中，然后把epub或者mobi格式电子书转换为calibre自带的`htmlz`格式，如下图右上角所示。

![转换为htmlz格式](https://pic.imgdb.cn/item/60f830315132923bf8376274.jpg)

**第三步**，将`htmlz`格式的电子书扩展名改为`zip`，然后解压，解压后的文件目录如下所示。

![htmlz解压](https://pic.imgdb.cn/item/60f8309f5132923bf83a6dff.jpg)

**第四步**，使用chrome浏览器打开`index.html`文件，能够正常阅读，然后打开chrome自带的`翻译`功能，此时会将当页内容翻译为中文，对于`<code>`标签包裹的内容，chrome浏览器会保持原样输出，翻译前如下图所示：

![原文样式](https://pic.imgdb.cn/item/60f8318f5132923bf84129d1.jpg)

使用chrome浏览器翻译后的效果如下：

![翻译后的样式](https://pic.imgdb.cn/item/60f831f35132923bf843d03f.jpg)

但是采用这种翻译只对当前页面有效，需要进一步优化。

**第五步**，使用js代码让页面自动滚动，按“F12”键，打开控制台标签“console”，然后在控制台输入下面代码：

```js
let pagePos = 0;
setInterval(function(){
    pagePos += 100;
    scroll(0,pagePos)
}, 500)
```

上述代码表示每500毫秒往下滚动100像素高度，这样页面就自动开始滚动，结合chrome浏览器的自动翻译，就可以自动翻译整个页面全文。

最后使用快捷键`ctrl`+`s`保存页面。

**第六步**，保存页面之后，对于书签等`<a>`标签跳转链接，可能使用的源文件路径，此时需要形如`file://xxx`的开头部分删除掉，只留下hash路径，即形如`#calibre`部分，这样就能自动跳转。通常可以使用vscode的替换功能全文搜索替换。

### pdf格式的英文文档全文翻译

在[兰德](https://www.rand.org/pubs/research_reports.html)官网下载英文报告一般为pdf格式，怎么样较好的进行全文翻译呢？

首先，将下载的pdf文档转换成为html文件，使用`pdfelement`即可，点击`转换`标签页，选择`转换为html`按钮，如下图所示。

![转换为html](https://pic.imgdb.cn/item/60f83feb5132923bf8a68223.jpg)

然后对转换后的html文件进行处理，去除掉不必要的换行符，一般在vscode中进行操作，主要有如下操作

- 将`-</br>`删除
- 将`</br>`替换为空格
- 将所有的两个空格替换为一个空格

然后就可以按照之前的方法，使用chrome进行翻译了。

::: tip 提示
可以使用[彩云小译](https://fanyi.caiyunapp.com/#/web)的chrome插件，实现中英文对照翻译效果
:::

## 中文论文搜索

2021年8月可用的账号如下所示：

| 学校     | 账户                | password          | 数据库地址                    |             |
| -------- | ------------------- | ----------------- | ----------------------------- | ----------- |
| 信工大   | 休闲广场大学1~200   | xxgcdxtsg         | https://www.cnki.net/         | 中文论文    |
| 陆医大   | 三国学校a~z         | 123456            | http://202.202.232.216/       | 中/英文论文 |
| 陆工大   | 路径过程对象001~120 | cnki001~120       | https://www.cnki.net/         | 中文论文    |
| 国大军文 | DX2029              | 官方介绍武汉      | https://www.cnki.net/         | 中文论文    |
| 国大军文 | junxiao             | Junxiao2020       | https://qikan.cqvip.com/      | 中文论文    |
| 军交     | 对象1191            | jsjtxy            | https://www.cnki.net/         | 中文论文    |
| 军交     | 介绍交通校园        | jsjtxy            | https://g.wanfangdata.com.cn/ | 中文论文    |
| null     | cnki05914           | cnki5737          | https://www.cnki.net/         | 中文论文    |
| null     | cnki05773           | cnki9924          | https://www.cnki.net/         | 中文论文    |
| null     | cnki20025           | cnki7248          | https://www.cnki.net/         | 中文论文    |
| null     | cnki20131           | cnki7249          | https://www.cnki.net/         | 中文论文    |
| 空工大   | 科技广场对象01~10   | 科技广场对象01~10 | https://www.cnki.net/         | 中文论文    |

## 文章目录

- :smile: [每天一篇SCI论文](./daily.md)
- :rainbow: [UAVs 搜索](./search.md)
- :rice: [UAVs 防御](./defense.md)

---

## 参考书目与网站

个人觉得比较好的参考网站有:

- [SCI-HUB](https://www.sci-hub.shop/)
- [预印本系统](https://arxiv.org/)
- [iData 知识检索](https://www.cn-ki.net/)
- [创世纪图书馆-英文书籍检索](http://libgen.is/search.php?&req=drone&phrase=1&view=simple&column=title&sort=year&sortmode=DESC)
