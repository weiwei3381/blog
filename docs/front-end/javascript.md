# Javascript/ECMAScript 相关技术

## 对象(Object)方法

- 遍历对象属性名
  `Object.keys()`方法与`Object.getOwnPropertyNames()`方法很相似，一般用来遍历对象的（属性名，索引），并返回一个数组，该数组成员都是对象自身的（不是继承的），区别在于`Object.keys`方法只返回可枚举的属性，`Object.getOwnPropertyNames`方法还能返回不可枚举的属性名。

- 对象的合并
  Object.assign 方法用于对象的合并，将源对象（source）的所有可枚举属性，复制到目标对象（target），示例代码：

```js
const target = { a: 1 }
const source1 = { b: 2 }
const source2 = { c: 3 }
Object.assign(target, source1, source2)
//target为{a:1,b:2,c:3}
```

:::tip 注意

1. _浅拷贝_
   `Object.assign`方法实行的是浅拷贝，而不是深拷贝。也就是说，如果源对象某个属性的值是对象，那么目标对象拷贝得到的是这个对象的引用。
2. _同名属性的替换_
   对于这种嵌套的对象，一旦遇到同名属性，`Object.assign`的处理方法是替换，而不是添加。
   该方法也可用于对象的浅拷贝：`let newObj = Object.assign({}, myObject)`, 即把需要拷贝的对象与空对象{}合并即可
   :::

## 数组(Array)方法

### Array.isArray()

`Array.isArray()`用于确定传递的值是否是一个 Array。

```js
Array.isArray([1, 2, 3]) // true
Array.isArray({ foo: 123 }) // false
Array.isArray('foobar') // false
Array.isArray(undefined) // false
```

### Array.prototype.find()

`find()`方法返回数组中满足提供的测试函数的**第一个**元素的值。否则返回 undefined。

```js
const array1 = [5, 12, 8, 130, 44]
const found = array1.find((element) => element > 10)
console.log(found) // 输出结果: 12
```

### Array.prototype.findIndex()

与`find()`类似,`findIndex()`方法返回数组中满足提供的测试函数的**第一个元素**的索引。否则返回-1。这里的索引是从 0 开始计算。

```js
const array1 = [5, 12, 8, 130, 44]
const isLargeNumber = (element) => element > 13
console.log(array1.findIndex(isLargeNumber)) // 输出结果: 3
```

### Array.prototype.map()

`map()` 方法创建一个新数组，其结果是该数组中的每个元素都调用一次提供的函数后的返回值，**原数组保持不变**。

```js
const array1 = [1, 4, 9, 16]
// map需要传递一个函数
const map1 = array1.map((x) => x * 2)
console.log(map1) // 输出值为[2, 8, 18, 32]
```

### Array.prototype.forEach()

`forEach()`方法对数组的每个元素执行一次给定的函数，对原数组没有影响。

```js
const array1 = ['a', 'b', 'c']
array1.forEach((element) => console.log(element))
// 输出: "a"
// 输出: "b"
// 输出: "c"
```

## 立即执行函数

> `( function(){…} )()`和`( function (){…} () )`是两种 javascript 立即执行函数的常见写法，最初我以为是一个括号包裹匿名函数，再在后面加个括号调用函数，最后达到函数定义后立即执行的目的，后来发现加括号的原因并非如此。

### 函数声明、函数表达式、匿名函数

- 函数声明：`function fnName () {…};`使用 function 关键字声明一个函数，再指定一个函数名，叫函数声明。

- 函数表达式： `var fnName = function () {…};`使用 function 关键字声明一个函数，但未给函数命名，最后将匿名函数赋予一个变量，叫函数表达式。

- 匿名函数：`function () {};`使用 function 关键字声明一个函数，但未给函数命名，所以叫匿名函数，匿名函数属于函数表达式，匿名函数有很多作用，赋予一个变量则创建函数，赋予一个事件则成为事件处理程序或创建闭包等等。

:::tip 区别
函数声明和函数表达式不同之处在于：
一、Javascript 引擎在解析 javascript 代码时会**函数声明提升**（Function declaration Hoisting）当前执行环境（作用域）上的函数声明，而函数表达式必须等到 Javascirtp 引擎执行到它所在行时，才会从上而下一行一行地解析函数表达式；
二、函数表达式后面可以加括号立即调用该函数，函数声明不可以，只能以 `fnName()`形式调用。
:::

```js
fnName();
function fnName(){
    ...
}//正常，因为‘提升’了函数声明，函数调用可在函数声明之前

fnName();
var fnName=function(){
    ...
}//报错，变量fnName还未保存对函数的引用，函数调用必须在函数表达式之后

var fnName=function(){
    alert('Hello World');
}();//函数表达式后面加括号，当javascript引擎解析到此处时能立即调用函数

function fnName(){
    alert('Hello World');
}();//语法错误，Uncaught SyntaxError: Unexpected token ),这个函数会被js引擎解析为两部分：
    //1.函数声明 function fnName(){ alert('Hello World'); }
    //2.分组表达式 () 但是第二部分作为分组表达式语法出现了错误，因为括号内没有表达式，把“()”改为“(1)”就不会报错
    //但是这么做没有任何意义，只不过不会报错,分组表达式请见:
    //分组中的函数表达式http://www.nowamagic.net/librarys/veda/detail/1664

function(){
    console.log('Hello World');
}();//语法错误，Uncaught SyntaxError: Unexpected token (
```

在理解了一些函数基本概念后，回头看看`(function(){…} )()`和`( function (){…} () )`这两种立即执行函数的写法，要在函数体后面加括号就能立即调用，则这个函数**必须是函数表达式**，不能是函数声明。下面是一些例子:

```js
function(a){
        console.log(a);   //报错,Uncaught SyntaxError: Unexpected token (
}(12);
(function(a){
    console.log(a);   //firebug输出123,使用（）运算符
})(123);

(function(a){
    console.log(a);   //firebug输出1234，使用（）运算符
}(1234));

!function(a){
    console.log(a);   //firebug输出12345,使用！运算符
}(12345);

+function(a){
    console.log(a);   //firebug输出123456,使用+运算符
}(123456);

-function(a){
    console.log(a);   //firebug输出1234567,使用-运算符
}(1234567);

var fn=function(a){
    console.log(a);   //firebug输出12345678，使用=运算符
}(12345678)
// 需要注意的是:这么写只是一个赋值语句,即把函数匿名函数function(a){...}()的返回值赋值给了fn,
// 如果函数没有返回值,那么fn为undefined,

// 下面给出2个例子,用来解答读者的疑惑:
var fn=function(a){
    console.log(a);   //firebug输出12345678，使用=运算符
}(12345678);
console.info(fn);//控制台显示为undefined;
fn(123);//函数未定义报错,fn is undefiend

var fn=function(a){
    console.log(a);   //firebug输出12345678，使用=运算符
    return 111;
}(12345678);
console.info(fn);//会发现fn就是一个返回值111,而不是一个函数
fn(123);//报错,因为fn不是一个函数
```

::: warning 结论

- 从输出结果可知：在 function 前面加！、+、 - 甚至是逗号等到都可以起到函数定义后立即执行的效果，而（）、！、+、-、= 等运算符，都将函数声明转换成函数表达式，消除了 javascript 引擎识别函数表达式和函数声明的歧义，告诉 javascript 引擎这是一个函数表达式，不是函数声明，可以在后面加括号，并立即执行函数的代码。

- **加括号是最安全的做法**，因为！、+、- 等运算符还会和函数的返回值进行运算，有时造成不必要的麻烦。

- javascript 中没用私有作用域的概念，如果在多人开发的项目上，你在全局或局部作用域中声明了一些变量，可能会被其他人不小心用同名的变量给覆盖掉，根据 javascript 函数作用域链的特性，可以使用这种技术可以模仿一个私有作用域，用匿名函数作为一个 “容器”，“容器” 内部可以访问外部的变量，而外部环境不能访问 “容器” 内部的变量，所以 ( function(){…} )() 内部定义的变量不会和外部的变量发生冲突，俗称 “匿名包裹器” 或“命名空间”。

:::

最佳实践:

```js
// js引擎执行到这块就会马上执行，跟我们平时写在js文件代码块一样 只不过这样写的好处防止变量污染，也就是立即执行函数可以当做命名空间(namespace)使用
// 立即执行函数就是个壳或者执行空间
;(function() {
  // 内容
})()
```

## 面向对象

1. 在 es6 提供的 class 语法中, 如果继承了某个类, 而且在`constructor`构造函数中使用了`this.属性`的操作, 则必须调用父类构造函数,即`super()`.
