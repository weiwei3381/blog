# css 实战学习

## 文字相关

设置 logo 字体颜色

```css
.logo {
  width: 400px;
  /* 文字垂直居中, 如果div有指定height, 则保证line-height与其相同即可 */
  height: 31px;
  line-height: 31px;
  /* 水平居中 */
  text-align: center;
  /* 文字颜色 */
  color: #faad14;
  margin: 16px 400px 16px 0;
  float: left;
  /* 设置文字字体大小 */
  font-size: 26px;
  /* 设置字磅 */
  font-weight: bold;
  /* 设置文字字间距 */
  letter-spacing: 0.1em;
  /* 设置首行缩进2字符 */
  text-indent: 2em;
  /* 文字字体 */
  font-family: -apple-system, BlinkMacSystemFont, 'Apple Color Emoji',
    'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue',
    Helvetica, Arial, sans-serif;
}
```

如果高度为百分比，`line-height`不知道设置具体的数值时，利用伪元素进行居中:

```html
<div class="father">
  <div class="son">这是要居中的文字</div>
</div>
```

```css
.son {
  height: 50%;
  background: blue;
  color: #fff;
}

.son::before {
  display: inline-block;
  content: '';
  height: 100%;
  vertical-align: middle;
}
```

## css 布局

> 大部分资源来源于[学习 CSS 布局](http://zh.learnlayout.com/)。

### display 属性

`display` 是 CSS 中最重要的用于控制布局的属性。每个元素都有一个默认的 display 值，大多数元素的默认值通常是 `block` 或 `inline` ，分别称之为**块级元素**和**行内元素**。

**(1) block**
`div` 是一个标准的块级元素。**一个块级元素会新开始一行并且尽可能撑满容器**。其他常用的块级元素包括 `p` 、 `form` 和 HTML5 中的新元素： `header` 、 `footer` 、 `section` 等等。

**(2) inline**
`span` 是一个标准的行内元素。一个行内元素可以在段落中 `<span> 像这样 </span>` 包裹一些文字而不会打乱段落的布局。 `a` 元素是最常用的行内元素，它可以被用作链接。

**(3) none**
另一个常用的 display 值是 `none` 。一些特殊元素的默认 display 值是它，例如 script 。 `display:none` 通常被 JavaScript 用来在不删除元素的情况下隐藏或显示元素。
::: tip 注意
它和 `visibility` 属性不一样。把 `display` 设置成 `none` 元素不会占据它本来应该显示的空间，但是设置成 `visibility: hidden;` 还会占据空间。
:::

### margin: auto

```css
#main {
  width: 600px;
  margin: 0 auto;
}
```

设置块级元素的 `width` 可以防止它从左到右撑满整个容器。然后你就可以设置左右外边距为 `auto` 来使其水平居中。元素会占据你所指定的宽度，然后剩余的宽度会一分为二成为左右外边距。唯一的**问题**是，当浏览器窗口比元素的宽度还要窄时，浏览器会显示一个水平滚动条来容纳页面，一般采用`max-width` 替代 `width` 可以使浏览器更好地处理小窗口的情况。

```css
#main {
  max-width: 600px;
  margin: 0 auto;
}
```

### 盒模型

```css
.simple {
  width: 500px;
  margin: 20px auto;
}

.fancy {
  width: 500px;
  margin: 20px auto;
  padding: 50px;
  border-width: 10px;
}
```

在我们讨论宽度的时候，我们应该讲下与它相关的另外一个重点知识：**盒模型**。当你设置了元素的宽度，实际展现的元素却超出你的设置：这是因为元素的边框和内边距会撑开元素，上述 css 代码实际渲染的情况如下图。

![盒模型宽度](https://s1.ax1x.com/2020/04/06/GseQRs.png)

由于传统的盒子模型不直接，人们新增了名为 `box-sizing` 的 CSS 属性。当你设置一个元素为 `box-sizing: border-box;` 时，此元素的内边距和边框不再会增加它的宽度。这里有一个与前一页相同的例子，唯一的区别是两个元素都设置了 `box-sizing: border-box;`

![采用box-sizing设置的盒子模型](https://s1.ax1x.com/2020/04/06/GsmkY4.png)

为了让所有元素都这样表现，可以使用以下 css 代码：

```css
* {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
```

:::tip 注意
`box-sizing` 是个很新的属性，目前你还应该像我上面例子中那样使用`-webkit-` 和 `-moz-` 前缀。这可以启用特定浏览器实验中的特性。
:::

### position 属性

为了制作更多复杂的布局，我们需要讨论下 `position` 属性。

(1) `static`，默认值。任意 `position: static;`的元素不会被特殊的定位。一个 `static` 元素表示它**不会**被“positioned”，一个 position 属性被设置为其他值的元素表示它会被“positioned”。

(2) `relative`，相对定位`relative` 表现的和 `static` 一样，除非你添加了一些额外的属性。在一个相对定位（position 属性的值为`relative`）的元素上设置 `top` 、 `right` 、 `bottom` 和 `left` 属性会使其偏离其正常位置。其他的元素的位置则**不会弥补它偏离后剩下的空隙**。

```css
.relative1 {
  position: relative;
}
.relative2 {
  position: relative;
  top: -20px;
  left: 20px;
  background-color: white;
  width: 500px;
}
```

![relative定位示例](https://s1.ax1x.com/2020/04/06/GsmvND.png)

(3) `fixed`，固定定位（position 属性的值为 fixed）元素会相对于视窗来定位，这意味着即便页面滚动，它还是会停留在相同的位置。和 relative 一样， top 、 right 、 bottom 和 left 属性都可用。

```css
.fixed {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 200px;
  background-color: white;
}
```

:::tip 注意
一个固定定位元素不会保留它原本在页面应有的空隙（脱离文档流）。
:::

(4) `absolute`, 绝对定位`absolute` 是最棘手的 position 值。 `absolute` 与 `fixed` 的表现类似，但是它不是相对于视窗而是相对于最近的“positioned”祖先元素。如果绝对定位（position 属性的值为 absolute）的元素没有“positioned”祖先元素，那么它是相对于文档的 body 元素，并且它会随着页面滚动而移动。**“positioned”元素是指 position 值不是 static 的元素**。

```css
.relative {
  position: relative;
  width: 600px;
  height: 400px;
}
.absolute {
  position: absolute;
  top: 120px;
  right: 0;
  width: 300px;
  height: 200px;
}
```

![绝对定位示例](https://s1.ax1x.com/2020/04/06/Gsn0Dx.png)

::: warning 关注

- `relative`相对定位，它是相对于它原本应该在的位置进行移动定位；
- `absolute`绝对定位，它是相对于最近的设置了`position`值(不能为默认值`static`)的祖先元素，如果没有则相对于`body`元素进行定位。
  :::

### 使用 position 布局的例子

这个例子在容器比 nav 元素高的时候可以正常工作。如果容器比 nav 元素低，那么 nav 会溢出到容器的外面。

```css
.container {
  position: relative;
}
nav {
  position: absolute;
  left: 0px;
  width: 200px;
}
section {
  /* 默认属性为 static */
  margin-left: 200px;
}
footer {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 70px;
  background-color: white;
  width: 100%;
}
body {
  margin-bottom: 120px;
}
```

![position布局案例](https://s1.ax1x.com/2020/04/06/GsK9mt.png)

### float 属性

另一个布局中常用的 CSS 属性是 `float` `float` 可用于实现文字环绕图片

```css
img {
  float: right;
  margin: 0 0 1em 1em;
}
```

![文字环绕图片效果](https://s1.ax1x.com/2020/04/06/GsMwKs.png)

clear 属性被用于控制浮动。使用 `clear: left;` 可以清除元素的向左浮动效果，使得它继续在文档流中。你还可以用 `right` 或 `both` 来清除向右浮动或同时清除向左向右浮动。

如果浮动的元素(例如图片)比包含它的元素还高，而且它是浮动的，那么它就会溢出到容器外面！

```html
<div class="elem">
  <img src="/images/ilta.png" style="float: right;" alt="An Image" />
  <p>
    不......这个图片比包含它的元素还高，
    而且它是浮动的，于是它就溢出到了容器外面！
  </p>
</div>
```

![浮动的溢出错误](https://s1.ax1x.com/2020/04/06/GsQffS.png)
可以采用`清除浮动技巧`(clearfix hack),在外层 div 中加入样式即可解决问题。

```css
.clearfix {
  overflow: auto;
}
```

:::tip 注意
[overflow 属性详解](https://developer.mozilla.org/zh-CN/docs/Web/CSS/overflow)
`overflow` 定义当一个元素的内容太大而无法适应 `块级格式化上下文` 时候该做什么。它是 `overflow-x` 和 `overflow-y` 的简写，可设置的值有`visible`(内容不会被修剪)、`hidden`(不显示滚动条)、`scroll`(始终显示滚动条) 和 `auto`(必要时显示滚动条)。
为使 `overflow` 有效果，块级容器必须有一个指定的高度（`height`或者 `max-height`）或者将 `white-space` 设置为 `nowrap`。
:::

### 使用浮动布局的例子

完全使用 float 来实现页面的布局是很常见的。

```css
nav {
  float: left;
  width: 200px;
}
section {
  margin-left: 200px;
}
```

![浮动实现布局](https://s1.ax1x.com/2020/04/06/Gsaodg.png)

### 百分比宽度及布局

百分比是一种相对于包含块的计量单位。它对图片很有用：如下我们实现了图片宽度始终是容器宽度的 50%。还能同时使用 min-width 和 max-width 来限制图片的最大或最小宽度

```css
article img {
  float: right;
  width: 50%;
}
```

以用百分比做布局，但是这需要更多的工作。在下面的例子中，当窗口宽度很窄时 `nav` 的内容会以一种不太友好的方式被包裹起来。总而言之，选一种最合适你的内容的方式。

```css
nav {
  float: left;
  width: 25%;
}
section {
  margin-left: 25%;
}
```

![使用百分比宽度进行布局实例](https://s1.ax1x.com/2020/04/06/GsdsXV.png)

### 媒体查询

“响应式设计(Responsive Design)” 是一种让网站针对不同的浏览器和设备“呈现”不同显示效果的策略，这样可以让网站在任何情况下显示的很棒！

媒体查询是做此事所需的最强大的工具。让我们使用百分比宽度来布局，然后在浏览器变窄到无法容纳侧边栏中的菜单时，把布局显示成一列：

```css
@media screen and (min-width: 600px) {
  nav {
    float: left;
    width: 25%;
  }
  section {
    margin-left: 25%;
  }
}
@media screen and (max-width: 599px) {
  nav li {
    display: inline;
  }
}
```

### inline-block 属性

你可以创建很多网格来铺满浏览器。在过去很长的一段时间内使用 `float` 是一种选择，但是使用 `inline-block`(行内块) 会更简单。

```css
.box {
  float: left;
  width: 200px;
  height: 100px;
  margin: 1em;
}
.after-box {
  clear: left;
}
```

![使用float创建网格](https://s1.ax1x.com/2020/04/06/GswUu6.png)

也可以用 `display` 属性的值 `inline-block` 来实现相同效果。

```css
.box2 {
  display: inline-block;
  width: 200px;
  height: 100px;
  margin: 1em;
}
```

可以使用 inline-block 来布局，但是：

- `vertical-align` 属性会影响到 `inline-block` 元素，你可能需要将它的值设置为 `top` ;
- 你需要设置每一列的宽度;
- 如果 HTML 源代码中元素之间有空格，那么列与列之间会产生空隙.

```css
nav {
  display: inline-block;
  vertical-align: top;
  width: 25%;
}
.column {
  display: inline-block;
  vertical-align: top;
  width: 75%;
}
```

![使用行内块布局示例](https://s1.ax1x.com/2020/04/06/GswoCj.png)

### column 属性

文字的多列布局:

```css
.three-column {
  padding: 1em;
  -moz-column-count: 3;
  -moz-column-gap: 1em;
  -webkit-column-count: 3;
  -webkit-column-gap: 1em;
  column-count: 3;
  column-gap: 1em;
}
```

![文字多列布局实例](https://s1.ax1x.com/2020/04/06/GswjVU.png)
:::tip 注意
columns 是很新的标准，所以你需要使用前缀，并且它不被 IE9 及以下和 Opera Mini 支持。
:::

### flex 属性

新的 flexbox 布局模式被用来重新定义 CSS 中的布局方式。使用 Flexbox 的居中布局示例代码:

```css
.vertical-container {
  height: 300px;
  display: -webkit-flex;
  display: flex;
  -webkit-align-items: center;
  align-items: center;
  -webkit-justify-content: center;
  justify-content: center;
}
```

![flex垂直居中布局](https://s1.ax1x.com/2020/04/06/Gs0tiQ.png)
