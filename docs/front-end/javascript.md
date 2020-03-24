# Javascript/ECMAScript相关技术

## JS实用方法

### 对象方法

- 遍历对象属性名
`Object.keys()`方法与`Object.getOwnPropertyNames()`方法很相似，一般用来遍历对象的（属性名，索引），并返回一个数组，该数组成员都是对象自身的（不是继承的），区别在于`Object.keys`方法只返回可枚举的属性，`Object.getOwnPropertyNames`方法还能返回不可枚举的属性名。

- 对象的合并
Object.assign方法用于对象的合并，将源对象（source）的所有可枚举属性，复制到目标对象（target），示例代码：

```js
const target={ a: 1 }
const source1={ b: 2 }
const source2={ c: 3 }
Object.assign(target, source1, source2)
//target为{a:1,b:2,c:3}
```

:::tip 注意
1. *浅拷贝*
`Object.assign`方法实行的是浅拷贝，而不是深拷贝。也就是说，如果源对象某个属性的值是对象，那么目标对象拷贝得到的是这个对象的引用。
2. *同名属性的替换*
对于这种嵌套的对象，一旦遇到同名属性，`Object.assign`的处理方法是替换，而不是添加。
该方法也可用于对象的浅拷贝：`let newObj = Object.assign({}, myObject)`, 即把需要拷贝的对象与空对象{}合并即可
:::
