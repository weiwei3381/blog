# Markdown基本语法

## 标题与引用

标题采用`#`开头, 引用采用符号`>`开头, 两者都可以多次使用

```markdown
以下依次是一级, 二级, 三级, 四级标题, 最多到6级标题
# h1
## h2
### h3
#### h4
以下依次是引用, 引用再引用
> aaaaaaaaa
>> bbbbbbbb
>>> ccccccc
```

## 代码与代码块

 行内代码使用符号\`, 代码块使用3个\`符号包裹

```markdown
行内代码块: `string.startsWith()`
行间代码块, 使用3个`:
``'javascript
let add = value => value+1
``'
```

## 链接与图片

```markdown
纯链接:
[百度](http://www.baidu.com/ "百度一下")

引用链接:
I get 10 times more traffic from [Google][1] than from
[Yahoo][2] or [MSN][3].

[1]: http://google.com/        "Google"
[2]: http://search.yahoo.com/  "Yahoo Search"
[3]: http://search.msn.com/    "MSN Search"

图片:
![每日冷知识封面](http://s1.ax1x.com/2020/03/26/8xLVM9.jpg)
![每日冷知识封面](http://s1.ax1x.com/2020/03/26/8xLVM9.jpg "封面")
```

渲染为:[百度](http://www.baidu.com/ "百度一下"),
![每日冷知识封面](http://s1.ax1x.com/2020/03/26/8xLVM9.jpg "封面")

## 有序与无序列表

```markdown
有序列表
1. 学习
2. 生活
3. 工作

无序列表
- 学习
- 工作
- 生活
```

:::tip
无需列表的开头符号`-`也能换成`*`或者`+`
:::

## 强调与删除

```md
单星号和下划线表示斜体, 双星号或者下划线表示粗体, 双波浪线表示删除
*单星号*
_单下划线_
**双星号**
__双下划线__
~哈哈~
~~删除线~~
```

渲染为:*单星号*, _单下划线_, **双星号**, __双下划线__, ~哈哈~, ~~删除线~~

## 表格

```md
| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |
```

**渲染为:**
| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

## 脚注、高亮、下划线与待办事项(markdown增强)

脚注需安装`markdown-it-footnote`, 高亮需要安装`markdown-it-mark`, 下划线需要安装`markdown-it-ins`, 待办事项需要安装`markdown-it-task-lists`. 
```md
1. 脚注:
这里主要用到了PSO算法[^1], 以及相应的改进算法[^2]
[^1]:PSO算法情况，会自动拉到最后面排版
[^2]:PSO改进算法

2. 高亮共有两种写法：
使用<mark>html标签</mark>进行高亮  
这是 ==一段高亮的句子==

3. 下划线共有两种写法:
<ins>html标签的下划线</ins>
++下划线++

4. 待办事项：
- [ ] 旅行准备
  - [x] 买好需要的衣服
```

**渲染为:** 
这里主要用到了PSO算法[^1], 以及相应的改进算法[^2]  
[^1]:PSO算法情况，会自动拉到最后面排版  
[^2]:PSO改进算法

- [ ] 旅行准备
  - [x] 买好需要的衣服

使用<mark>html标签</mark>进行高亮  
这是 ==一段高亮的句子==

<ins>html标签的下划线</ins>
++下划线++
:::warning 注意
使用`+`或者`=`的高亮和下划线一般在单行中使用, 如果在同一行使用则需要 ==在两边增加空格== 与其他字符隔开, 否则不起效果!
:::

## 分隔符、跳转、目录与徽标

```md
三个短横线表示水平分割, 需要与上一行有空行：
---

直接显示可跳转链接：
<http://example.com/>

自动生成目录：
[[toc]]

徽标:
普通徽标<Badge text="注意"/>
警告徽标<Badge text="警告" type="warning"/>
错误徽标<Badge text="错误" type="error"/>
```

**渲染为**:  
三个短横线表示水平分割

---
直接显示可跳转链接
<http://example.com/>

普通徽标<Badge text="注意"/>
警告徽标<Badge text="警告" type="warning"/>
错误徽标<Badge text="错误" type="error"/>

[[toc]]
