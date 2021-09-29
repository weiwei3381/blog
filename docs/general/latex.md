# Katex/Latex 公式速查

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

加粗字母一般使用`\mathbf{}`包裹

```tex
$\mathbf{JKLMNOPQR \Delta}$
```

渲染为：
$\mathbf{JKLMNOPQR \Delta}$

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

## Latex常用大型公式模板

Latex条件公式显示如下:

$$
a_{ij}=
\begin{cases}
  1, \quad d_{ij} \le r^{coor}_i
  \\  
  0, \quad d_{ij} > r^{coor}_i
\end{cases}
$$

这种公式有两种写法，一种是使用`matrix`标签，另一种是使用`cases`标签，其中`cases`标签更加简洁。

`cases`标签的写法如下:

```latex
$$
a_{ij}=
\begin{cases}
  1, \quad d_{ij} \le r^{coor}_i
  \\  
  0, \quad d_{ij} > r^{coor}_i
\end{cases}
$$
```

`matrix`标签的写法如下：

```latex
$$
a_{ij} = \left\{
  \begin{matrix}
    1, \quad d_{ij} \le r^{coor}_i
    \\  
    0, \quad d_{ij} > r^{coor}_i
    \end{matrix}\right.
$$
```

更复杂的多条件公式，实例1:

$$
\begin{array}{lcl}
  u^{R*}(k)=\arg\max\limits_{u^R(k)} J_r^R\big(x^R(k),u^R(k) \big)
  \\
  \text{s.t.}
  \\
  \begin{cases}
    x^R(k+1)=f(x^R(k), u^R(k))
    \\
    i=1,2,\ldots,N_R
    \\
    G^R\Big(x^R(k), u^R(k) \Big) \le 0
  \end{cases}
\end{array}
$$

**实例1**代码如下：

```latex
$$
\begin{array}{lcl}
  u^{R*}(k)=\arg\max\limits_{u^R(k)} J_r^R\big(x^R(k),u^R(k) \big)
  \\
  \text{s.t.}
  \\
  \begin{cases}
    x^R(k+1)=f(x^R(k), u^R(k))
    \\
    i=1,2,\ldots,N_R
    \\
    G^R\Big(x^R(k), u^R(k) \Big) \le 0
  \end{cases}
\end{array}
$$
```

实例2：

$$
p_{mn}^{RA}(k+1)=
\begin{cases}
  \tau p_{mn}^{RA}(k)  & (\text{NOT detected})
  \\
  \frac{P_D^{RA} \cdot p_{mn}^{RA}(k)}{P_F^{RA} + (P_D^{RA} - P_F^{RA}) \cdot p_{mn}^{RA} i(k)} & (\text{Detected and }b(k)=1)
  \\
  \frac{(1-P_D^{RA}) \cdot p_{mn}^{RA}(k)}{1 - P_F^{RA} + (P_F^{RA} - P_D^{RA}) \cdot p_{mn}^{RA}(k)} & (\text{Detected and } b(k)=0)
\end{cases}
$$

**实例2**代码如下：

```latex
$$
p_{mn}^{RA}(k+1)=
\begin{cases}
  \tau p_{mn}^{RA}(k)  & (\text{NOT detected})
  \\
  \frac{P_D^{RA} \cdot p_{mn}^{RA}(k)}{P_F^{RA} + (P_D^{RA} - P_F^{RA}) \cdot p_{mn}^{RA} i(k)} & (\text{Detected and}b(k)=1)
  \\
  \frac{(1-P_D^{RA}) \cdot p_{mn}^{RA}(k)}{1 - P_F^{RA} + (P_F^{RA} - P_D^{RA}) \cdot p_{mn}^{RA}(k)} & (\text{Detected and} b(k)=0)
\end{cases}
$$
```

大型矩阵显示如下：

$$
A_{m\times n}=  
\begin{bmatrix}  
  a_{11} & a_{12} & \cdots  & a_{1n} \\  
  a_{21} & a_{22} & \cdots  & a_{2n} \\  
  \vdots & \vdots & \ddots & \vdots \\  
  a_{m1} & a_{m2} & \cdots  & a_{mn}  
\end{bmatrix}  
=\left [ a_{ij}\right ]
$$

大型矩阵的写法如下所示：

```latex
$$
A_{m\times n}=  
\begin{bmatrix}  
  a_{11} & a_{12} & \cdots  & a_{1n} \\  
  a_{21} & a_{22} & \cdots  & a_{2n} \\  
  \vdots & \vdots & \ddots & \vdots \\  
  a_{m1} & a_{m2} & \cdots  & a_{mn}  
\end{bmatrix}  
=\left [ a_{ij}\right ] 
$$
```

多行等式一般显示如下:

$$
\begin{aligned}
  3^{6n+3}+4^{6n+3}
  & = (3^3)^{2n+1}+(4^3)^{2n+1} \\
  & \equiv 27^{2n+1}+64^{2n+1} \\  
  & \equiv 27^{2n+1}+(-27)^{2n+1} \\
  & \equiv 27^{2n+1}-27^{2n+1} \\
\end{aligned}
$$

代码如下：

```latex
$$
\begin{aligned}
  3^{6n+3}+4^{6n+3}
  & = (3^3)^{2n+1}+(4^3)^{2n+1} \\
  & \equiv 27^{2n+1}+64^{2n+1} \\  
  & \equiv 27^{2n+1}+(-27)^{2n+1} \\
  & \equiv 27^{2n+1}-27^{2n+1} \\
\end{aligned}
$$
```

## 附录一 bibTex格式要求（bib文件书写规范）

### bib期刊格式

`@article`为期刊杂志的论文，通常格式如下：

```bib
@Article{孙泽宇2021外资持股,
    author = {孙泽宇 and 孙凡},
    title = {外资持股对公司战略选择的影响研究——基于沪深港通交易制度的准自然实验},
    journal = {上海财经大学学报},
    year = {2021},
    volume = {23},
    issue = {05},
    pages = {96-106},
}
```

输出为`孙泽宇, 孙凡. 外资持股对公司战略选择的影响研究——基于沪深港通交易制度的准自然实验[J]. 上海财经大学学报, 2021, 23(05): 96–106.`

```bib
@article{hinton2006reducing,
    title={Reducing the dimensionality of data with neural networks},
    author={Hinton, Geoffrey E and Salakhutdinov, Ruslan R},
    journal={science},
    volume={313},
    number={5786},
    pages={504-507},
    year={2006},
}
```

输出为`Hinton G E, Salakhutdinov R R. Reducing the dimensionality of data with neural networks[J]. science, 2006, 313(5786): 504–507.`。

### bib书籍格式

`@book`为公开出版的图书，常用格式如下：

```bib

@book{李丽2009粒子群,
  title={粒子群优化算法},
  author={李丽 and 牛奔},
  publisher={冶金工业出版社},
  year={2009},
  address={北京},
  pages={22-23},
}
```

输出为：`李丽, 牛奔. 粒子群优化算法[M]. 北京: 冶金工业出版社, 2009: 22–23.`。

### bib网络文章

`@electronic`为网络文章，常用格式如下：

```bib
@electronic{王天僚2018普京罕见披露,
    title = {普京罕见披露“杀手锏”武器引轰动},
    author = {王天僚},
    editor = {参考消息网},
    url = {http://www.cankaoxiaoxi.com/mil/20180303/2257258.shtml},
    date = {2021-08-10},
}
```

输出为`王天僚. 普京罕见披露《杀手锏》武器引轰动[EB/OL]. 参考消息网. (2021-08-10). http://www.cankaoxiaoxi.com/mil/20180303/2257258.shtml.`

### bib报纸格式

```bib
@Newspaper{夏文祥2015战略管理,
    title = {战略管理重在管好不确定性},
    author = {夏文祥 and 李尚华},
    date = {2015-01-27},
    pages = {006},
    publisher = {解放军报},
}
```

输出为`夏文祥, 李尚华. 战略管理重在管好不确定性[J]. 解放军报, 2015: 006.`。

### bib会议论文

```bib
@inproceedings{彭小兵2003战略决策博弈,
  title={战略决策博弈模型及其在企业战略管理中的应用研究},
  author={彭小兵 and 蒲勇健},
  booktitle={第7届全国青年管理科学与系统科学学术会议论文集},
  pages={151-165}
  year={2003},
}
```

输出为：`彭小兵, 蒲勇健. 战略决策博弈模型及其在企业战略管理中的应用研究[C]//第7届全国青年管理科学与系统科学学术会议论文集. 2003: 151–165.`。

```bib
@inproceedings{geng2013robot,
  title={Robot path planning in an environment with many terrains based on interval multi-objective PSO},
  author={Geng, Na and Gong, Dunwei and Zhang, Yong},
  booktitle={2013 IEEE Congress on Evolutionary Computation},
  pages={813--820},
  year={2013},
}
```

输出为：`Geng N, Gong D, Zhang Y. Robot path planning in an environment with many terrains based on interval multi-objective PSO[C]//2013 IEEE Congress on Evolutionary Computation. 2013: 813–820.`
