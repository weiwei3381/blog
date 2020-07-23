# 基于 node.js 的全文搜索

> [flexSearch](https://github.com/nextapps-de/flexsearch)是基于 node.js 的全文搜索模块，[segment](https://github.com/leizongmin/node-segment)是中文分词的模块，使用纯 javascript 编写，与 node 版的结巴分词相比，node-jieba 安装起来很不方便，segment 安装很简单。

## 创建索引文件

flexsearch 需要创建索引文件才能工作，对于中文来说，在索引时需要进行中文分词才能正确进行检索。索引的持久化工作也需要自己写代码进行实现，示例代码如下：

```js
const fs = require('fs')
const FlexSearch = require('flexsearch') // 加载FlexSearch模块
const Segment = require('segment') // 中文分词模块

// 保存文件位置
const saveFile = './index.flex'

// 使用中文分词模块
const segment = new Segment()
// 使用默认的识别模块及字典，载入字典文件需要1秒，仅初始化时执行一次即可
segment.useDefault()

// 创建flexsearch索引，使用自定义编码和中文分词
const index = FlexSearch.create({
  encode: false,
  tokenize: function(str) {
    // 使用segment进行分词，得到的是字符串数组，例如['我们','在','游乐场']
    return segment.doSegment(str, { simple: true })
  },
})

// 读取现有flexsearch文件
if (fs.existsSync(saveFile)) {
  // 如果有储存文件，则读取并导入文件
  indexData = fs.readFileSync(saveFile)
  index.import(indexData) // 导入数据
}
```

## 增加文本

如果是单独增加文本的话，使用`Index.add(id, string)`方法，使用下面代码块。

```js
// 添加文本
index.add(
  0,
  '锦江区委宣传部的工作人员王成负责联系协调影院复工工作，这几天每天接到很多电话，“都是影城咨询复工手续的。”为了做好服务，锦江区迅速组织了防疫培训，联系医院帮助影院员工进行核酸检测。尽管如此，当天辖区也只有约1/3的影院开业。'
)

index.add(
  1,
  '为了按时复工，成都市锦江区太平洋影城王府井店的副经理虞涛这几天连轴转：17日参加复工防疫培训，18日组织员工进行核酸检测，19日拿到检测报告后向有关部门递交复工资料……“原以为几天内难以完成复工准备，没想到相关部门为大家一路‘开绿灯’，我们很快做好了准备。”虞涛介绍。'
)

index.add(
  2,
  '根据国家电影局的有关规定，影院全部采用实名制网络售票，上座率不能超过30%，全部隔排、隔座，看电影时也禁止饮食。在CGV影城的网络预订界面上，可以清楚地看到可供选择的座位区域标识。排片方面，目前放映的影片暂时以复映影片为主。'
)
```

批量增加文本，比如百科的 json 文件，可以使用下面代码

```js
// 批量增加数据
const data = fs.readFileSync('./baike.json', 'utf-8')
const baikeJson = JSON.parse(data)
for (let item of baikeJson) {
  index.add(item['名称'], item['内容']) // 使用字符串作为id
}
```

将增加后的索引保存可以使用`index.export()`方法, 该方法返回本文字符串，将其写入文件即可完成持久化工作

```js
// 将导出的文本写入到saveFile中
try {
  fs.writeFileSync(saveFile, index.export())
} catch (err) {
  console.error(err)
}
```

## 搜索关键词

flex 搜索关键词只能找到 id，因此需要配合数据库或者一些键值对数据库进行使用，例如 NEDB 或者 levelDB，典型的代码块如下：

```js
index.search({
  query: '经理', // 查询关键词
  limit: 10, // 限制最多10个
  callback: function(results) {
    // 结果列表打印
    for (let result of results) {
      console.log(result)
    }
  },
})
```
