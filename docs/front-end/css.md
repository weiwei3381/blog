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
