# 学习 Typescript 实战开发

## typescript类型语法

### ts中的原始和对象类型

- 原始类型：标注使用 `: 类型 `的语法，这里的`类型`主要指 string / number / boolean。
- 数组类型：有两种描述方式, `Array<数组类型>` 或 `数组类型[]`。
- 对象类型：首先写一个`interface`接口, 然后再使用这个接口来作为对象类型变量的类型标注。其中, 接口的属性类型可以是任意有效的类型，那么它当然也还可以又是一个接口。对象的可选标记为`?`

例如:

```ts
// 原始类型
const userName: string = 'linbudu';
const userAge: number = 18;
const userMarried: boolean = false;

// 数组类型
const userNames1: string[] = [];
const userNames2: Array<string> = [];

// 对象类型
// 先写一个interface接口
interface User {
  userName: string;
  userAge: number;
  userMarried: boolean;
}
// 然后再标注类型
const user: User = {
  userName: 'test',
  userAge: 20,
  userMarried: false,
};

// 接口中还能继续用接口
interface JobModel {
  // ...
}

interface Job {
  currentModel: JobModel;
}

// 类型的可选标记, 其中userJob为可选标记
interface User {
  userName: string;
  userAge: number;
  userMarried: boolean;
  userJob?: string;
}
```

- 枚举类型: 定义常量的方式, 关键词为`enum`, 对于数字类型的值，枚举能够自动累加值; 枚举中可以同时支持数字、字符串、函数计算等成员. 
- Set与Map类型：使用`Set<类型>`或者`Map<类型,类型>`表示.



```ts
// 枚举效果
enum UserLevelCode {
  Visitor = 10001,
  NonVIPUser = 10002,
  VIPUser = 10003,
  Admin = 10010,
  // ... 
}

// 枚举能够自动累加值
enum UserLevelCode {
  Visitor = 10001,
  NonVIPUser,
  VIPUser,
  Admin = 10010,
  // ...
}

// 枚举中可以同时支持数字、字符串、函数计算等成员
function generate() {
  return Math.random() * 10000;
}

enum UserLevelCode {
  Visitor = 10001,
  NonVIPUser = 10002,
  VIPUser,
  Admin,
  Mixed = 'Mixed',
  Random = generate(),
  // ...
}

// Set与Map类型
const set = new Set<number>();

set.add(1);
set.add('2'); // X 类型“string”的参数不能赋给类型“number”的参数。

const map = new Map<number, string>();

map.set(1, '1');
map.set('2', '2'); // X 类型“string”的参数不能赋给类型“number”的参数。
```
- `any`类型: 即"任意类型", 实际上使用了`any`类型，就意味着告诉类型检查系统，这个变量我给它开白名单了，你放过它吧，它想干啥就干啥, 同时也无法得到精确的类型提示了, 因此`any类型 = 万能类型 + 放弃类型检查`
- `unknown`类型: 表示万能类型的同时，保留类型检查。可以使用类型断言告诉ts类型系统这个变量是个啥, 关键词为`as`

```ts
function myFunc(param: unknown) {
  // ...
}

myFunc({});
myFunc([]);
myFunc(true);
// 都不会报错，和any类型一样好用

// 但是在尝试使用一个 unknown 类型的变量时，类型检查系统阻止了我们，它要求我们先为这个变量提供一个具体的类型后才能使用。
function myFunc(param: unknown) {
  param.forEach((element) => {}); // X “param”的类型为“未知”。
}

// 使用类型断言, 把unknown 类型的变量断言到数组类型
function myFunc(param: unknown) {
  (param as unknown[]).forEach((element) => {});
}
```

:::tip 总结
`any`类型和`unknown`类型都能提供万能类型的作用，但不同之处在于，使用`any`类型后就丧失了类型检查的保护，可以对变量进行任意操作。而使用`unknown`类型时，虽然我们每进行一次操作都需要进行类型断言，断言到当前我们预期的类型，但这却能实现类型信息反向补全的功能，为最终我们的具体类型埋下伏笔。虽然`any`类型的使用过程中也可以通过类型断言保障，但毕竟缺少了类型告警，我们很容易就忽略掉了。
:::


### ts中的函数类型

类似于对变量的`: 类型`写法，我们在参数后标注这个参数的类型，在参数块与函数体之间标注函数的返回值类型。

也可以使用`type`关键字声明一个独立的函数类型, 其中`type Sum = `的语法称为类型别名，相当于给类型起一个新名字, 注意写法中用的是`=>`符号.

如果函数没有返回值则将其返回值类型标注为`void`.如果希望将返回值类型标注为`undefined`，就需要有显式的 return 语句

```ts
// 类型原始类型对象
function sum(a: number, b: number): number {
  return a + b;
}

const sum = function(a: number, b: number): number {
  return a + b;
};

// 用类型别名语法设置一个独立的函数类型
type Sum = (a: number, b: number) => number;

const sum: Sum = function(a, b) {
  return a + b;
};
```

另外, TypeScript 支持了类型层面的重载, 但本质上TypeScript中的函数重载还是属于伪重载，就是将其转换为朴素的`if else`判断当前是哪个参数组合, 它只能在类型层面帮你实现重载的效果，例如：

```ts
function sum(base: number, incre: number): number;
function sum(baseArray: number[], incre: number): number[];
function sum(incre: number, baseArray: number[]): number[];
function sum(baseArray: number[], increArray: number[]): number[];
function sum(x: number | number[], y: number | number[]): number | number[] { }
```

### ts中的面向对象

下面是ES6中典型的面向对象语法, 目的是计算一个圆的周长和面积:

```js
class Circle {

  radius;

  constructor(radius) {
    // 要描述圆形，最重要的一个属性就是半径
    this.radius = radius;
  }
  
  getArea() {
    return Math.PI * this.radius ** 2;
  }
  
  getCircumference() {
    return 2 * Math.PI * this.radius;
  }
}

const circle = new Circle(5);
console.log(`面积为：${circle.getArea()}， 周长为：${circle.getCircumference()}.`);
```
相比ES6的`Class`，TypeScript中`Class`的语法只是多了一道类型描述, 下面是js的语法.
```js
class Person {
  name;
  age;

  constructor(personName, personAge) {
    this.name = personName;
    this.age = personAge;
  }
  
  getDesc(): string {
    return `${this.name} at ${this.age} years old`;
  }
}
```

下面是ts的语法, 增加类型描述, 增加公有(`public`)或者私有(`private`)的标记, 使用`static`标记类中方法或者对象为静态, 即无需对类进行初始化即可使用.

```ts
/* typescript的class类型 */
class Person {
  private name: string;
  private age: number;

  constructor(personName: string, personAge: number) {
    this.name = personName;
    this.age = personAge;
  }

  public getDesc(): string {
    return `${this.name} at ${this.age} years old`;
  }
}

const person = new Person("Linbudu", 18);

console.log(person.getDesc()); // Linbudu at 18 years old

// 文件1中定义的类和静态方法
export class DateUtils {
  static isSameDate(){ }
  static diffDate(){ }
}

// 在文件2中直接可以使用,无语实例化
import { DateUtils } from './utils';
DateUtils.isSameDate();
```

类似的，如图片地址、配置信息这样的常量，也可以使用` Class + 静态成员`来定义。

### ts中的联合和类型交叉类型

- 联合类型: 语法为`A | B | C`, 只要你的变量满足其中一个类型成员，就可以被认为满足这个类型，需要使用类型别名来存放.
- 交叉类型: 语法为`A & B & C`, 即要同时满足ABC三个对象的所有属性，才能认为是实现了该类型。

```ts
/* 联合类型 */
type PossibleTypes = string | number | boolean;
type Status = 'success' | 'failure';
type Code = 200 | 404 | 502;

/* 交叉类型 */
interface UserBasicInfo {}
interface UserJobInfo {}
interface UserFamilyInfo {}
// 需要实现 UserBasicInfo、UserJobInfo、UserFamilyInfo 这三个对象类型的所有属性，才能认为是实现了 UserInfo 类型
type UserInfo = UserBasicInfo & UserJobInfo & UserFamilyInfo;
```

### ts中的泛型

泛型的本质就是类型世界中的参数。在 TypeScript 中，变量与函数都由类型别名来承担，而一个类型别名一旦声明了泛型，就会化身成为函数，此时严格来说我们应该称它为"工具类型"。

```ts
/* 别名定义中使用泛型 */
type Status<T> = 'success' | 'failure' | 'pending' | T;

type CompleteStatus = Status<'offline'>;  // 等价于'success' | 'failure' | 'pending' | 'offline';

/* 函数中使用泛型  */
function factory<T>(input: T): T {
  // ...
}  // <T>是声明了一个泛型，而参数类型与返回值类型标注中的 T 就是普通的类型标注了。

/* 多个泛型参数 */
function factory<T1, T2, T3>(input: T1, arg1: T2, arg2: T3): T1 {
  // ...
}

```

### ts中的工具类型

TypeScript内置的，专用于对类型进行编程的工具方法——我们称之为工具类型。TypeScript 内置了一批简单的工具类型，它们就是类型别名的使用方式，同时在全局可用，无需导入：

- `Partial`：语法是`Partial<T>`，将对象类型`T`的所有属性都标记为可选；
- `Required`：语法是`Required<T>`，将对象类型`T`的所有属性标记为必选。
- `Readonly`：语法是`Readonly<T>`，将对象类型`T`的所有属性标记为只读； 
- `Record`：语法是`Record<K,T>`，构造一个对象类型，Keys 表示对象的属性键 、Type 表示对象的属性值，用于将一种类型属性映射到另一种类型，另外还可以使用`Record`类型来声明属性名还未确定的接口类型，如：`type User = Record<string, string>;`
- `Pick`：语法是`Pick<T, K extends keyof T>`,从类型定义的属性中，选取指定一组属性，返回一个新的类型定义。即对对象类型`T`进行裁剪，只保留你传入的属性名组成的部分。
- `Omit`: 语法是`Omit<T, K extends keyof T>`，与`Pick`方法作用相似，只不过`Omit`是：以类型`T`为基础剔除某些属性，然后返回一个新类型。
- `Exclude`：表示差集，语法是`Exclude<T1, T2>`，它能够从类型T1中移除另一个类型T2中也存在的部分.
- `Extract`：表示交集，语法是`Extract<T1, T2>`，取类型T1和T2相同的部分。

```ts
/* 1、Partial可选类型 */
type User = {
  name: string;
  age: number;
  email: string;
};
// 不必将对象中每个属性都实现了
type PartialUser = Partial<User>;
// 可以不实现全部的属性了！
const partialUser: PartialUser = {
  name: 'John Doe',
  age: 30
};

/* 2、Required必选类型 */
// 每个属性都不是必须得
type User = {
  name?: string;
  age?: number;
  email?: string;
};
// 使用required之后每个属性都是必须的
type RequiredUser = Required<User>;
// 现在你必须全部实现这些属性了
const requiredUser: RequiredUser = {
  name: 'John Doe',
  age: 30,
  email: 'john.doe@example.com'
};

/* 3、Readonly只读类型 */
type User = {
  name: string;
  age: number;
  email: string;
};

type ReadonlyUser = Readonly<User>;
// 修改 readonlyUser 对象的属性
// readonlyUser.name = 'Jane Doe';  // 报错
// readonlyUser.age = 25;  // 报错
// readonlyUser.email = 'jane.doe@example.com';  // 报错


/* 4、Record对象映射 */
type UserProps = 'name' | 'job' | 'email';
// 等价于你一个个实现这些属性了
type User = Record<UserProps, string>;
const user: User = {
  name: 'John Doe',
  job: 'fe-developer',
  email: 'john.doe@example.com'
};

/* 5、Pick选取指定属性 */
type User = {
  name: string;
  age: number;
  email: string;
  phone: string;
};
// 只提取其中的 name 与 age 信息
type UserBasicInfo = Pick<User, 'name' | 'age'>;
const userBasicInfo: UserBasicInfo = {
  name: 'John Doe',
  age: 30
};

/* 6、剔除指定属性 */
type User = {
  name: string;
  age: number;
  email: string;
  phone: string;
};
// 只移除 phone 属性
type UserWithoutPhone = Omit<User, 'phone'>;
const userWithoutPhone: UserWithoutPhone = {
  name: 'John Doe',
  age: 30,
  email: 'john.doe@example.com'
};

/* 7、差集Exclude */
type UserProps = 'name' | 'age' | 'email' | 'phone' | 'address';
type RequiredUserProps = 'name' | 'email';
// OptionalUserProps = UserProps - RequiredUserProps
type OptionalUserProps = Exclude<UserProps, RequiredUserProps>;
const optionalUserProps: OptionalUserProps = 'age' | 'phone' | 'address';

/* 8、交集Extract */
type UserProps = 'name' | 'age' | 'email' | 'phone' | 'address';
type RequiredUserProps = 'name' | 'email';
type RequiredUserPropsOnly = Extract<UserProps, RequiredUserProps>;
const requiredUserPropsOnly: RequiredUserPropsOnly = 'name' | 'email';
```

:::tip 注意
`Pick`与`Omit`类型是类型编程中相当重要的一个部分，举例来说，我们可以先声明一个代表全局所有状态的大型接口类型，然后在我们的子组件中，可能只用到了其中一部分的类型，此时就可以使用`Pick`类型将我们需要的部分择出来。

反之，如果我们用到了大部分类型，只有数个类型需要移除，就可以使用 Omit 类型来减少一些代码量
:::

工具类型中也有处理函数类型的，主要有以下几种：

- `Parameters`：提取函数类型的参数类型，语法是`Parameters<T>`
- `ReturnType`：提取函数类型的返回值类型，语法是`ReturnType<T>`
- `typeof`：当只有函数，而没有函数对应的类型时，可以使用类型查询操作符，查询对应函数的类型
- `Awaited`：提取Promise内部的函数类型，例如返回值为`Promise<string>`，可以使用`Awaited`提取其中的string

```ts
/* 使用Parameters和ReturnType提取函数类型的参数类型和返回值类型 */
type Add = (x: number, y: number) => number;

type AddParams = Parameters<Add>; // [number, number] 类型
type AddResult = ReturnType<Add>; // number 类型

const addParams: AddParams = [1, 2];
const addResult: AddResult = 3;


/* 使用typeof查询函数的类型 */
const addHandler = (x: number, y: number) => x + y;

type Add = typeof addHandler; // (x: number, y: number) => number;

type AddParams = Parameters<Add>; // [number, number] 类型
type AddResult = ReturnType<Add>; // number 类型

const addParams: AddParams = [1, 2];
const addResult: AddResult = 3;


/* 使用Awaited提取Promise中的类型 */
const promise = new Promise<string>((resolve) => {
  setTimeout(() => {
    resolve("Hello, World!");
  }, 1000);
});

type PromiseInput = Promise<string>;
type AwaitedPromiseInput = Awaited<PromiseInput>; // string
```

### ts中的模板字符串类型

在类型检查方面，模板字符串类型可以提供更为精确的字符串类型结构描述，比如此前，我们无法检查一个字符串是否满足 1.2.3 这样结构的版本号格式，但是使用模板字符串可以做到：

```ts
type Version = `${number}.${number}.${number}`;

const v1: Version = '1.1.0';
const v2: Version = '1.0'; // 报错：类型 "1.0" 不能赋值给类型 `${number}.${number}.${number}`
const v3: Version = 'a.0.0'; // 报错：类型 "a.0" 不能赋值给类型 `${number}.${number}.${number}`
```

模板字符串类型的诞生不仅是为了实现字面量类型的拼接，还有一个重要的能力是其自动分发的特性，即当一个模板字符串类型中的插槽传入了联合类型时，这个模板字符串类型会自动被扩展为使用所有联合类型的组合。

```ts
type Brand = 'iphone' | 'xiaomi' | 'honor';
type Memory = '16G' | '64G';
type ItemType = 'official' | 'second-hand';
// 得到了一个由所有联合类型的可能分支进行排列组合，共 3x2x2 = 12 个类型组成的联合类型
type SKU = `${Brand}-${Memory}-${ItemType}`;
```

## 配置react和typescript的项目

### 创建 package.json

在项目根目录下创建一个包含以下内容的`package.json`文件：

```json
{
  "name": "my-app",
  "description": "My React and TypeScript app",
  "version": "0.0.1"
}
```

### 添加网页

在 src 文件夹中，创建一个名为 index.html 的文件，其中包含以下内容：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>My app</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

React 应用程序将被注入到 div 元素中，id 属性值为 “root”。

### 添加 typescript

在 Visual Studio Code 终端中执行以下命令以安装打字稿：

`npm install --save-dev typescript`

添加`--save-dev`选项的目的在于指定 typescript 应作为仅开发依赖项安装。这是因为 TypeScript 仅在开发期间才需要，而不是在运行时需要。命令完成后，打开 `package.json`，`typescript`在`devDependencies`部分中列为开发依赖项：

```json
{
  "name": "my-app",
  "description": "My React and TypeScript app",
  "version": "0.0.1",
  "devDependencies": {
    "typescript": "^5.3.2"
  }
}
```

接下来，创建`TypeScript`配置文件，在项目根目录下创建`tsconfig.json`文件，并在其中输入以下内容。需要注意的是，`noEmit`设置为`true`确保**TypeScript 不会执行任何转译**，这方面工作将使用`Babel`，而`TypeScript`将专注于类型检查。

```json
{
  "compilerOptions": {
    "noEmit": true, //禁止 TypeScript 编译器执行任何转译
    "lib": ["dom", "dom.iterable", "esnext"], // 提供类型检查过程中包含的标准库类型。esnext 是下一版 JavaScript 中的 API 类型
    "moduleResolution": "node", // 找到依赖项的方式，假如希望 TypeScript 在 node_modules 文件夹中查找，因此设置为node
    "allowSyntheticDefaultImports": true, // 由于react默认是commonjs规范导出，启用该配置允许将 React 作为默认导入导入
    "esModuleInterop": true, //允许将 React 作为默认导入导入
    "jsx": "react", // 当设置为 React 时，允许编译器转译 React 的 JSX。
    "forceConsistentCasingInFileNames": true, // 强制代码中使用的模块文件名必须和文件系统中的文件名保持大小写一致
    "strict": true // 严格的类型检查级别
  },
  "include": ["src"], // 指定需要编译处理的文件列表，支持 glob 模式匹配
  "exclude": ["node_modules", "dist"] // 用于指定当解析include选项时，需要忽略的文件列表
}
```

### 添加 React

接下来，将`React`及其`TypeScript`类型安装到项目中。然后我们将添加一个 React 根组件。为此，请执行以下步骤：

1.在终端中执行`npm install react react-dom`安装 React。其中`react`为核心库，它用于 React 的所有变体；`react-dom`是用于构建 Web 应用程序的 React 变体。

2.React 不包含 TypeScript 类型，需要单独安装：`npm install --save-dev @types/react @types/react-dom`

3.根组件将位于`src`文件夹中名为`index.tsx`的文件，文件内容如下：

```tsx
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// 类型断言，即明确告诉 TypeScript 该类型应该是什么。如果没有类型断言，TypeScript 会将类型推断为 HTMLElement | null，因为 document.getElementById 可能找不到元素并返回 null。
const root = createRoot(document.getElementById("root") as HTMLElement);

function App() {
  return <h1>My React and TypeScript App!</h1>;
}
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

此文件将 React 应用程序注入到`id`为“root”的 DOM 元素中，该应用程序很简单，主要用于显示一个名为“My React and TypeScript App!”的标题。

### 添加 Babel

如前所述，`Babel`将在本项目中将`React`和`TypeScript`代码转译为 `JavaScript`。执行以下步骤来安装和配置`Babel`：

```shell
# 安装 Babel 核心库
npm install --save-dev @babel/core

# 接下来安装Babel插件，增加Babel功能

# 允许使用最新的JavaScript功能
npm i -D @babel/preset-env

# 将 React 代码转换为 JavaScript
npm i -D @babel/preset-react

# 将 TypeScript 代码转换为 JavaScript
npm i -D @babel/preset-typescript

# 最后安装的两个插件允许在 JavaScript 中使用 async 和 await 功能
npm i -D @babel/plugin-transform-runtime @babel/runtime
```

Babel 可以在一个名为`.babelrc.json`的文件中配置。在项目的根目录下创建此文件，其中包含以下内容：

```json
{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react",
    "@babel/preset-typescript"
  ],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "regenerator": true
      }
    ]
  ]
}
```

接下来，我们将用 webpack 将所有内容粘合在一起。

### 添加 Webpack

Webpack 是一种流行的工具，主要将`JavaScript`源代码文件捆绑在一起。它可以在扫描文件时运行其他工具，例如`Babel`。因此，我们将使用`webpack`扫描所有源文件并将它们转译为 `JavaScript`。`webpack`的输出将是`index.html`中引用的单个`JavaScript`包。

执行以下步骤来安装 webpack 及其关联的库：

```shell
# 安装核心 webpack 库及其命令行界面，由于webpack包中有TypeScript类型，所以无需单独安装@types包
npm i -D webpack webpack-cli

# 安装 webpack 的开发服务器
npm i -D webpack-dev-server

# babel-loader插件允许Babel将React和TypeScript代码转译为JavaScript
npm i -D babel-loader

# Webpack可以创建托管React应用程序的index.html文件。我们希望webpack使用src/index.html文件作为模板，并将React应用程序的捆绑包添加到其中。一个名为html-webpack-plugin的插件能够做到这一点。
npm i -D html-webpack-plugin
```

接下来，我们将配置 webpack 来做我们需要的一切。可以创建用于开发和生产的单独配置，因为要求略有不同。但是，我们将在本章中重点介绍用于开发的配置。执行以下步骤来配置 webpack：

首先，安装一个名为 ts-node 的库，它允许在 TypeScript 文件中定义配置：

`npm i -D ts-node`

现在，我们可以添加开发配置文件。在项目根目录中创建一个名为 webpack.dev.config.ts 的文件，文件内容如下：

```ts
import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import {
  Configuration as WebpackConfig,
  HotModuleReplacementPlugin,
} from "webpack";
import { Configuration as WebpackDevServerConfig } from "webpack-dev-server";

type Configuration = WebpackConfig & {
  devServer?: WebpackDevServerConfig;
};

const config: Configuration = {
  mode: "development",
  output: {
    publicPath: "/",
  },
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
    }),
    new HotModuleReplacementPlugin(),
  ],
  devtool: "inline-source-map",
  devServer: {
    static: path.join(__dirname, "dist"),
    historyApiFallback: true,
    port: 4000,
    open: true,
    hot: true,
  },
};

export default config;
```

配置中比较重要的点在于：

- `mode`属性告诉`webpack`配置是为了开发，这意味着 React 开发工具包含在捆绑包中。
- `output.publicPath`属性是应用的根路径，这对于开发服务器中的深层链接正常工作非常重要
- `entry`属性告诉 webpack，React 应用程序的入口在哪里，在该项目中是 `index.tsx`
- Webpack 希望配置对象是默认导出，因此使用`export default config`将配置对象默认导出；
- `module`属性告诉`webpack`应如何处理不同的模块。我们需要告诉 webpack 对带有 .js、.ts 和 .tsx 扩展进行转换；
- `resolve.extensions`属性告诉 webpack 在模块解析期间查找 TypeScript 文件和 JavaScript 文件。
- `HtmlWebpackPlugin` 创建 HTML 文件。它已配置为使用`src/index.html`作为模板。
- `HotModuleReplacementPlugin`允许在应用程序运行时更新模块，而无需完全重新加载。
- `devtool`属性告诉`webpack`使用完整的内联源文件，这允许在转译之前调试原始源代码。
- `devServer`属性配置 webpack 开发服务器。它将 Web 服务器根目录配置为`dist`文件夹，并在端口 4000 上提供文件。现在，需要 `historyApiFallback`才能使深层链接正常工作，并且我们还指定在服务器启动后打开浏览器。

最后，打开`package.json`并添加一个带有启动脚本的脚本部分：

```json
{
  ...,
  "scripts": {
    "start": "webpack serve --config webpack.dev.config.ts"
  }
}
```

现在，我们可以通过在终端中运行`npm run start`在开发模式下运行应用程序。

## 使用create-react-app快速配置

Create React App 可以帮助自动生成了React和TypeScript项目，其中包含我们可能需要的所有常用工具，包括 CSS 和单元测试支持。

`npx create-react-app myapp --template typescript`

`create-react-app`是创建项目的 Create React App 工具的包。将应用程序名称`myapp`传递给它，同时指定了使用typescript模板来创建项目。

命令创建完项目后，在`myapp` 文件夹中使用Visual Studio Code重新打开该项目。

:::tip 注意
使用create-react-app命令如果出错的话，可以尝试将npm源设置为华为源后再清除npm缓存，之后再次重试即可。

```shell
npm config set registry https://repo.huaweicloud.com/repository/npm/

npm cache clean -f
```
:::

### 将 linting 添加到 Visual Studio Code

linting（检查）是检查代码是否存在潜在问题的过程，通常的做法是在编写代码时使用linting工具在开发过程的早期捕获问题。[ESLint](https://eslint.org/)工具十分流行，它可以检查React 和 TypeScript 代码。幸运的是，Create React App已经在我们的项目中安装并配置了ESLint。

Visual Studio Code等编辑器可以与ESLint集成，以突出显示潜在的问题。在Visual Studio Code中打开“扩展”栏，搜索“eslint”关键词，找到由”Microsoft“开发的名称为“ESLint”插件安装即可。

为了确保 ESLint 扩展能够检查 React 和 TypeScript，需要进行相应配置，在Visual Studio Code中打开“设置”选项，在设置搜索框中，输入 `eslint:probe`，然后选择`Workspace`选项卡，定义 ESLint 检查代码时要使用的语言，典型设置如下所示：

```json
"eslint.probe": [
  "javascript",
  "javascriptreact",
  "typescript",
  "typescriptreact",
  "html",
  "vue",
  "markdown"
]
```

### 添加Prettier格式化代码

[Prettier](https://prettier.io/docs/en/options.html)是一种流行的工具，能够格式化React和TypeScript代码。不幸的是，`create-react-app`程序不会安装和配置它。执行以下步骤以在项目中安装和配置Prettier。

1.在项目根目录中执行以下命令以安装和配置Prettier：

`npm i -D prettier`

Prettier 作为开发依赖项安装，因为它仅在开发时使用，而不是在运行时使用。

2.Prettier 与 ESLint 具有重叠的样式规则，因此请安装以下两个库，以允许 Prettier 负责 ESLint 的样式规则：

`npm i -D eslint-config-prettier eslint-plugin-prettier`

`eslint-config-prettier`的作用在于禁用冲突的 ESLint 规则，而 `eslint-plugin-prettier` 配置使用 Prettier 格式化代码的 ESLint 规则。

3.ESLint 配置需要更新，以允许 Prettier 管理样式规则。Create React App 允许 ESLint 配置覆盖 在 package.json 的 eslintConfig 部分中。将 Prettier 规则添加到 package.json 中的 eslintConfig 部分，如下所示：

```json
{
  ...,
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest",
      "plugin:prettier/recommended"
    ]
  },
  ...
}
```

4.Prettier可以在名为.prettierrc.json的文件中配置。在根文件夹中创建包含以下内容的此文件：

```json
{
  "printWidth": 100,
  "singleQuote": true,
  "semi": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "endOfLine": "auto"
}
```
我们指定了以下内容：

- 100个字符后换行
- 字符串用单引号表示
- 分号放在语句的末尾
- 缩进级别为两个空格
- 多行数组和对象添加尾随逗号
- 保留现有行尾

:::tip 注意
如果Visual Studio Code中的ESLint没有按照Prettier定义的那样进行检查，可以将`ESLint`插件卸载了再重新安装。
:::

5.在Visual Studio Code中打开“扩展”选项卡，搜索“Prettier”并进行安装。在Visual Studio Code中打开“设置”选项。选择“workspace”选项卡，搜索“format on save”，勾选相关选项。在“default formatter”选项中，定义`Prettier`为默认格式化程序。


## vscode 配置

(1) **默认使用单引号**: 在设置中搜索`quote`, 在`Quote Style`中选择`single`.
(2) **代码缩进为 2 个空格**: 在设置中搜索`tab`, 在`Tab Size`中设置为`2`.
(3) **代码自动格式化**: 在扩展中搜索并安装`prettier`, 在设置中搜索`format on save`, 启用后保存文件会自动格式化代码.
![prettier图标](https://s1.ax1x.com/2020/04/04/G0uHyV.png)
(4) **在 node 环境直接运行 typescript**: 安装`ts-node`, 然后直接用`ts-node [待运行的ts文件]`就可以了.

## 安装依赖

(1) 本地项目安装 Typescript 和 ts-node，使用`npm install typescript ts-node -D`进行安装, 在项目中新建`tsconfig.json`文件进行 ts 项目初始化, 也可以输入`tsc --init`自动初始化生成配置文件, `tsconfig.json`文件的基本内容有:

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "strict": true,
    "forceConsistentCasingInFileNames": true
}
```

(2) 在 package 脚本中的"dev"中写上"ts-node ./src/[需要运行的 ts 文件]"

:::warning

如果是全局安装 Typescript, 则 ts-node 命令会报错

:::

(3) 安装 superagent 爬取数据, `npm install superagent`, 由于 ts 直接饮用 js 模块会不知道模块的属性和方法, 因此 IDE 中也无法联想出来. 为了解决这个问题, typescript 中采用了`.d.ts`为扩展名的扩展文件(_也可以理解成翻译文件_)进行处理. 可以试图使用`npm install @types/superagent`来安装扩展文件(_在 vscode 中, 把鼠标放到引用的包上去也会有提示_), 一般如果存在 d.ts 文件, 都是以`@types/[包名称]`进行存储.

安装[cheerio](https://github.com/cheeriojs/cheerio)进行 html 文件解析, `npm install cheerio --save`, 并安装相应的`d.ts`文件, `npm install @types/cheerio -D`. `cheerio`用法很简单, 可以按照以前`jquery`的写法来找到对象, 示例代码如下:

```js
const cheerio = require('cheerio') // 导入cheerio包
const $ = cheerio.load('<h2 class="title">Hello world</h2>') // 加载html内容, 赋值给$变量
// 利用$进行查找
$('h2.title').text('Hello there!')
$('h2').addClass('welcome')
// 显示html内容
$.html()
```

## 在 react 项目中使用 Typescript

使用 Typescript 模板安装 react: `npx create-react-app my-app --template typescript --use-npm`, 命令的意思是: 下载最新的 `create-react-app`,并且使用`Typescript`作为模板, 创建`my-app`的文件夹, 创建完毕后, 使用`npm`进行安装.

使用类型断言`!`手动排除`null`和`undifined`, 例如将`frame`改为`frame!`即可.


