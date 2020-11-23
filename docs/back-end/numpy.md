# 从python到Numpy

## 引言

### 简单例子

Numpy是关于向量化的，如果您熟悉Python，这是您将面临的主要困难，因为您需要改变您的思维方式，您的新朋友（包括其他人）被命名为“vectors”、“arrays”、“views”或“ufuncs”。

让我们举一个非常简单的例子，随机游走（random walk）。一种可能的面向对象方法是定义一个`RandomWalker`类并编写一个`walk`方法，该方法将在每个（random）步骤之后返回当前位置。很好，很可读，但很慢：

#### 面向对象方法

```python
class RandomWalker:
    def __init__(self):
        self.position = 0

    def walk(self, n):
        self.position = 0
        for i in range(n):
            yield self.position
            self.position += 2*random.randint(0, 1) - 1

walker = RandomWalker()
walk = [position for position in walker.walk(1000)]
```

基准测试告诉我们。

```batch
>>> from tools import timeit
>>> walker = RandomWalker()
>>> timeit("[position for position in walker.walk(n=10000)]", globals())
10 loops, best of 3: 15.7 msec per loop
```

#### 程序方法

对于这样一个简单的问题，我们可能可以保存类定义，只关注walk方法，该方法在每个随机步骤之后计算连续的位置。

```python
def random_walk(n):
    position = 0
    walk = [position]
    for i in range(n):
        position += 2*random.randint(0, 1)-1
        walk.append(position)
    return walk

walk = random_walk(1000)
```

这个新方法节省了一些CPU周期，但没有那么多，因为这个函数与面向对象方法中的函数几乎相同，而且我们节省的几个周期可能来自Python面向对象的内部机制。

```batch
>>> from tools import timeit
>>> timeit("random_walk(n=10000)", globals())
10 loops, best of 3: 15.6 msec per loop
```

#### 矢量化方法

但是我们可以更好地使用Python的itertools模块，该模块提供了*一组函数来创建迭代器以实现高效循环*。如果我们观察到随机行走是一个步骤的累积，我们可以通过首先生成所有步骤来重写函数，然后在没有任何循环的情况下累加它们：

```python
def random_walk_faster(n=1000):
    from itertools import accumulate
    # 仅适用于Python3.6
    steps = random.choices([-1,+1], k=n)
    return [0]+list(accumulate(steps))

 walk = random_walk_faster(1000)
```

实际上，我们已经将函数*向量化*了。我们没有循环选择顺序步骤并将其添加到当前位置，而是首先一次生成所有步骤，并使用`accumulate`函数计算所有位置。我们摆脱了循环，这让事情变得更快：

```batch
>>> from tools import timeit
>>> timeit("random_walk_faster(n=10000)", globals())
10 loops, best of 3: 2.21 msec per loop
```

与之前的版本相比，我们获得了85%的计算时间，还不错。但是这个新版本的优点是它使numpy矢量化变得非常简单。我们只需要将itertools调用转换为numpy调用。

```python
def random_walk_fastest(n=1000):
    # 在numpy的choice函数中没有‘s’ (Python提供了choice和choices)
    steps = np.random.choice([-1,+1], n)
    return np.cumsum(steps)

walk = random_walk_fastest(1000)
```

不太难，但我们使用numpy将效率提升了500倍：

```batch
>>> from tools import timeit
>>> timeit("random_walk_fastest(n=10000)", globals())
1000 loops, best of 3: 14 usec per loop
```

这本书是关于向量化的，无论是在代码层面还是在问题层面。在研究自定义矢量化之前，我们将看到这种差异的重要性。

### 可读性vs速度

在进入下一章之前，我想提醒您，一旦您熟悉了numpy，您可能会遇到一个潜在的问题。它是一个非常强大的库，你可以用它创造奇迹，但是，大多数时候，这是以可读性为代价的。如果您在编写代码时不加注释，那么在几周（或者可能几天）之后，您将无法判断函数在做什么。例如，你能说出下面两个函数在做什么吗？也许你能分辨出第一本书，但不太可能知道第二本书（或者你的名字叫杰米·费尔南德斯·德尔雷奥，你不需要读这本书）。

```python
def function_1(seq, sub):
    return [i for i in range(len(seq) - len(sub)) if seq[i:i+len(sub)] == sub]

def function_2(seq, sub):
    target = np.dot(sub, sub)
    candidates = np.where(np.correlate(seq, sub, mode='valid') == target)[0]
    check = candidates[:, np.newaxis] + np.arange(len(sub))
    mask = np.all((np.take(seq, check) == sub), axis=-1)
    return candidates[mask]
```

正如您可能已经猜到的，第二个函数是第一个函数的矢量化优化更快的numy版本。它比纯Python版本快10倍，但几乎不可读。

## 数列（array）的剖析

### 介绍

正如序言中所解释的，你应该对numpy有一个基本的经验来阅读这本书。如果不是这样的话，你最好在回来之前先从初学者教程开始。因此，我将在这里简要介绍numpy数组的基本结构，特别是关于内存布局、视图、副本和数据类型。如果你想让你的计算受益于numpy哲学，它们是需要理解的关键概念。