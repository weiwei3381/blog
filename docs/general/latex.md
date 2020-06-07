# Katex 公式格式速查

> [KaTeX](https://katex.org/)是目前*最快*的网络数学排版库, KaTeX 的布局是基于 Donald Knuth 的 TeX，这是数学排版的黄金标准。

Katex 数学公式语法的完全版见[KaTeX 数学公式语法](https://blog.csdn.net/Leytton/article/details/103745169/), 本文仅列出使用频率比较高的部分.

## 公式格式

- 行内公式排版, 通常用单个`$`符号包裹, 渲染后与正文处于同一段落, 如下所示:

```tex
$c=a'+b'$
```

渲染为: $c=a'+b'$

- 块公式排版, 通常用两个`$$`符号包裹, 渲染后单独成为一段, 并居中, 如下所示:

```tex
$$z = x^2 + y^2$$
```

渲染为:
$$z = x^2 + y^2$$

:::warning 注意
块公式必须要单起一行进行书写, 否则无法解析
:::

## 四则运算

- 加法`+`, 减法`-`, 点乘`\cdot`, 例如`x_2\cdot3y`渲染为: $x_2\cdot3y$, 叉乘`\times`, 例如`2\times3`渲染为$2\times3$.
- 分子分母线`\frac{分子}{分母}`, 例如`\frac{a}{b}`渲染为: $\frac{a}{b}$.

## 指数对数

- 指数`{}^{}`, 第一个大括号内为底数，第二个大括号内为指数, 例如`3^2`渲染为$3^2$
- 对数`\log_{}`, 大括号内为真数, 例如`\log_{3}{4}`渲染为$\log_{3}{4}$
- 根号\sqrt{}, 例如`\sqrt{x^2}`渲染为$\sqrt{x^2}$, 高次根号`\sqrt[]{}`, 中括号内为次数, 例如`\sqrt[4]{a}`渲染为: $\sqrt[4]{a}$

## 表达式

将整体作为上标或者下标, 在公式需要将整体用大括号`{}`包裹:

- `$x_1$`: $x_1$
- `$x^2$`: $x^2$
- `$y^{2x}$`: $y^{2x}$
- `$a_1^2$`: $a_1^2$

## 计算式

- 根号`\sqrt{n}`: $\sqrt{n}$
- 大(小)于号`\geq \leq`: $\geq  \leq$

## 累加累积

- 累加使用`\sum_{下标}^{上标}`, 如果上标字母是单字母, 则可以省略大括号, `x_i=\sum_{j=1}^ma_{ij}`渲染为: $x_i=\sum_{j=1}^ma_{ij}$
- 累积使用`\prod_{下标}^{上标}`, 例如`\prod_{a}^{b}`渲染为$\prod_{a}^{b}$

## 积分、微分与极限

- 单重积分`\int_{a}^{b}`渲染为$\int_{a}^{b}$, 双重积分`\iint_{D}`渲染为$\iint_{D}$
- 极限`\lim_{a \to b}`渲染为: $\lim_{a \to b}$

## 强调与分隔

- a 一撇`a'`: $a'$, a 两撇`a''`: $a''$
- 括号`[]`: $[]$, `()`: $()$, `\{\}`: $\{\}$
- 括号也可以用`\left`和`\right`来增强, 例如`\left( \right)`, 这种模式下括号大小会随内容变化, 例如`\left(\frac{1}{2}\right)`渲染为$\left(\frac{1}{2}\right)$

## 二元运算符

- `\in`: $\in$, `\ni`: $\ni$, `\notin`: $\notin$
- `\subset`: $\subset$, `\subseteq`: $\subseteq$, `\supset`: $\supset$, `\supseteq`: $\supseteq$
- `\le`:$\le$, `\ge`: $\ge$

## 希腊字母

- `\alpha`: $\alpha$, `\beta`: $\beta$, `\gamma`: $\gamma$
- `\delta`: $\delta$, `\epsilon`: $\epsilon$, `\eta`: $\eta$
- `\theta`: $\theta$, `\mu`: $\mu$, `\pi`: $\pi$
- `\sigma`: $\sigma$, `\tau`: $\tau$, `\omega`: $\omega$
- `\nabla`: $\nabla$, `\varphi`: $\varphi$
