# 论文写作

## 论文写作资源搜索

### 论文下载

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

### 得到知识搜索

[得到搜索](https://www.dedao.cn/)可以搜索电子书的全文，并且可以任意试读10%章节。

为了增加得到搜索的能力，可以在油猴脚本中增加下面代码：

```js
// ==UserScript==
// @name         得到搜索
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.dedao.cn/*
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮
    function create_button(text, id, background="#e33e33"){
        const button = document.createElement("button"); //创建一个按钮
        button.textContent = text; //按钮内容
        if($(`#${id}`) )$(`#${id}`).remove(); // 如果已经有这个id的元素了，那么将其移除
        button.id = id;
        button.style.width = `${text.length * 20}px`; //根据按钮内容自动改变按钮宽度
        button.style.height = "28px"; //按钮高度
        button.style.align = "center"; //文本居中
        button.style.color = "white"; //按钮文字颜色
        button.style.background = background; //按钮底色
        button.style.border = `1px solid ${background}`; //边框属性
        button.style.borderRadius = "4px"; //按钮四个角弧度
        button.style.marginLeft = "20px";
        return button
    }

    // 给指定id的元素增加复制事件
    function add_copy_event(element_id, copy_str){
        $(`#${element_id}`).on("click", function (e) {
            e.preventDefault(); // 阻止默认行为
            e.stopPropagation(); // 阻止冒泡, 防止触发a标签事件
            GM_setClipboard(copy_str)
        });
    }
    // 获得书籍信息
    function get_book_info(book){
        if(!book) return ""
        const book_name = book.operating_title
        const book_author = book.book_author
        const publish_time = book.publish_time
        return `${book_author}. ${book_name}[M]. 出版社, ${publish_time}.`
    }

    (function() {
        // 拦截页面的所有XMLHttpRequest请求
        var origOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function() {
            this.addEventListener('load', function() {
                if(this.readyState === 4 && this.responseURL.endsWith("searchebookcontent")){
                    console.log("开始处理")
                    const content = JSON.parse(this.responseText)
                    const page = content.c ? content.c.page : null; // 获取页码
                    const size = content.c ? content.c.size : null; // 获取每页大小
                    let previous_num = (page - 1) * size
                    // 获取书籍信息
                    const book = content.c ? content.c.book : null;
                    let book_str = get_book_info(book)

                    // 章节列表
                    const chapter_list = content.c ? content.c.list : null
                    let all_chapter_str = ""
                    if(chapter_list){
                        for (let i = 0; i < chapter_list.length; i++){
                            let chapter = chapter_list[i]
                            if(!chapter.Chapter)continue;
                            // 增加所有段落信息
                            all_chapter_str += chapter.Chapter + "========================================\n\n"
                            // 增加单段落信息
                            const chapter_btn = create_button(`复制段落${previous_num+i+1}`, `chapter-${previous_num+i}-btn`,'#5c7cfa')
                            $("li.list-item")[previous_num+i].appendChild(chapter_btn);
                            add_copy_event(`chapter-${previous_num+i}-btn`, `\n---------${book_str} 开始---------\n\n`+chapter.Chapter+`\n---------${book_str} 结束---------\n`);
                        }
                    }
                    const book_info_btn = create_button("复制书籍信息", "bookInfo_cp_btn")
                    const chapter_content_btn = create_button("复制所有段落", "allChapter_cp_btn")
                    $('.ebook-detail')[0].parentNode.append(book_info_btn)
                    $('.ebook-detail')[0].parentNode.append(chapter_content_btn)
                    add_copy_event("bookInfo_cp_btn", book_str);
                    add_copy_event("allChapter_cp_btn", all_chapter_str);

                    // 增加段落高度，保证内容都能显示
                    const para_list = $(".list-item .summary.iget-common-f4.iget-common-c1")
                    for(let i = 0; i < para_list.length; i++){
                        const content_length = para_list[i].innerHTML.length
                        para_list[i].style.height = `${content_length * 0.7 < 50 ? 50 : content_length * 0.7}px`
                    }
                }
            });
            origOpen.apply(this, arguments);
        };
    })();
})();
```

![原版得到搜索](https://pic.imgdb.cn/item/6106d3985132923bf8128c39.jpg)

原版得到搜索如上图所示，使用得到搜索增强的脚本时，在电子书信息搜索增加了两个功能，**一是**能够一键复制段落内容和书籍信息，并且内容比网址显示的更多更全面，二是扩大了网页的段落显示，效果如下所示。

![得到搜索（脚本增强版）](https://pic.imgdb.cn/item/6106d41a5132923bf814c5b0.jpg)


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

### 英文pdf使用有道文档翻译(网易翻译)

进入[有道文档翻译](https://pdf.youdao.com/)，登录后上传pdf文件（不得大于10MB）。

为了能够自动滚动页面和批量下载图片，需要在油猴脚本（Tampermonkey）中加载脚本，脚本全文如下：

```js
// ==UserScript==
// @name         有道文档翻译图片下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://pdf.youdao.com/docview.html*
// @grant        GM_openInTab
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮
    function create_button(text, id, background="#e33e33"){
        const button = document.createElement("button"); //创建一个按钮
        button.textContent = text; //按钮内容
        if($(`#${id}`) )$(`#${id}`).remove(); // 如果已经有这个id的元素了，那么将其移除
        button.id = id;
        button.style.width = `${text.length * 20}px`; //根据按钮内容自动改变按钮宽度
        button.style.height = "28px"; //按钮高度
        button.style.align = "center"; //文本居中
        button.style.color = "white"; //按钮文字颜色
        button.style.background = background; //按钮底色
        button.style.border = `1px solid ${background}`; //边框属性
        button.style.borderRadius = "4px"; //按钮四个角弧度
        button.style.marginLeft = "20px";
        return button
    }

    // 下载图片的功能
    function download_imgs(){
        const trans_elements = $("#docTranslationImg .doc-img-wrapper img")
        console.log(`共需要下载${trans_elements.length}张图片`)
        for(let i = 0; i < trans_elements.length; i++){
            const img_ele = trans_elements[i];
            let img_url = img_ele.dataset?img_ele.dataset.src:img_ele.src // 获得url
            // 间隔0.8秒下载下一张图片
            setTimeout(function(){
                GM_openInTab(img_url)
            }, i*800)
        }
    }
    // 是否滚动到页面底部
    function is_scroll_bottom(element_id){
        const $ele = $(`#${element_id}`)
        const sum_height = $ele.prop('scrollHeight') // 总高度
        const current_height = $ele.scrollTop() // 当前滚动高度
        // 如果差距小于500，说明已经到页面底部了
        if(sum_height-current_height < 500 ) return true
        return false
    }

    // 判断是否到达文档末尾
    function is_end(){
        return $("#payContainer").css("display") === 'block'
    }

    var is_auto_scroll = false
    var pagePos = 0;
    // 自动滚动功能
    function auto_scroll(){
        // 自动滚动，使用setTimeout递归调用
        function _auto(){
            // 到达文档末尾则停止滚动并自动下载图片
            console.log(is_end())
            if(is_end()){
                is_auto_scroll = false
                download_imgs()
            }
            // 如果没有到达底部，则位置继续向下
            if(!is_scroll_bottom('docTranslationImg'))pagePos += 370;
            document.getElementById("docTranslationImg").scroll(0,pagePos)
            if(is_auto_scroll){
                setTimeout(_auto, 250)
            }
        }
        _auto(); // 调用函数
    }

    function start_or_pause_scroll(){
        if(is_auto_scroll){
            is_auto_scroll=false;
        }else{
            is_auto_scroll = true
            auto_scroll()
        }

    }

    // 创建下载译文图片按钮
    const download_all_btn = create_button("下载图片", "download_all_btn")
    $("#docTranslation div")[0].append(download_all_btn)
    $("#download_all_btn").on("click", function (e) {
        e.preventDefault(); // 阻止默认行为
        e.stopPropagation(); // 阻止冒泡, 防止触发a标签事件
        download_imgs()
    });

    const auto_scroll_btn = create_button("开始/暂停滚动", "auto_scroll_btn", "#74b816")
    $("#docTranslation div")[0].append(auto_scroll_btn)
    $("#auto_scroll_btn").on("click", function (e) {
        e.preventDefault(); // 阻止默认行为
        e.stopPropagation(); // 阻止冒泡, 防止触发a标签事件
        start_or_pause_scroll()
    });
})();
```

将上面的代码复制到油猴脚本中保存即可，以后再批量下载图片就可以直接使用了。

加载完成后，刷新有道文档翻译界面，会在译文区增加两个按钮功能，如下图所示：

![译文区按钮](https://pic.imgdb.cn/item/6106cf855132923bf8fff871.jpg)

其中`开始/暂停滚动`是让页面自动滚动，每次滚动到末尾时，有道会加载新页面，所以需要不停下滚，**为了能触发自动加载新页面，需要把鼠标放到译文区**，`下载图片`则是以`tran-页码.jpg`的形式，将所有已经下载或的页面全部下载下来。

为了方便操作，点击`开始/暂停滚动`之后，**如果滚动到文档末尾，会自动触发下载图片功能**，方便获取全文。

使用该方法得到的图片如下所示，可以再使用“acrobat”或者“pdfelement”将其合并成一个pdf，然后使用“abbyy”进行文字识别。

![使用有道文档下载的译文图片集合](https://pic.imgdb.cn/item/6106d0ec5132923bf8065893.jpg)

### 删除有道文档翻译下载的所有翻译图片并生成pdf合集

使用python的`img2pdf`模块，首先`pip install img2pdf`安装，然后新建py文件后输入下面代码：

```python
import os
import time
import img2pdf

# 文件下载目录
DOWNLOAD_PATH = r"E:\Downloads"
# 合并成功后是否删除文件
IS_DELETE_FILE = True


def from_photo_to_pdf(jpg_list):
    """
    将图片文件地址的列表合并成一个pdf文件
    :param jpg_list: 图片文件位置列表，例如["E:\Downloads\tran-0.jpeg','E:\Downloads\tran-1.jpeg]
    :return:合并的pdf文件位置
    """

    # 按照A4大小自定义pdf文件的单页的宽和高
    a4 = (img2pdf.mm_to_pt(720), img2pdf.mm_to_pt(1080))
    layout_fun = img2pdf.get_layout_fun(a4)
    time_now = time.strftime('%Y%m%d_%H%M%S',time.localtime(time.time()))
    pdf = os.path.join(DOWNLOAD_PATH, "转换_%s.pdf" %(time_now,))
    with open(pdf, 'wb') as f:
        f.write(img2pdf.convert(jpg_list, layout_fun=layout_fun))
    return pdf


jpg_list = []
page_i = 0
# 获取所有的翻译后的jpeg文件，由于翻译后的文件是按照tran-0.jpeg, tran-1.jpeg排序的，因此进行遍历
while True:
    jpg_file = os.path.join(DOWNLOAD_PATH, "tran-%s.jpeg" % (page_i,))
    if not os.path.exists(jpg_file):
        break
    # 重复图片文件处理，有时候会出现多下载了一次文件的情况，此时文件夹会出现两张相同照片
    # 例如“tran-91.jpeg”和“tran-91 (1).jpeg”，如果相同则删除重复文件
    duplication_file = os.path.join(DOWNLOAD_PATH, "tran-%s (1).jpeg" % (page_i,))
    if os.path.exists(duplication_file) and os.path.getsize(duplication_file) == os.path.getsize(jpg_file):
        os.remove(duplication_file)
    jpg_list.append(jpg_file)
    page_i += 1

# 合并pdf文件，当图片列表大于零才新生成pdf
if len(jpg_list) == 0:
    raise RuntimeError("文件夹[%s]中没有指定图片" % DOWNLOAD_PATH)
# 获得合并后的pdf
merged_pdf = from_photo_to_pdf(jpg_list)

# 如果允许删除源文件，同时生成的pdf存在且大于100KB，则删除源图片文件
if IS_DELETE_FILE and os.path.exists(merged_pdf) and os.path.getsize(merged_pdf) > 100*1024:
    for jpg in jpg_list:
        os.remove(jpg)
print("一共合并%s张图片，pdf文件位于%s，运行结束" % (len(jpg_list),merged_pdf))
```

其中，`DOWNLOAD_PATH`是下载的图片文件目录，需要根据情况进行指定，我本机位置是`E:\Downloads`，最后的输出结果像这样：`一共合并98张图片，pdf文件位于E:\Downloads\转换_20210829_003206.pdf，运行结束`。
