# Markdown基本语法

## 标题

```markdown
以下依次是一级, 二级, 三级, 四级标题, 最多到6级标题
# h1
## h2
### h3
#### h4
```

## 引用

```markdown
> aaaaaaaaa
>> bbbbbbbb
>>> ccccccc

## 代码与代码块

```markdown
行内代码块: `string.startsWith()`
行间代码块, 使用3个`:
``'javascript
let add = value => value+1
``'
```

## 链接与引用

```markdown
纯链接: 
[百度1](http://www.baidu.com/ "百度一下")
引用链接:
[百度2][2]{:target="_blank"}
[2]: http://www.baidu.com/   "百度二下"
```

step1：我这篇文章参考来源是 [1][markdown]

[markdown]: http://wowubuntu.com/markdown/index.html

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