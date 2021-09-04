# 📏论文中的数学

## 概率图模型

> 图片截取自[机器学习-白板推导系列](https://www.bilibili.com/video/BV1BW41117xo?p=1)，感谢[shuhuai008](https://space.bilibili.com/97068901)大佬。

### 概率图模型基础-背景介绍

![背景知识](https://pic.imgdb.cn/item/612b4b1644eaada73922d4c4.jpg)

其中，条件概率$p(b|a)$表示随机事件$a$发生的条件下，$b$发生的概率，公式为$p(b|a) = \frac{p(b,a)}{p(a)}$。其实条件概率还是可以按照“频数/总数”的方式进行理解，分母部分$p(b,a)$表示事件发生频数部分，即$a,b$同时发生的概率，总数部分是$a$，即$a$发生的所有情况，合起来就是所有$a$发生的情况下，$a,b$同时发生的概率，就是$p(b|a)$。

类似的，公式$p(a,b) = p(a) \cdot p(b|a)$可以用乘法原理进行理解，即将$p(a,b)$理解为两个事件，事件1是a发生，事件2是a发生时b发生，合起来就是a和b同时发生。当然，从事件b的角度看也是一样的，事件1
是b发生，事件2是b发生时a发生，即$p(a,b) = p(b) \cdot p(a|b)$。

### 贝叶斯网络-条件独立性

![](https://pic.imgdb.cn/item/612b52c144eaada73938d8f7.jpg)

上图为本次推导的基础。

![tail-to-tail结构](https://pic.imgdb.cn/item/612b520844eaada739367419.jpg)

这是第一种结构，叫做“tail-to-tail”，上图中，如果a被观测，则b和c被阻隔，a没被观测时，b和c只是在条件a中独立，一旦a被观测，则b和c独立。

其中，$p(c|a,b) \cdot p(b|a)$的推导来源于多变量贝叶斯公式，对于两变量，贝叶斯公式为$p(a|b)=\frac{p(a,b)}{p(b)}$，在三变量中，例如对于$p(c|a,b)$，将$a,b$看成一个整体$\Delta$，那么同样有$p(c|a,b) = p(c|\Delta)=\frac{p(c,\Delta)}{p(\Delta)}= \frac{p(c,a,b)}{p(a,b)}$，即$p(c|a,b) = \frac{p(c,a,b)}{p(a,b)}$，将此带入上式，有：

$$
\begin{aligned}
p(c|a,b) \cdot p(b|a)
& = \frac{p(c,a,b)}{p(a,b)} \cdot \frac{p(b,a)}{p(a)} \\
& = \frac{p(c,a,b)}{p(a)} \\
& = p(c,b|a)
\end{aligned}
$$

![head-to-tail结构](https://pic.imgdb.cn/item/612b531844eaada73939ccb4.jpg)

这是第二种结构，叫做head-to-tail结构。

![head-to-head结构](https://pic.imgdb.cn/item/612b544444eaada7393d5db8.jpg)

这是第三种结构“head-to-head”，这个结构比较特殊，默认情况下a和b是独立的，但是$c$被观测之后，路径相通，$a,b$相互之间就不独立了。

### 贝叶斯网络

![](https://pic.imgdb.cn/item/612b55bc44eaada7394227bd.jpg)

上图是背景知识，也是第二节推导出的部分。

![](https://pic.imgdb.cn/item/612b582a44eaada7394a2224.jpg)

上图解释了为什么“head-to-head”结构中，当c观测之后，a和b不是条件独立的。即判断等式$p(a|c) = p(a|c,b)$是不是相等？如果相等，则代表c发生的条件下a发生的概率，等于c和b同时发生时a发生的概率，即b发不发生对于c发生的条件下a发生没影响，那么b,c条件独立。

简要解释：由于a（酒量小）和b（心情不好）都是小明喝醉了的原因，因此当知道小明喝醉了这个结果以及其中一个原因“酒量小”$p(a|c)$，肯定会影响对“小明是不是心情不好”这个原因的判断。

### 贝叶斯网络概述

从单一到混合，从有限到无限，分为空间和时间两个方面。空间是指随机变量取值可以从离散到连续。 

常用单一模型：朴素贝叶斯，其中$X$中每个分量$x_i$都是独立的，如下图所示。

![Naive Bayes](https://pic.imgdb.cn/item/612b690544eaada739773291.jpg)

混合模型常用的高斯混合模型（GMM）

![GMM](https://pic.imgdb.cn/item/612b6a2244eaada739796253.jpg)

时间上相关的模型有：马尔科夫链和高斯过程。

连续模型：主要用高斯贝叶斯网络。

混合模型和时间维度结合起来就是动态系统（动态模型），这是一个大的体系，最常见的有HMM（隐马尔科夫模型，隐状态是离散的、卡尔曼滤波（连续高斯，线性）、粒子滤波（非连续高斯、非线性）

总结如下：

![总结](https://pic.imgdb.cn/item/612b6bc844eaada7397b95d7.jpg)

### 马尔科夫随机场

背景知识如下：

![背景知识](https://pic.imgdb.cn/item/612b6c8544eaada7397c988f.jpg)

团的推导：

![](https://pic.imgdb.cn/item/612b6d9244eaada7397dfe12.jpg)

完整总结，团的部分之前没介绍过，所以有点晕。

![](https://pic.imgdb.cn/item/612b6e2044eaada7397eb963.jpg)

### 概率图模型推断（Inference）

推断就是“求概率”，**一是**求边缘概率，可能是已知联合概率，求某个变量的边缘概率。**二是**求条件概率，已知一部分求另一部分。**三是**求最大后验，期望后验概率达到最大。

![](https://pic.imgdb.cn/item/612b6f1744eaada7397ffde8.jpg)

精确推断和近似推断，精确推断用变量消除法（VE）、信念传播算法（BP，脱胎于VE，克服了VE的一些缺点，**很重要**，一般针对树结构）、联合树算法（针对图结构）。

近似推断：采用BP思想，处理有环图结构，称为Loop Belief Propagation；基于采样的蒙特卡洛推断方法，常用的有Importance Sampling和MCMC；确定性近似。

![](https://pic.imgdb.cn/item/612b708a44eaada73981f723.jpg)

以隐马尔科夫模型为例，进行举例。

![](https://pic.imgdb.cn/item/612b714544eaada739834579.jpg)

本节总结：

![](https://pic.imgdb.cn/item/612b716a44eaada7398385a4.jpg)

### 变量消除法

背景条件：

![](https://pic.imgdb.cn/item/612b71e744eaada739846a16.jpg)

以马尔科夫链为例，讲解变量消除法，已知前$a,b,c$三个变量的情况，求边缘概率$p(d)$。很显然，他是$p(a,b,c,d)$的边缘概率，就是对除了$d$以外的其他变量求和，然后采用因子分解

为什么$p(d) = \sum\limits_{a,b,c}{p(a,b,c,d)}$？首先需要注意的是，**边缘概率$p(d)$也是一个函数，一个关于$d$的函数，即当$d=1, d=2$时概率应该是多少的函数**。$p(d)$是求边缘概率，即在其他各种情况下变量$d$的概率值。那么其他各种情况是指谁呢，那就是除了变量$d$以外的所有变量，即$a,b,c$。求值中，对于$\sum\limits_{a,b,c}{p(a,b,c,d)}$，每一次$a,b,c$取定一个值，都会得到一个关于$d$的函数$p(a,b,c,d)$，将它求和即可。例如$a,b,c,d$都是只能选0或1的二值变量，那么$p(d)=p(0,0,0,d)+p(1,0,0,d)+\dots+p(1,1,1,d)$。

![](https://pic.imgdb.cn/item/612b889644eaada739ba8f22.jpg)

如果“硬上”，那么对于最简单的0-1二值，3个变量，也需要加$2^3=8$次，如上图所示，而且随着维度$p$增加，需要加的次数$K^p$呈指数增长。那么采用最简单的变量消除思想，将每一个需要加的变量分离，例如先只考虑$a$变量，除非是所有变量全连接，否则他只跟他相连接的变量有值，其他都是0。

化简的原理其实是将先乘法后加法改为先加法后乘法，这样能节省，如下图所示。

![](https://pic.imgdb.cn/item/612b8ace44eaada739c0a01c.jpg)

这个的缺点在于**重复计算**，如果计算完$p(d)$之后，需要计算$p(c)$，那么还得再算一次；**消除次序对计算复杂度有影响**，因为算法先后顺序是敏感的，想要找到一个最优的消除次序，被证明是一个NP-hard问题。

### 信念传播算法--引入

背景知识如下图。

![背景知识](https://pic.imgdb.cn/item/612b8fe344eaada739cf7375.jpg)

采用变量消除法，计算上图的p(e)，需要计算a->b,b->c,c->d,d->e这4个值，而如果需要计算p(c)，那么需要计算a->b,b->c和e->d, d->c这4个值，可以看到，其中a->b和b->c是重复计算的。

信念传播就是不管求那个变量的概率，先把所有的正向和反向值都算好，然后拿出来用就行。

这部分推导听得不是太懂，计算各部分还需要BP算法来算，$NB$代表变量的邻居，总结如下图。

![总结](https://pic.imgdb.cn/item/612b99f844eaada739f0125b.jpg)

### 信念传播算法--计算

如果求变量$a$，引入belief，按照通项公式，可以化为4项，后2项是$b$的2个孩子（children），然后$b$的自身（self），以及$b$到$a$的关系。$b$自身和孩子加起来就称为“belief”，代表$a$通过$b$这个子树获取到的所有信息。

![](https://pic.imgdb.cn/item/612b9adf44eaada739f3cfeb.jpg)

BP算法的实现很简单，基本上都是递归。

![](https://pic.imgdb.cn/item/612b9cfb44eaada739fb3da9.jpg)

### Max Product算法

背景知识：

![](https://pic.imgdb.cn/item/612b9df544eaada739fe8c91.jpg)

